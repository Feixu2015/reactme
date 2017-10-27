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
            equipment:{},
            brands: [],
            types: [],
            repertories: []
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
            this.setState((prevState, props) => ({
                brands: brands
            }));
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
            this.setState((prevState, props) => ({
                types: types
            }));
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

        // get repertories
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
            this.setState((prevState, props) => ({
                repertories: repertories
            }));
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

        // get equip
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
            if (success === json.status) {
                log("success:", json.message);
                this.setState({
                    equipment: json.item,
                    operationResult: {
                        status: null,
                        message: null
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
                values.storageTime = values.storageTime.format('YYYY-MM-DD HH:mm:ss');
                values.unpackingTime = values.unpackingTime.format('YYYY-MM-DD HH:mm:ss');
                values.code = this.state.equipment.code;
                const formData = JSON.stringify(values);
                log('received values of form:', formData);
                fetch(`${urlBase}/equipment/${this.props.param.equipmentId}`, {
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
        const equipment = this.state.equipment;
        const brands = this.state.brands.map((value) =>
            <Option value={value} key={value}>{value}</Option>);
        const types = this.state.types.map((value) =>
            <Option value={value} key={value}>{value}</Option>);
        const repertories = this.state.repertories.map((value) =>
            <Option value={value} key={value}>{value}</Option>);
        return (
            <Row>
                <Col className="centered">
                    <h2 className="padding-top-bottom-16">编 辑 资 产</h2>
                </Col>
                <Col span={6} offset={9}>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <FormItem label="资产编号">
                            {getFieldDecorator('code', {
                                initialValue: equipment.code,
                                rules: [{required: false, message: '请选择资产编号!'}],
                            })(
                                <Input disabled={true}/>
                            )}
                        </FormItem>
                        <FormItem label="仓库地址">
                            {getFieldDecorator('repertory', {
                                initialValue: equipment.repertory,
                                rules: [{required: true, message: '请选择仓库地址!'}],
                            })(
                                <Select style={{width: '100%'}} placeholder="请选择仓库地址">
                                    {repertories}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="资产类型">
                            {getFieldDecorator('type', {
                                initialValue: equipment.type,
                                rules: [{required: true, message: '请输资产类型!'}],
                            })(
                                <Select style={{width: '100%'}} placeholder="请选择资产类型">
                                    {types}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="资产品牌">
                            {getFieldDecorator('brand', {
                                initialValue: equipment.brand,
                                rules: [{required: true, message: '请选择资产品牌!'}],
                            })(
                                <Select style={{width: '100%'}} placeholder="请选择资产品牌">
                                    {brands}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="资产型号">
                            {getFieldDecorator('model', {
                                initialValue: equipment.model,
                                rules: [{required: true, message: '请输入资产型号!'}],
                            })(
                                <Input placeholder="资产型号"/>
                            )}
                        </FormItem>
                        <FormItem label="序列号">
                            {getFieldDecorator('serial', {
                                initialValue: equipment.serial,
                                rules: [{required: true, message: '请输入序列号!'}],
                            })(
                                <Input placeholder="序列号"/>
                            )}
                        </FormItem>
                        <FormItem label="入库日期">
                            {getFieldDecorator('storageTime', {
                                initialValue: moment(equipment.storageTime,"YYYY-MM-DD HH:mm:ss"),
                                rules: [{required: true, message: '请选择入库日期!'}],
                            })(
                                <DatePicker prefix={<Icon type="user" style={{fontSize: 13}}/>} style={{width: '100%'}}
                                            format="YYYY-MM-DD" placeholder="入库日期"/>
                            )}
                        </FormItem>
                        <FormItem label="拆封日期">
                            {getFieldDecorator('unpackingTime', {
                                initialValue: moment(equipment.unpackingTime,"YYYY-MM-DD HH:mm:ss"),
                                rules: [{required: true, message: '请选择拆封日期!'}],
                            })(
                                <DatePicker prefix={<Icon type="user" style={{fontSize: 13}}/>} style={{width: '100%'}}
                                            format="YYYY-MM-DD" placeholder="拆封日期"/>
                            )}
                        </FormItem>
                        <FormItem label="备注">
                            {getFieldDecorator('remark', {
                                initialValue: equipment.remark,
                                rules: [{required: false, message: ''}],
                            })(
                                <TextArea rows={3} maxLength="200" type={{width: '100%'}} placeholder="备注"/>
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="margin-right-16"
                                    onClick={this.handleSubmit}>确认</Button>
                            <Button type="default" onClick={this.props.onEquipmentEditCancelCallback}>取消</Button>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        );
    }
}

export default createForm()(EquipmentEdit);