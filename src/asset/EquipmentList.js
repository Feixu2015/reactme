/**
 * Created by biml on 2017/10/26.
 */
import React, {Component} from "react";
import {Layout, Button, Col, Form, Icon, Input, Pagination, Row, Table, Tooltip, Modal} from "antd";
import {createForm} from "rc-form";
import "./AssetApp.css";
import "fetch-polyfill";
import {log, urlBase} from "./Config";
import {fail, success, utils, equipmentStatus, ErrorNotifyTime} from "./Utils";
import EquipmentShow from './EquipmentShow';

/**
 * 资产列表，含“搜索”、“领用”、“退还”、“删除”、“查看”
 */
class EquipmentList extends Component{
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
            equipments: {
                list: [],
                meta: {
                    total: 0,
                    pages: 1,
                    offset: 1,
                    count: 0,
                    limit: 10
                }
            },
            // 要显示详情的资产
            equipmentToShow: null,
            equipmentIdToDimission: ''
        };
    }

    componentDidMount() {
        this.handleQueryEquipmentList();
    }

    /**
     * 根据关键词查询资产列表
     * @param keyWord 关键词
     */
    handleQueryEquipmentList = (keyWord) => {
        const pageIndex = this.state.equipments.meta.offset;
        this.setState({
            loading: true,
            operationResult: {
                status: null,
                message: null
            }
        });
        fetch(urlBase + `/equipment/findByPage?keyword=${ utils.isStrEmpty(keyWord) ? "" : keyWord}&page=${pageIndex}&limit=10`, {
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
                    equipments: {
                        list: list,
                        meta: json.meta
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
        this.handleQueryEquipmentList(this.state.searchText);
    };

    /**
     * 显示/关闭资产详情
     * @param equipment 资产,不为空时显示；为空时，隐藏。
     */
    handleEquipmentDetail = (equipment) => {
        log("going to ", equipment ? "show" : "close"," equipment ", JSON.stringify(equipment), " detail.");
        this.setState({
            equipmentToShow: equipment
        });
    };

    /**
     * 关闭详情
     */
    handleModalClose = ()=>{
        this.handleEquipmentDetail(null);
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
            onOk: (e)=>this.handleDoDimission(equipmentId, e),
            onCancel() {},
        });
    };

    /**
     * 点击确定离职后的处理
     * @param equipmentId 资产ID
     * @param e Modal关闭函数
     */
    handleDoDimission = (equipmentId, e) => {
        e();//关闭对话框
        fetch(`${urlBase}/equipment/dimission/${equipmentId}`,{
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
    };

    /**
     * 设备领用
     * @param equipment 设备信息
     */
    handleReceive = (equipment) => {
        log("receive equipment ", equipment.type);
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
            render:(status, record)=><span>{equipmentStatus[status]}</span>
        }, {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark'
        }, {
            title: '操作',
            dataIndex: 'id',
            key: 'action',
            render:(id, record)=>(
                <div>
                    <span>
                        <Tooltip overlay="编辑" text>
                            <Button type="default" icon="edit" style={{color:'green'}}
                                    onClick={(e)=>this.props.onEquipmentEditClick(id, e)}/>
                        </Tooltip>
                        <span className="ant-divider"/>
                        <Tooltip overlay="删除" text>
                            <Button type="default" icon="delete" style={{color:'red'}}
                                    onClick={(e) => this.handleDelete(id, record.name, e)}/>
                        </Tooltip>
                        <span className="ant-divider"/>
                        {
                            "inuse" === record.state ?
                                (
                                    <Tooltip overlay="退回" text>
                                        <Button type="default" icon="select" style={{color: 'orange'}}
                                                onClick={(e) => this.handleReturn(record, e)}/>
                                    </Tooltip>
                                ) :
                                (
                                    <Tooltip overlay="领用" text>
                                        <Button type="default" icon="export" style={{color: 'blue'}}
                                                onClick={(e) => this.handleReceive(record, e)}/>
                                    </Tooltip>
                                )
                        }
                    </span>
                </div>
            )
        }];
        // 表格数据
        const data = this.state.equipments.list;
        const paginationTotal = this.state.equipments.meta.total;
        const paginationCurrent = this.state.equipments.meta.offset;
        const searchText = this.state.searchText;
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
                               pagination={<Pagination defaultCurrent={1} current={paginationCurrent}
                                                       total={paginationTotal}/>}/>
                    </Col>
                </Row>
                {
                    this.state.equipmentToShow &&
                    <Modal title="资产详情" visible={true} onCancel={this.handleModalClose} closable footer={null}>
                        {<EquipmentShow equipment={this.state.equipmentToShow} onClose={this.handleModalClose}/>}
                    </Modal>
                }
            </div>
        );
    }
}
export default EquipmentList;