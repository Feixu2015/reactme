/**
 * Created by biml on 2017/10/26.
 */
import React, {Component} from "react";
import {Layout, Button, Col, Form, Icon, Input, Pagination, Row, Table, Tooltip, Modal} from "antd";
import {createForm} from "rc-form";
import "./AssetApp.css";
import "fetch-polyfill";
import {log, urlBase} from "./Config";
import {fail, success, utils, EQUIPMENT_STATUS, ErrorNotifyTime, EQUIPMENT_OPERATIONS} from "./Utils";
import EquipmentShow from './EquipmentShow';

/**
 * 资产列表，含“搜索”、“领用”、“退还”、“删除”、“查看”
 */
class EquipmentList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            operationResult: {
                status: null,
                message: null
            },
            officeAddresses: [],
            positions: [],
            searchText: '',
            equipments: [],
            paginationMeta: {
                total: 0,
                pages: 1,
                offset: 1,
                count: 0,
                limit: 10
            },
            // 要显示详情的资产
            equipmentToShow: null,
            equipmentOperation: null
        };
    }

    componentDidMount() {
        this.handleQueryEquipmentList();
    }

    /**
     * 根据关键词查询资产列表
     * @param keyWord 关键词
     * @param pageIndex 页码
     * @param pageSize 每页大小
     */
    handleQueryEquipmentList = (keyWord, pageIndex, pageSize) => {
        const key = utils.isStrEmpty(keyWord) ? "" : keyWord;
        const index = pageIndex ? pageIndex : this.state.paginationMeta.offset;
        const size = pageSize ? pageSize : this.state.paginationMeta.limit;
        this.setState({
            loading: true,
            operationResult: {
                status: null,
                message: null
            }
        });
        fetch(`${urlBase}/equipment/findByPage?keyword=${key}`+
            `&page=${index}&limit=${size}`, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            log("response:", response);
            return response.json()
        }).then((json) => {
            log("json:", json);
            if ("success" === json.status) {
                log("success: items size is ", json.list.length);
                let list = [];
                json.list.forEach((value, index) => {
                    value.key = index;
                    list.push(value);
                });
                this.setState({
                    operationResult: {
                        status: success,
                        message: '查询完成!'
                    },
                    equipments: list,
                    paginationMeta: {
                        total: json.meta.total,
                        pages: json.meta.pages,
                        offset: index,
                        count: json.meta.count,
                        limit: size
                    }
                });
            } else if (fail === json.status) {
                log("fail:", json);
                this.setState({
                    operationResult: {
                        status: fail,
                        message: json.message
                    }
                });
            } else {
                log("fail:", json);
                this.setState({
                    operationResult: {
                        status: fail,
                        message: `${json.status} ${json.message}`
                    }
                });
            }
            this.setState({
                loading: false
            });
            utils.showNotification(this.state.operationResult);
        }).catch((ex) => {
            log("failed:", ex);
            this.setState({
                operationResult: {
                    status: fail,
                    message: ex.message
                },
                loading: false
            });
            utils.showNotification(this.state.operationResult);
        });
    };

    /**
     * 搜索框输入改变
     * @param e
     */
    handleSearchTextChange = (e) => {
        this.setState({
            searchText: e.target.value
        });
    };

    /**
     * 搜索事件处理
     */
    handleSearch = () => {
        this.handleQueryEquipmentList();
    };

    /**
     * 显示/关闭资产领用退还
     * @param equipment 资产,不为空时显示；为空时，隐藏。
     */
    handleEquipmentDetail = (equipment) => {
        log("going to ", equipment ? "show" : "close", " equipment ", JSON.stringify(equipment), " detail.");
        this.setState({
            equipmentToShow: equipment
        });
    };

    /**
     * 关闭领用退还
     */
    handleModalClose = () => {
        this.handleEquipmentDetail(null);
    };

    /**
     * 关闭资产领用、退还，并刷新数据
     */
    handleEquipmentOperationCallback = () => {
        this.handleEquipmentDetail(null);
        this.handleQueryEquipmentList();
    };

    /**
     * 删除资产
     * @param equipmentId 资产的ID
     * @param equipmentName 资产名称
     */
    handleDelete = (equipmentId, equipmentName) => {
        Modal.confirm({
            title: '删除资产',
            content: `确定为删除【${equipmentName}】这个资产?`,
            onOk: (e) => this.handleDoDelete(equipmentId, e),
            onCancel() {
            },
        });
    };

    /**
     * 点击确定离职后的处理
     * @param equipmentId 资产ID
     * @param e Modal关闭函数
     */
    handleDoDelete = (equipmentId, e) => {
        e();//关闭对话框
        fetch(`${urlBase}/equipment/${equipmentId}`, {
            method: 'delete',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            log("response:", response);
            return response.json()
        }).then((json) => {
            log("json:", json);
            if ("success" === json.status) {
                log("success:", json.message);
                this.setState({
                    operationResult: {
                        status: success,
                        message: '处理完成!'
                    }
                });
            } else if (fail === json.status) {
                log("fail:", json);
                this.setState({
                    operationResult: {
                        status: fail,
                        message: json.message,
                        duration: ErrorNotifyTime
                    }
                });
            } else {
                log("fail:", json);
                this.setState({
                    operationResult: {
                        status: fail,
                        message: `${json.status} ${json.message}`,
                        duration: ErrorNotifyTime
                    }
                });
            }
            const operationData = this.state.operationResult;
            utils.showNotification(operationData, this.handleSearch);
        }).catch((ex) => {
            log("failed:", ex);
            const operationResult = {
                status: fail,
                message: ex.message,
                duration: ErrorNotifyTime
            };
            utils.showNotification(operationResult, this.handleSearch);
        });
    };

    /**
     * 设备退还
     * @param equipment 设备信息
     */
    handleReturn = (equipment) => {
        log("return equipment ", equipment.type);
        this.setState({
            equipmentOperation: 'return',
            equipmentToShow: equipment
        });
    };

    /**
     * 设备领用
     * @param equipment 设备信息
     */
    handleReceive = (equipment) => {
        log("receive equipment ", equipment.type);
        this.setState({
            equipmentOperation: 'receive',
            equipmentToShow: equipment
        });
    };

    /**
     * 翻页
     * @param page 要跳转到的页
     * @param pageSize 页大小
     */
    handleChangePage = (page, pageSize) => {
        this.setState((preState, props) => ({
            paginationMeta: {
                total: preState.paginationMeta.total,
                pages: preState.paginationMeta.pages,
                offset: page,
                count: preState.paginationMeta.count,
                limit: pageSize
            }
        }));
        log("pagination:", JSON.stringify(this.state.paginationMeta));
        this.handleQueryEquipmentList(this.state.searchText, page, pageSize);
    };

    render() {
        // 定义资产表格列
        const columns = [{
            title: '资产编号',
            dataIndex: 'code',
            key: 'code'
        }, {
            title: '资产类型',
            dataIndex: 'type',
            key: 'type'
        }, {
            title: '资产品牌',
            dataIndex: 'brand',
            key: 'brand'
        }, {
            title: '资产型号',
            dataIndex: 'model',
            key: 'model'
        }, {
            title: '序列号',
            dataIndex: 'serial',
            key: 'serial'
        }, {
            title: '资产仓库',
            dataIndex: 'repertory',
            key: 'repertory'
        }, {
            title: '入库时间',
            dataIndex: 'storageTime',
            key: 'storageTime'
        }, {
            title: '拆封时间',
            dataIndex: 'unpackingTime',
            key: 'unpackingTime'
        }, {
            title: '资产状态',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => <span>{EQUIPMENT_STATUS[status]}<div className={'inuse' === status ? "status-inuse":"status-unused"}/></span>
        }, {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark'
        }, {
            title: '操作',
            dataIndex: 'id',
            key: 'action',
            render: (id, record) => (
                <div>
                    <span>
                        <Tooltip overlay="编辑" text>
                            <Button type="default" icon="edit" style={{color: 'green'}}
                                    onClick={(e) => this.props.onEquipmentEditClick(id, e)}/>
                        </Tooltip>
                        <span className="ant-divider"/>
                        <Tooltip overlay="删除" text>
                            <Button type="default" icon="delete" style={{color: 'orange'}}
                                    onClick={(e) => this.handleDelete(id, record.type, e)}/>
                        </Tooltip>
                        <span className="ant-divider"/>
                        {
                            "inuse" === record.status ?
                                (
                                    <Tooltip overlay="退还" text>
                                        <Button type="default" icon="login" style={{color: 'red'}}
                                                onClick={(e) => this.handleReturn(record, e)}/>
                                    </Tooltip>
                                ) :
                                (
                                    <Tooltip overlay="领用" text>
                                        <Button type="default" icon="logout" style={{color: 'blue'}}
                                                onClick={(e) => this.handleReceive(record, e)}/>
                                    </Tooltip>
                                )
                        }
                    </span>
                </div>
            )
        }];
        // 表格行样式
        const rowClassName = (record, index) => {
            if(record.status === 'inuse'){
                return 'table-row-grid'
            }else{
                return ''
            }
        };
        // 表格数据
        const data = this.state.equipments;
        const paginationTotal = this.state.paginationMeta.total;
        const paginationCurrent = this.state.paginationMeta.offset;
        const paginationSize = this.state.paginationMeta.limit;
        const searchText = this.state.searchText;
        const equipmentToShow = this.state.equipmentToShow;
        const equipmentOperation = this.state.equipmentOperation;
        return (
            <div>
                <Row>
                    <Col className="centered">
                        <h2 className="padding-top-bottom-16">资产列表</h2>
                    </Col>
                    <Col>
                        <Input placeholder="输入编号搜索" style={{width: 200}} value={searchText}
                               onChange={this.handleSearchTextChange}
                               suffix={<Button className="search-btn" type="primary" size="small" icon="search"
                                               onClick={this.handleSearch}/>}/>
                        <div className="ant-divider"/>
                        <Button icon="plus" onClick={this.props.onEquipmentAddClickCallback}>添加资产</Button>
                    </Col>
                    <Col style={{marginTop: 8}}>
                        <Table columns={columns} dataSource={data} loading={this.state.loading}
                               rowClassName={rowClassName} pagination={false}/>
                        <Pagination current={paginationCurrent}
                                    total={paginationTotal} onChange={this.handleChangePage}
                                    pageSize={paginationSize}/>
                    </Col>
                </Row>
                {
                    equipmentToShow &&
                    <Modal title={<span className="centered">{`资产${EQUIPMENT_OPERATIONS[equipmentOperation]}`}</span>}
                           visible={true} onCancel={this.handleModalClose} closable footer={null}>
                        {<EquipmentShow equipment={equipmentToShow} operation={equipmentOperation}
                                        onEquipmentOperationCallback={this.handleEquipmentOperationCallback}
                                        onClose={this.handleModalClose}/>}
                    </Modal>
                }
            </div>
        );
    }
}
export default EquipmentList;