/**
 * Created by ice_b on 2017/10/22.
 */
import React, {Component} from "react";
import "./AssetApp.css";
import {Button, Checkbox, Form, Icon, Input, Layout, Row, Col, Alert} from "antd";
import {createForm} from 'rc-form';
import 'fetch-polyfill';
import {log, urlBase} from './Config';
import {utils} from './Utils';
const FormItem = Form.Item;

export class LoginOut extends Component {
    render() {
        return (
            <div>
                <span className="user-name">欢迎，{this.props.name}</span>
                <a href="#" style={{color:'white'}} onClick={this.props.onLoginOut}>登出</a>
            </div>
        );
    }
}

/**
 * 登录组件
 * state.failMsg 错误信息,default ''
 * state.userName 用户名,default ''
 * state.successCallback 登录成功后的回调方法,default null
 */
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            failMsg: '',
            userName: ''
        };
    }

    componentDidMount(){
        this.textInput.focus();
    }

    handleSubmit = (e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const formData = JSON.stringify(values);
                log('Received values of form: ', formData);
                {/* 登录验证 */}
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
                        this.setState({
                            failMsg: 'success',
                            userName: values.userName
                        });
                        log("success:", values.userName)
                        setTimeout(()=>{
                            // 2秒后调用登录成功回调
                            if(this.props.onLoginCallback){
                                this.props.onLoginCallback(values.userName);
                            }
                        },1000);
                    } else if('fail' === json.status){
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
                }).catch((ex)=>{
                    log("failed:", ex);
                    this.setState({
                        failMsg: ex.message
                    });
                });
            } else {
                this.setState({
                    failMsg: utils.combineValidateError(err).map((e)=><div>{e}</div>)
                });
                log(this.state.failMsg);
            }
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
                                    <Input prefix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="用户名"
                                           ref={(input) => { this.textInput = input; }}/>
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
                                <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
                                {/*Or <a href="">register now!</a>*/}
                            </FormItem>
                        </Form>
                        {
                            '' === failMsg ?
                                (''):
                                ('success' === failMsg ?
                                    (<Alert message="登录成功！" type="success" showIcon/>):
                                    (<Alert message={failMsg} type="error" showIcon/>)
                                )
                        }
                    </Col>
                </Row>
            </Layout>
        );
    }
}
export default createForm()(Login);