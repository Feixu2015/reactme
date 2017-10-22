/**
 * Created by ice_b on 2017/10/22.
 */
import React, {Component} from "react";
import "./AssetApp.css";
import {Button, Checkbox, Form, Icon, Input, Layout, Row, Col} from "antd";
import {createForm, getFieldDecorator} from 'rc-form';
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
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
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
                                {getFieldDecorator('remember', {
                                    valuePropName: 'checked',
                                    initialValue: true,
                                })(
                                    <Checkbox>Remember me</Checkbox>
                                )}
                                <a className="login-form-forgot" href="">Forgot password</a>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    Log in
                                </Button>
                                Or <a href="">register now!</a>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </Layout>
        );
    }
}
export default createForm()(Login);