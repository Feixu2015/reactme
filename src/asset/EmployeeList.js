/**
 * Created by biml on 2017/10/23.
 */
import React, {Component} from "react";
import {Button, Col, Form, Icon, Input, Pagination, Row, Table, Tooltip} from "antd";
import {createForm} from "rc-form";
import "./AssetApp.css";
import "fetch-polyfill";
import {log, urlBase} from "./Config";
import {fail, success, utils, employeeStatus} from "./Utils";

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
            employees: {
                list: [],
                meta: {
                    total: 0,
                    pages: 1,
                    offset: 1,
                    count: 0,
                    limit: 10
                }
            }
        };
    }

    componentDidMount() {
        this.handleQueryEmployeeList();
    }

    /**
     * 根据关键词查询员工列表
     * @param keyWord 关键词
     */
    handleQueryEmployeeList = (keyWord) => {
        const pageIndex = this.state.employees.meta.offset;
        this.setState({
            loading: true,
            operationResult: {
                status: null,
                message: null
            }
        });
        fetch(urlBase + `/employee/findByPage?keyword=${ utils.isStrEmpty(keyWord) ? "" : keyWord}&page=${pageIndex}&limit=10`, {
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
                    employees: {
                        list: list,
                        meta: json.meta
                    }
                });
            } else if (fail === json.status) {
                log("fail:", json);
                this.setState({
                    operationResult: {
                        status: success,
                        message: json.message
                    }
                });
            } else {
                log("fail:", json);
                this.setState({
                    operationResult: {
                        status: success,
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
                    status: success,
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

    render() {
        // 定义员工表格列
        const columns = [{
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            render: text => <a href="">{text}</a>,
        }, {
            title: '工号',
            dataIndex: 'code',
            key: 'code',
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
            key: 'status',
            render:(text, record)=> {
                return (<span>{employeeStatus[text.status]}</span>);
            }
        }, {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Tooltip overlay="编辑" text>
                        <Button type="default" icon="edit" style={{color:'green'}} onClick={(e)=>this.props.onEmployeeEditClick(text.code, e)}/>
                    </Tooltip>
                    <span className="ant-divider"/>
                    <Tooltip overlay="离职" text>
                        <Button type="default" icon="user-delete" style={{color:'red'}}/>
                    </Tooltip>
                </span>
            ),
        }];
        // 表格数据
        const data = this.state.employees.list;
        const paginationTotal = this.state.employees.meta.total;
        const paginationCurrent = this.state.employees.meta.offset;
        const searchText = this.state.searchText;
        return (
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
                           pagination={<Pagination defaultCurrent={1} current={paginationCurrent}
                                                   total={paginationTotal}/>}/>
                </Col>
            </Row>
        );
    }
}

export default createForm()(EmployeeList);