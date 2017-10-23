/**
 * Created by biml on 2017/10/23.
 */
import React, {Component} from "react";
import {
    Layout,
    Menu,
    Breadcrumb,
    Icon,
    Row,
    Col,
    Select,
    DatePicker
} from 'antd';
import logo from './logo.png';
import asset from './asset.svg';
import './AssetApp.css';
import {log} from './Config';
import 'fetch-polyfill';
import {log, urlBase} from './Config';
import {utils} from './Utils';

/**
 * 员工列表组件
 */
class EmployeeList extends Component{
    constructor(props){
        super(props);
        this.state = {
            officeAddresses:[]
        };
    }

    componentDidMount(){
        // get office Addresses
        let officeAddresses = [];
        fetch(urlBase + "/dict/listByTypeCode?typeCode=574304b1-b726-11e7-828b-0a0027000009", {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((response)=>{
            log("response:", response);
            return response.json()
        }).then((json)=>{
            log("json:", json);
            if ("success" === json.status) {
                log("success:", values.userName);
                json.list.forEach((value)=>{
                    officeAddresses.push(value.name)
                });
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
            this.setState({
                officeAddresses: officeAddresses
            });
        }).catch((ex)=>{
            log("failed:", ex);

        });
    }
    render(){
        return(
            <div>
                <Row>
                    <Col>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <FormItem>
                                {getFieldDecorator('name', {
                                    rules: [{required: true, message: '请输入员工姓名!'}],
                                })(
                                    <Input prefix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="员工姓名"
                                           ref={(input) => { this.textInput = input; }}/>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('code', {
                                    rules: [{required: true, message: '请输员工编号!'}],
                                })(
                                    <Input prefix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="员工编号"/>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('inductionDate', {
                                    rules: [{required: true, message: '请选择入职日期!'}],
                                })(
                                    <DatePicker  prefix={<Icon type="user" style={{fontSize: 13}}/>} onChange={onChange}
                                                 placeholder="入职日期" />
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('officeAddress', {
                                    rules: [{required: true, message: '请输员工编号!'}],
                                })(
                                    <Select defaultValue="lucy" style={{ width: 120 }} onChange={handleChange}>
                                        {this.data.officeAdresses.map((value)=>
                                            <Option value="jack">{value.name}</Option>)}
                                    </Select>
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