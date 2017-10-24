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
import EmployeeList from './EmployeeList';
import EmployeeEdit from './EmployeeEdit';
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
            action: Actions.default,
            param: null
        };
    }

    /**
     * 添加完员工后的处理
     * @param employeeCode 刚添加的员工的工号
     */
    handleEmployeeAdded = (employeeCode) => {
        // 添加完员工后跳转值
        this.setState({
            action: Actions.default
        });
    };

    /**
     * 添加员工页面点击取消按钮的处理
     */
    handleEmployeeAddCancelCallback = () => {
        this.setState({
            action: Actions.default
        });
    };

    /**
     * 员工列表页面点击添加按钮的处理
     */
    handleEmployeeAddButtonClick = () => {
        this.setState({
            action: Actions.add
        });
    };

    /**
     * 员工列表页面点击编辑按钮的处理
     * @param employeeCode 员工编码
     */
    handleEmployeeEditClick = (employeeCode) => {
        this.setState({
            action: Actions.edit,
            param: {
                employeeCode: employeeCode
            }
        });
    };

    render() {
        const param = this.state.param;
        const content = (() => {
            let content = null;
            const action = this.state.action;
            switch (action) {
                case Actions.default:
                    content = <EmployeeList onEmployeeAddClickCallback={this.handleEmployeeAddButtonClick}
                                            onEmployeeEditClick={this.handleEmployeeEditClick}/>;
                    break;
                case Actions.add:
                    content = <EmployeeAdd onEmployeeAddCallback={this.handleEmployeeAdded}
                                           onEmployeeAddCancelCallback={this.handleEmployeeAddCancelCallback}/>;
                    break;
                case Actions.edit:
                    content = <EmployeeEdit param={param} />;
                    break;
                case Actions.show:
                    break;
            }
            return content;
        })();
        return content;
    }
}

export default createForm()(EmployeePage);