/**
 * Created by ice_b on 2017/10/22.
 */
import React, {Component} from "react";
import "./AssetApp.css";
import {Button, Checkbox, Form, Icon, Input, Layout, Row, Col, Alert} from "antd";
import {createForm} from 'rc-form';
import 'fetch-polyfill';
import {log, urlBase} from './Config';
const FormItem = Form.Item;

export class LoginOut extends Component {
    render() {
        return (
            <div>
                <span className="user-name">{this.props.name}</span>
                <Button type="dashed">退出</Button>
            </div>
        );
    }
}

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            failMsg: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        /*fetch(urlBase + '/dict/listByTypeCode?typeCode=a')
         .then(function (response) {
         return response.json()
         }).then(function (json) {
         console.log('parsed json', json)
         }).catch(function (ex) {
         console.log('parsing failed', ex)
         })*/
    }

    handleSubmit(e){
        e.preventDefault();
        let formData = '';
        this.props.form.validateFields((err, values) => {
            if (!err) {
                formData = JSON.stringify(values);
                log('Received values of form: ', formData);
            } else {
                // 错误提示

            }
        });

        fetch(urlBase + "/user/login", {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: formData
        }).then((response)=>{
            log("response:", response);
            return response.json()
        }).then((json)=>{
            log("json:", json);
            if ("success" === json.status) {
                this.setSate({
                    failMsg: ''
                });
                log("success")
            } else if ("fail" === json.status) {
                this.setSate({
                    failMsg: json.message
                });
            } else {
                this.setSate({
                    failMsg: json
                });
            }
        }).catch((ex)=>{
            log("failed:", ex);
            /*self.setSate({
             failMsg: ex.message
             });*/
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const failMsg = this.state.failMsg;
        return (
            <Layout className="relative-position">
                <Row className="middle-login">
                    <Col offset={10} span={4}>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <FormItem>
                                {getFieldDecorator('userName', {
                                    rules: [{required: true, message: '请输入用户名!'}],
                                })(
                                    <Input prefix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="用户名"/>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('password', {
                                    rules: [{required: true, message: '请输入密码!'}],
                                })(
                                    <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>} type="password"
                                           placeholder="密码"/>
                                )}
                            </FormItem>
                            <FormItem>
                                {/*{getFieldDecorator('remember', {
                                 valuePropName: 'checked',
                                 initialValue: true,
                                 })(
                                 <Checkbox>Remember me</Checkbox>
                                 )}
                                 <a className="login-form-forgot" href="">Forgot password</a>*/}
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    Log in
                                </Button>
                                {/*Or <a href="">register now!</a>*/}
                            </FormItem>
                        </Form>
                        {!('' === failMsg) && <Alert message={failMsg} type="success" showIcon/>}
                    </Col>
                </Row>
            </Layout>
        );
    }
}
export default createForm()(Login);