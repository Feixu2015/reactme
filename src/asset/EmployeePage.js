/**
 * Created by biml on 2017/10/23.
 */
import React, {Component} from "react";
import {
    Form,
    Layout,
    Menu,
    Breadcrumb,
    Row,
    Col,
    Icon,
    Button,
    Input,
    Select,
    DatePicker
} from 'antd';
import {createForm} from 'rc-form';
import logo from './logo.png';
import asset from './asset.svg';
import './AssetApp.css';
import 'fetch-polyfill';
import EmployeeAdd from './EmployeeAdd';
import {log, urlBase} from './Config';
import {utils} from './Utils';
const FormItem = Form.Item;
/**
 * 组件状态
 * @type {{default: string, add: string, edit: string, show: string}}
 */
const Actions = {
    default: 'default',
    add: 'add',
    edit: 'edit',
    show: 'show'
};

/**
 * 员工列表组件
 */
class EmployeePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            action: Actions.add
        };
    }

    handleEmployeeAdd = (employeeCode)=>{

    };

    render() {
        const content = (()=>{
            let content = null;
            const action = this.state.action;
            switch (action) {
                case Actions.default:
                    break;
                case Actions.add:
                    content = <EmployeeAdd onEmployeeAddCallback={this.handleEmployeeAdd}/>;
                    break;
                case Actions.edit:
                    break;
                case Actions.show:
                    break;
            }
            return content;
        })();
        return (
            <Row>
                <Col>
                    {content}
                </Col>
            </Row>
        );
    }
}

export default createForm()(EmployeePage);