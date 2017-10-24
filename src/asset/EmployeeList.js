/**
 * Created by biml on 2017/10/23.
 */
import React, {Component} from "react";
import {Form, Row, Col, Icon, Button, Input, Select, DatePicker, Alert} from "antd";
import {createForm} from "rc-form";
import "./AssetApp.css";
import "fetch-polyfill";
import {log, urlBase} from "./Config";
import {utils} from './Utils';
import Moment from 'moment';

/**
 * 员工列表组件
 */
class EmployeeList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            failMsg: '',
            officeAddresses: [],
            positions: [],
            pageIndex: 1
        };
    }

    componentDidMount() {
        this.handleQueryEmployeeList();
    }

    /**
     * 根据关键词查询员工列表
     * @param keyWord 关键词
     */
    handleQueryEmployeeList = (keyWord)=>{
        const pageIndex = this.state.pageIndex;
        const formData = JSON.stringify(values);
        log('received values of form:', formData);
        fetch(urlBase + `/employee/findByPage?keyword=${keyWord?"":keyWord}&page=${pageIndex}&limit=10`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: formData
        }).then((response) => {
            log("response:", response);
            return response.json()
        }).then((json) => {
            log("json:", json);
            if ("success" === json.status) {
                this.setState({
                    failMsg: 'success',
                    userName: values.userName
                });
                log("success:", values.userName)
                setTimeout(() => {
                    // 1秒后执行添加成功后的回调
                    if (this.props.onEmployeeAddCallback) {
                        this.props.onEmployeeAddCallback(values.code);
                    }
                }, 1000);
            } else if ('fail' === json.status) {
                log("fail:", json);
                this.setState({
                    failMsg: json.message
                });
            } else {
                log("fail:", json);
                this.setState({
                    failMsg: `${json.status} ${json.message}`
                });
            }
        }).catch((ex) => {
            log("failed:", ex);
            this.setState({
                failMsg: ex.message
            });
        });
    };

    /**
     * 选择办公地点事件处理
     * @param e
     */
    handleOfficeAddressChange = (e) => {

    };

    /**
     * 选择入职时间处理
     * @param e
     */
    handleInductionDateChange = (e) => {
        const date = e.format('YYYY-MM-DD')
        log("inductionDate:", date);
    };

    /**
     * 表单提交处理
     * @param e
     */
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const employeeName = values.name;
                this.handleQueryEmployeeList(employeeName);
            } else {
                this.setState({
                    failMsg: utils.combineValidateError(err).map((e) => <div key={e}>{e}</div>)
                });
                log(this.state.failMsg);
            }
        });
    };

    render() {
        const FormItem = Form.Item;
        const {getFieldDecorator} = this.props.form;
        const failMsg = this.state.failMsg;
        return (
            <Row>
                <Col className="centered">
                    <h2 className="padding-top-bottom-20">添 加 员 工</h2>
                </Col>
                <Col span={6} offset={9}>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <FormItem>
                            {getFieldDecorator('employeeName', {
                                rules: [{required: true, message: '请输入员工姓名!'}],
                            })(
                                <Input prefix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="员工姓名"
                                       ref={(input) => {
                                           this.textInput = input;
                                       }}/>
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="margin-right-16"
                                    onClick={this.handleSubmit}>确认</Button>
                            <Button type="default">取消</Button>
                        </FormItem>
                    </Form>
                    {
                        '' === failMsg ?
                            ('') :
                            ('success' === failMsg ?
                                    (<Alert message="添加成功！" type="success" showIcon/>) :
                                    (<Alert message={failMsg} type="error" showIcon/>)
                            )
                    }
                </Col>
            </Row>
        );
    }
}

export default createForm()(EmployeeList);