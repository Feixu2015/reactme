/**
 * Created by ice_b on 2017/10/28.
 */
import React, {Component} from "react";
import {Layout, Button, Col, Form, Icon, Input, Pagination, Row, Table, Tooltip, Modal} from "antd";
import {createForm} from "rc-form";
import "./AssetApp.css";
import "fetch-polyfill";
import {log, urlBase} from "./Config";
import {fail, success, utils, EMPLOYEE_STATUS, ErrorNotifyTime} from "./Utils";
import EmployeeShow from './EmployeeShow';

/**
 * 员工选择组件
 * status: 根据员工状态筛选 induction、dimission
 */
class EmployeeSelect extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            operationResult: {
                status: null,
                message: null
            },
            employees:[],
            paginationMeta: {
                total: 0,
                pages: 1,
                offset: 1,
                count: 0,
                limit: 5 // 每页显示五条
            }
        }
    }

    componentDidMount(){
        this.handleQueryEmployeeList(null);
    }

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
        fetch(`${urlBase}/employee/findByPage?keyword=${ utils.isStrEmpty(keyWord) ? "" : keyWord}`
            + `&status=${this.props.status ? this.props.status : ""}&page=${index}&limit=${size}`, {
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
        this.handleQueryEmployeeList(this.state.searchText, page, pageSize);
    };

    render(){
        // 定义员工表格列
        const columns = [{
            title: '姓名',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: '工号',
            dataIndex: 'code',
            key: 'code',
            /*render: (text, record) =>
                <Tooltip overlay="查看已领用资产" text>
                    <span className="link-blue" onClick={(e)=>this.handleEmployeeDetail(record, e)}>{text}</span>
                </Tooltip>*/
        }, {
            title: '办公地址',
            dataIndex: 'officeAddress',
            key: 'officeAddress',
        }, {
            title: '入职日期',
            dataIndex: 'inductionDate',
            key: 'inductionDate',
            render: (inductionDate, record) => <span>{inductionDate.substr(0,10)}</span>
        }, {
            title: '职位',
            dataIndex: 'position',
            key: 'position',
        }];
        // 表格数据
        const data = this.state.employees;
        const rowSelection = {
            type: 'radio',
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                this.props.onSelectChange(selectedRows[0])
            },
            getCheckboxProps: record => ({
                disabled: false // 配置列不可选择的条件
            }),
        };
        // 分页
        const paginationTotal = this.state.paginationMeta.total;
        const paginationCurrent = this.state.paginationMeta.offset;
        const paginationSize = this.state.paginationMeta.limit;
        const searchText = this.state.searchText;
        return (
            <div>
                <Row>
                    <Col>
                        <Input placeholder="输入姓名/工号筛选" style={{width: 200}} value={searchText}
                               onChange={this.handleSearchTextChange}
                               suffix={<Button className="search-btn" type="primary" size="small" icon="search"
                                               onClick={this.handleSearch}/>}/>
                    </Col>
                    <Col style={{marginTop: 8}}>
                        <Table columns={columns} dataSource={data} rowSelection={rowSelection}
                               loading={this.state.loading} pagination={false}/>
                        <Pagination current={paginationCurrent} size="small" total={paginationTotal}
                                    onChange={this.handleChangePage} pageSize={paginationSize}/>
                    </Col>
                </Row>
            </div>
        );
    }
}
export default EmployeeSelect;