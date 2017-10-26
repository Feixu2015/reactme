/**
 * Created by biml on 2017/10/26.
 */
import React, {Component} from "react";
import {Form, Row, Col, Icon, Button, Input, Select, DatePicker, Alert, notification} from "antd";
import {createForm} from "rc-form";
import "./AssetApp.css";
import "fetch-polyfill";
import {log, urlBase} from "./Config";
import {utils, success, fail} from './Utils';
import moment from 'moment';

/**
 * 编辑资产组件
 */
class EquipmentEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            operationResult: {
                status: null,
                message: null
            },
            dict:{
                brands: [],
                types: [],
                repertories: []
            },
            equipment: {}
        };
    }

    componentDidMount() {
        // get brands
        fetch(urlBase + "/dict/listByTypeCode?typeCode=006", {
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
            let brands = [];
            if (success === json.status) {
                log("success:", json.message);
                this.setState({
                    operationResult: {
                        status: null,
                        message: null
                    }
                });
                json.list.forEach((value) => {
                    brands.push(value.name)
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
                brands: brands
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

        // get types
        fetch(urlBase + "/dict/listByTypeCode?typeCode=005", {
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
            let types = [];
            if (success === json.status) {
                log("success:", json.message);
                this.setState({
                    operationResult: {
                        status: null,
                        message: null
                    }
                });
                json.list.forEach((value) => {
                    types.push(value.name)
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
                types: types
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

        // get repertory
        fetch(urlBase + "/dict/listByTypeCode?typeCode=002", {
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
            let repertories = [];
            if (success === json.status) {
                log("success:", json.message);
                this.setState({
                    operationResult: {
                        status: null,
                        message: null
                    }
                });
                json.list.forEach((value) => {
                    repertories.push(value.name)
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
                repertories: repertories
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

        // get equipment
        fetch(urlBase + `/equipment/${this.props.param.equipmentId}`, {
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
                        status: null,
                        message: null
                    }
                });
                this.setState({
                    equipment: json.item
                });
                log("equipment:", JSON.stringify(json.item));
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
                    operationResult: {
                        status: null,
                        message: null
                    }
                });
                // 日期转换
                values.inductionDate = values.inductionDate.format('YYYY-MM-DD HH:mm:ss');
                const formData = JSON.stringify(values);
                log('received values of form:', formData);
                fetch(urlBase + `/equipment/${this.props.param.equipmentId}`, {
                    method: 'put',
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
                            if (this.props.onEquipmentEditCallback) {
                                this.props.onEquipmentEditCallback(values.code);
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
                    <h2 className="padding-top-bottom-16">资产编辑</h2>
                </Col>
                <Col span={6} offset={9}>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <FormItem label="资产姓名">
                            {getFieldDecorator('name', {
                                initialValue: this.state.equipment.name,
                                rules: [{required: true, message: '请输入资产姓名!'}],
                            })(
                                <Input suffix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="资产姓名"
                                       ref={(input) => this.textInput = input}/>
                            )}
                        </FormItem>
                        <FormItem label="资产编号">
                            {getFieldDecorator('code', {
                                initialValue: this.state.equipment.code,
                                rules: [{required: true, message: '请输资产编号!'}],
                            })(
                                <Input suffix={<Icon type="info" style={{fontSize: 13}}/>}
                                       placeholder="资产编号"/>
                            )}
                        </FormItem>
                        <FormItem label="办公地址">
                            {getFieldDecorator('officeAddress', {
                                initialValue: this.state.equipment.officeAddress,
                                rules: [{required: true, message: '请选择办公地址!'}],
                            })(
                                <Select style={{width: '100%'}} placeholder="请选择办公地址">
                                    {officeAddressOptions}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="入职日期">
                            {getFieldDecorator('inductionDate', {
                                initialValue: moment(this.state.equipment.inductionDate, "YYYY-MM-DD HH:mm:ss"),
                                rules: [{required: true, message: '请选择入职日期!'}],
                            })(
                                <DatePicker prefix={<Icon type="user" style={{fontSize: 13}}/>} style={{width: '100%'}}
                                            onChange={this.handleInductionDateChange} format="YYYY-MM-DD"
                                            placeholder="入职日期"/>
                            )}
                        </FormItem>
                        <FormItem label="资产职位">
                            {getFieldDecorator('position', {
                                initialValue: this.state.equipment.position,
                                rules: [{required: true, message: '请选择职位!'}],
                            })(
                                <Select style={{width: '100%'}} placeholder="请选择职位">
                                    {positions}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="备注">
                            {getFieldDecorator('remark', {
                                initialValue: this.state.equipment.remark,
                                rules: [{required: false, message: ''}],
                            })(
                                <TextArea rows={3} maxLength="200" type={{width: '100%'}} placeholder="备注"/>
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="margin-right-16"
                                    onClick={this.handleSubmit}>保存</Button>
                            <Button type="default" onClick={this.props.onEquipmentEditCancelCallback}>取消</Button>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        );
    }
}

export default createForm()(EquipmentEdit);