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
 * 添加员工组件
 */
class EmployeeAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            failMsg: '',
            officeAddresses: [],
            positions: []
        };
    }

    componentDidMount() {
        // get office Addresses
        fetch(urlBase + "/dict/listByTypeCode?typeCode=574304b1-b726-11e7-828b-0a0027000009", {
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
            if ("success" === json.status) {
                log("success:", json.message);
                json.list.forEach((value) => {
                    officeAddresses.push(value.name)
                });
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
            this.setState({
                officeAddresses: officeAddresses
            });
        }).catch((ex) => {
            log("failed:", ex);

        });


        // get position
        fetch(urlBase + "/dict/listByTypeCode?typeCode=5742cc8f-b726-11e7-828b-0a0027000009", {
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
            if ("success" === json.status) {
                log("success:", json.message);
                json.list.forEach((value) => {
                    positions.push(value.name)
                });
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
            this.setState({
                positions: positions
            });
        }).catch((ex) => {
            log("failed:", ex);

        });
    }

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
                this.setState({
                    failMsg: ''
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
        const Option = Select.Option;
        const {TextArea} = Input;
        const {getFieldDecorator} = this.props.form;
        const failMsg = this.state.failMsg;
        {/*办公地址选项*/}
        const officeAddressOptions = this.state.officeAddresses.map((value) =>
            <Option value={value} key={value}>{value}</Option>);
        {/*职位选项*/}
        const positions = this.state.positions.map((value) =>
            <Option value={value} key={value}>{value}</Option>);
        return (
            <Row>
                <Col className="centered">
                    <h2 className="padding-top-bottom-20">添 加 员 工</h2>
                </Col>
                <Col span={6} offset={9}>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <FormItem label="员工姓名">
                            {getFieldDecorator('name', {
                                rules: [{required: true, message: '请输入员工姓名!'}],
                            })(
                                <Input prefix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="员工姓名"
                                       ref={(input) => {
                                           this.textInput = input;
                                       }}/>
                            )}
                        </FormItem>
                        <FormItem label="员工编号">
                            {getFieldDecorator('code', {
                                rules: [{required: true, message: '请输员工编号!'}],
                            })(
                                <Input prefix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="员工编号"/>
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
                                rules: [{required: true, message: '请选择入职日期!'}],
                            })(
                                <DatePicker prefix={<Icon type="user" style={{fontSize: 13}}/>} style={{width: '100%'}}
                                            onChange={this.handleInductionDateChange} format="YYYY-MM-DD HH:mm:ss"
                                            placeholder="入职日期"/>
                            )}
                        </FormItem>
                        <FormItem label="员工职位">
                            {getFieldDecorator('positions', {
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
                                <TextArea rows={4} maxLength="200" type={{width: '100%'}} placeholder="备注"/>
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

export default createForm()(EmployeeAdd);