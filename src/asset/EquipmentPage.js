/**
 * Created by biml on 2017/10/26.
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
import EquipmentAdd from './EquipmentAdd';
import EquipmentList from './EquipmentList';
import EquipmentEdit from './EquipmentEdit';
import {log, urlBase} from './Config';
import {utils} from './Utils';
const FormItem = Form.Item;
/**
 * 组件状态
 * @type {{default: string, add: string, edit: string, show: string}}
 */
const Actions = {
    // 资产列表
    default: 'default',
    // 新增资产
    add: 'add',
    // 编辑资产
    edit: 'edit'
};

/**
 * 资产页面组件
 */
class EquipmentPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            action: Actions.default,
            param: null
        };
    }

    /**
     * 添加完资产后的处理
     * @param equipmentCode 刚添加的资产的编号
     */
    handleEquipmentAdded = (equipmentCode) => {
        // 添加完资产后跳转值
        this.setState({
            action: Actions.default
        });
    };

    /**
     * 点击取消按添加／编辑钮的处理
     */
    handleEquipmentBtnCancelCallback = () => {
        this.setState({
            action: Actions.default
        });
    };

    /**
     * 资产列表页面点击添加按钮的处理
     */
    handleEquipmentAddButtonClick = () => {
        this.setState({
            action: Actions.add
        });
    };

    /**
     * 资产列表页面点击编辑按钮的处理
     * @param equipmentId 资产id
     */
    handleEquipmentEditClick = (equipmentId) => {
        this.setState({
            action: Actions.edit,
            param: {
                equipmentId: equipmentId
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
                    content = <EquipmentList onEquipmentAddClickCallback={this.handleEquipmentAddButtonClick}
                                            onEquipmentEditClick={this.handleEquipmentEditClick}/>;
                    break;
                case Actions.add:
                    content = <EquipmentAdd onEquipmentAddCallback={this.handleEquipmentAdded}
                                           onEquipmentAddCancelCallback={this.handleEquipmentBtnCancelCallback}/>;
                    break;
                case Actions.edit:
                    content = <EquipmentEdit param={param} onEquipmentEditCallback={this.handleEquipmentBtnCancelCallback}
                                            onEquipmentEditCancelCallback={this.handleEquipmentBtnCancelCallback}/>;
                    break;
                default:
                    content = "nonsupport";
                    break;
            }
            return content;
        })();
        return content;
    }
}

export default createForm()(EquipmentPage);