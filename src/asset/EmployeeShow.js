/**
 * Created by biml on 2017/10/23.
 */
import React, {Component} from "react";
import {Form, Row, Col, Table, Icon, Button, Input, Select, DatePicker, Alert, notification} from "antd";
import {createForm} from "rc-form";
import "./AssetApp.css";
import "fetch-polyfill";
import {log, urlBase} from "./Config";
import {fail, success, utils, EMPLOYEE_STATUS} from "./Utils";
import moment from 'moment';

/**
 * 员工详情组件,显示员工的信息和已领用的资产列表
 */
class EmployeeShow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            operationResult: {
                status: null,
                message: null
            }
        };
    }

    render() {
        const columns = [{
            title: '编号',
            dataIndex: 'code',
            key: 'code'
        }];
        return (
            <Row>
                <Col>
                    <Row>
                        <Col span={3}>
                            员工姓名：
                        </Col>
                        <Col span={4}>
                            <span>{this.props.employee.name}</span>
                        </Col>
                        <Col span={3} offset={2}>
                            员工工号：
                        </Col>
                        <Col span={4}>
                            <span>{this.props.employee.code}</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={3}>
                            办公地址：
                        </Col>
                        <Col span={4}>
                            <span>{this.props.employee.officeAddress}</span>
                        </Col>
                        <Col span={3} offset={2}>
                            入职时间：
                        </Col>
                        <Col span={4}>
                            <span>{this.props.employee.inductionDate.substr(0,10)}</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={3}>
                            员工职位：
                        </Col>
                        <Col span={4}>
                            <span>{this.props.employee.position}</span>
                        </Col>
                        <Col span={3} offset={2}>
                            员工状态：
                        </Col>
                        <Col span={4}>
                            <span>{EMPLOYEE_STATUS[this.props.employee.status]}</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={3}>
                            <pre>备   注:</pre>
                        </Col>
                        <Col span={12}>
                            <span>{this.props.employee.remark}</span>
                        </Col>
                    </Row>
                </Col>
                <Col style={{border:'0.5px solid lightgray', margin:'10px 0'}}>
                </Col>
                <Col>
                    <Table columns={columns} dataSource={null} />
                </Col>
            </Row>
        );
    }
}

export default EmployeeShow;