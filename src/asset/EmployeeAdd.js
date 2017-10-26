/**
 * Created by biml on 2017/10/23.
 */
import React, {Component} from "react";
import {Form, Row, Col, Icon, Button, Input, Select, DatePicker, Alert, notification} from "antd";
import {createForm} from "rc-form";
import moment from 'moment';
import "./AssetApp.css";
import "fetch-polyfill";
import {log, urlBase} from "./Config";
import {utils, success, fail} from './Utils';

/**
 * 添加员工组件
 */
class EmployeeAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            operationResult: {
                status: null,
                message: null
            },
            officeAddresses: [],
            positions: []
        };
    }

    componentDidMount() {
        // get office Addresses
        fetch(urlBase + "/dict/listByTypeCode?typeCode=003", {
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
            let officeAddresses = [];
            if (success === json.status) {
                log("success:", json.message);
                this.setState({
                    operationResult: {
                        status: null,
                        message: null
                    }
                });
                json.list.forEach((value) => {
                    officeAddresses.push(value.name)
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
                officeAddresses: officeAddresses
            });
            utils.showNotification(this.state.operationResult);
        }).catch((ex) => {
            log("fail:", ex);
            this.setState({
                operationResult: {
                    status: fail,
                    message: ex.message
                }
            });
            utils.showNotification(this.state.operationResult);
        });


        // get position
        fetch(urlBase + "/dict/listByTypeCode?typeCode=001", {
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
            let positions = [];
            if (success === json.status) {
                log("success:", json.message);
                this.setState({
                    operationResult: {
                        status: null,
                        message: null
                    }
                });
                json.list.forEach((value) => {
                    positions.push(value.name)
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
                positions: positions
            });
            utils.showNotification(this.state.operationResult);
        }).catch((ex) => {
            log("failed:", ex);
            this.setState({
                operationResult: {
                    status: fail,
                    message: ex.message
                }
            });
            utils.showNotification(this.state.operationResult);
        });
    }

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
                this.setState({
                    operationResult: {
                        status: null,
                        message: null
                    }
                });
                // 日期转换
                values.inductionDate = values.inductionDate.format('YYYY-MM-DD HH:mm:ss');
                const formData = JSON.stringify(values);
                log('received values of form:', formData);
                fetch(urlBase + "/employee", {
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
                        log("success:", values.userName);
                        this.setState({
                            operationResult: {
                                status: success,
                                message: values.userName
                            }
                        });
                        setTimeout(() => {
                            // 1秒后执行添加成功后的回调
                            if (this.props.onEmployeeAddCallback) {
                                this.props.onEmployeeAddCallback(values.code);
                            }
                        }, 1000);
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
                    utils.showNotification(this.state.operationResult);
                }).catch((ex) => {
                    log("failed:", ex);
                    this.setState({
                        operationResult: {
                            status: fail,
                            message: ex.message
                        }
                    });
                    utils.showNotification(this.state.operationResult);
                });
            } else {
                this.setState({
                    operationResult: {
                        status: fail,
                        message: utils.combineValidateError(err).map((e) => <div key={e}>{e}</div>)
                    }
                });
                log(this.state.operationResult.message);
                utils.showNotification(this.state.operationResult);
            }
        });
    };

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {TextArea} = Input;
        const {getFieldDecorator} = this.props.form;
        {/*办公地址选项*/
        }
        const officeAddressOptions = this.state.officeAddresses.map((value) =>
            <Option value={value} key={value}>{value}</Option>);
        {/*职位选项*/
        }
        const positions = this.state.positions.map((value) =>
            <Option value={value} key={value}>{value}</Option>);
        return (
            <Row>
                <Col className="centered">
                    <h2 className="padding-top-bottom-16">添 加 员 工</h2>
                </Col>
                <Col span={6} offset={9}>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <FormItem label="员工姓名">
                            {getFieldDecorator('name', {
                                rules: [{required: true, message: '请输入员工姓名!'}],
                            })(
                                <Input suffix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="员工姓名"
                                       ref={(input) => {
                                           this.textInput = input;
                                       }}/>
                            )}
                        </FormItem>
                        <FormItem label="员工工号">
                            {getFieldDecorator('code', {
                                rules: [{required: true, message: '请输员工工号!'}],
                            })(
                                <Input suffix={<Icon type="info" style={{fontSize: 13}}/>} placeholder="员工工号"/>
                            )}
                        </FormItem>
                        <FormItem label="办公地址">
                            {getFieldDecorator('officeAddress', {
                                rules: [{required: true, message: '请选择办公地址!'}],
                            })(
                                <Select style={{width: '100%'}} placeholder="请选择办公地址"
                                        onChange={this.handleOfficeAddressChange}>
                                    {officeAddressOptions}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="入职日期">
                            {getFieldDecorator('inductionDate', {
                                initialValue: moment(),
                                rules: [{required: true, message: '请选择入职日期!'}],
                            })(
                                <DatePicker prefix={<Icon type="user" style={{fontSize: 13}}/>} style={{width: '100%'}}
                                            onChange={this.handleInductionDateChange} format="YYYY-MM-DD"
                                            placeholder="入职日期"/>
                            )}
                        </FormItem>
                        <FormItem label="员工职位">
                            {getFieldDecorator('position', {
                                rules: [{required: true, message: '请选择职位!'}],
                            })(
                                <Select style={{width: '100%'}} placeholder="请选择职位"
                                        onChange={this.handleOfficeAddressChange}>
                                    {positions}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="备注">
                            {getFieldDecorator('remark', {
                                rules: [{required: false, message: ''}],
                            })(
                                <TextArea rows={3} maxLength="200" type={{width: '100%'}} placeholder="备注"/>
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="margin-right-16"
                                    onClick={this.handleSubmit}>确认</Button>
                            <Button type="default" onClick={this.props.onEmployeeAddCancelCallback}>取消</Button>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        );
    }
}

export default createForm()(EmployeeAdd);