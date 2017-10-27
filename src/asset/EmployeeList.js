/**
 * Created by biml on 2017/10/23.
 */
import React, {Component} from "react";
import {Layout, Button, Col, Form, Icon, Input, Pagination, Row, Table, Tooltip, Modal} from "antd";
import {createForm} from "rc-form";
import "./AssetApp.css";
import "fetch-polyfill";
import {log, urlBase} from "./Config";
import {fail, success, utils, employeeStatus, ErrorNotifyTime} from "./Utils";
import EmployeeShow from './EmployeeShow';

/**
 * 员工列表组件
 */
class EmployeeList extends Component {
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
            employees:[],
            paginationMeta: {
                total: 0,
                pages: 1,
                offset: 1,
                count: 0,
                limit: 10
            },
            // 要显示详情的员工
            employeeToShow: null,
            employeeIdToDimission: ''
        };
    }

    componentDidMount() {
        this.handleQueryEmployeeList();
    }

    /**
     * 根据关键词查询员工列表
     * @param keyWord 关键词
     * @param pageIndex 页码
     * @param pageSize 每页大小
     */
    handleQueryEmployeeList = (keyWord, pageIndex, pageSize) => {
        const index = pageIndex ? pageIndex : this.state.paginationMeta.offset;
        const size = pageSize ? pageSize : this.state.paginationMeta.limit;
        this.setState({
            loading: true,
            operationResult: {
                status: null,
                message: null
            }
        });
        fetch(`${urlBase}/employee/findByPage?keyword=${ utils.isStrEmpty(keyWord) ? "" : keyWord}&page=${index}&limit=${size}`, {
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
                    employees:list,
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
        this.handleQueryEmployeeList(this.state.searchText);
    };

    /**
     * 显示/关闭员工详情
     * @param employee 员工,不为空时显示；为空时，隐藏。
     */
    handleEmployeeDetail = (employee) => {
        log("going to ", employee ? "show" : "close"," employee ", JSON.stringify(employee), " detail.");
        this.setState({
            employeeToShow: employee
        });
    };

    /**
     * 关闭详情
     */
    handleModalClose = ()=>{
        this.handleEmployeeDetail(null);
    };

    /**
     * 员工离职
     * @param employeeId 员工的ID
     * @param employeeName 员工姓名
     */
    handleDimission = (employeeId, employeeName) => {
        Modal.confirm({
            title: '员工离职',
            content: `确定为员工【${employeeName}】办理离职?`,
            onOk: (e)=>this.handleDoDimission(employeeId, e),
            onCancel() {},
        });
    };

    /**
     * 点击确定离职后的处理
     * @param employeeId 员工ID
     * @param e Modal关闭函数
     */
    handleDoDimission = (employeeId, e) => {
        e();//关闭对话框
        fetch(`${urlBase}/employee/dimission/${employeeId}`,{
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
        // 定义员工表格列
        const columns = [{
            title: '姓名',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: '工号',
            dataIndex: 'code',
            key: 'code',
            render: (text, record) =>
                <Tooltip overlay="查看详情" text>
                    <span className="link-blue" onClick={(e)=>this.handleEmployeeDetail(record, e)}>{text}</span>
                </Tooltip>
        }, {
            title: '办公地址',
            dataIndex: 'officeAddress',
            key: 'officeAddress',
        }, {
            title: '入职日期',
            dataIndex: 'inductionDate',
            key: 'inductionDate',
        }, {
            title: '职位',
            dataIndex: 'position',
            key: 'position',
        }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render:(text, record)=> {
                return (<span>{employeeStatus[text]}</span>);
            }
        }, {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        }, {
            title: '操作',
            dataIndex: 'id',
            key: 'action',
            render: (id, record) => (
             'induction' === record.status ?
                (<span>
                    <Tooltip overlay="编辑" text>
                        <Button type="default" icon="edit" style={{color: 'green'}}
                                onClick={(e) => this.props.onEmployeeEditClick(id, e)}/>
                    </Tooltip>
                    < span className="ant-divider"/>
                        <Tooltip overlay="离职" text>
                        <Button type="default" icon="user-delete" style={{color:'red'}}
                        onClick={(e) => this.handleDimission(id, record.name, e)}/>
                    </Tooltip>
                </span>):
                null
            )
        }];
        // 表格数据
        const data = this.state.employees;
        const paginationTotal = this.state.paginationMeta.total;
        const paginationCurrent = this.state.paginationMeta.offset;
        const paginationSize = this.state.paginationMeta.limit;
        const searchText = this.state.searchText;
        return (
            <div>
                <Row>
                    <Col className="centered">
                        <h2 className="padding-top-bottom-16">员工列表</h2>
                    </Col>
                    <Col>
                        <Input placeholder="输入姓名搜索" style={{width: 200}} value={searchText}
                               onChange={this.handleSearchTextChange}
                               suffix={<Button className="search-btn" type="primary" size="small" icon="search"
                                               onClick={this.handleSearch}/>}/>
                        <div className="ant-divider"/>
                        <Button icon="plus" onClick={this.props.onEmployeeAddClickCallback}>添加员工</Button>
                    </Col>
                    <Col style={{marginTop: 8}}>
                        <Table columns={columns} dataSource={data} loading={this.state.loading}
                               pagination={false}/>
                        <Pagination current={paginationCurrent}
                                    total={paginationTotal} onChange={this.handleChangePage}
                                    pageSize={paginationSize}/>
                    </Col>
                </Row>
                {
                    this.state.employeeToShow &&
                    <Modal title="员工详情" visible={true} onCancel={this.handleModalClose} closable footer={null}>
                        {<EmployeeShow employee={this.state.employeeToShow} onClose={this.handleModalClose}/>}
                    </Modal>
                }
            </div>
        );
    }
}

export default createForm()(EmployeeList);