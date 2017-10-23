/**
 * Created by biml on 2017/10/23.
 */
import React, {Component} from "react";
import {Layout, Menu, Breadcrumb, Icon, Row, Col} from 'antd';
import logo from './logo.png';
import asset from './asset.svg';
import './AssetApp.css';
import {log} from './Config';
import Login, {LoginOut} from './Login';

/**
 * 员工列表组件
 */
class EmployeeList extends Component{
    render(){
        return(
            <div>
                <Row>
                    <Col>
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
                                <Button type="primary" htmlType="submit" className="login-form-button">取消</Button>
                                <Button type="primary" htmlType="submit" className="login-form-button">确认</Button>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </div>
        );
    }
}
export default EmployeeList;