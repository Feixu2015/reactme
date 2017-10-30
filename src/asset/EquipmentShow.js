/**
 * Created by biml on 2017/10/23.
 */
import React, {Component} from "react";
import {Col, Row, Tooltip, Button} from "antd";
import "./AssetApp.css";
import "fetch-polyfill";
import {log, urlBase} from "./Config";
import {fail, success, utils, EQUIPMENT_OPERATIONS} from "./Utils";
import EmployeeSelect from "./EmployeeSelect";

/**
 * 资产详情组件，领用和退还
 */
class EquipmentShow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            operationResult: {
                status: null,
                message: null
            },
            selectedEmployeeId: null,
            // 正在使用设备的员工
            employee: null
        };
    }

    componentDidMount(){
        this.handleQueryEquipmentLastUser();
    };

    /**
     * 处理领用退还
     * @param e
     */
    handleSubmit = (e) => {
        let employeeId = null;
        switch (this.props.operation){
            case 'receive':
                if(!this.state.selectedEmployeeId){
                    this.setState({
                        operationResult: {
                            status: fail,
                            message: '请选择领用员工！'
                        }
                    });
                    utils.showNotification(this.state.operationResult);
                    return;
                }else{
                    employeeId = this.state.selectedEmployeeId;
                }
                break;
            case 'return':
                employeeId = this.state.employee.id;
                break;
            default:
                this.setState({
                    operationResult: {
                        status: fail,
                        message: '不支持的操作类型'
                    }
                });
                utils.showNotification(this.state.operationResult);
                break;
        }
        const equipmentId = this.props.equipment.id;
        const operation = this.props.operation;
        log('submit receive or return equipment:', equipmentId, ",employee:", employeeId, ",operation:", operation);
        fetch(`${urlBase}/equipment/${equipmentId}/operation/${operation}/employee/${employeeId}`, {
            method: 'put',
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
                const message = `设备${EQUIPMENT_OPERATIONS[operation]}成功！`;
                log("success:", message);
                this.setState({
                    operationResult: {
                        status: success,
                        message: message
                    }
                });
                setTimeout(() => {
                    // 1秒后执行添加成功后的回调
                    if (this.props.onEquipmentOperationCallback) {
                        this.props.onEquipmentOperationCallback();
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
    };

    handleQueryEquipmentLastUser = () => {
        if('return' === this.props.operation){
            // 如果是退还设备则查询正在使用设备的员工
            fetch(urlBase + `/assetuserecord/equipment/${this.props.equipment.id}`, {
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
                        employee: json.item
                    });
                    log("employee:", JSON.stringify(json.item));
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
    };

    /**
     * 处理选择员工事件
     * @param employee 员工信息
     */
    handleSelectChange = (employee) => {
        console.log("employee:", JSON.stringify(employee));
        this.setState({
            selectedEmployeeId: employee.id
        });
    };

    render() {
        const employee = this.state.employee;
        return (
            <Row>
                <Col>
                    <Row>
                        <Col span={3} className="align-right">
                            资产编号：
                        </Col>
                        <Col span={8}>
                            <span>{this.props.equipment.code}</span>
                        </Col>
                        <Col span={3} offset={2} className="align-right">
                            资产类型：
                        </Col>
                        <Col span={8}>
                            <span>{this.props.equipment.type}</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={3} className="align-right">
                            资产品牌：
                        </Col>
                        <Col span={8}>
                            <span>{this.props.equipment.brand}</span>
                        </Col>
                        <Col span={3} offset={2} className="align-right">
                            资产型号：
                        </Col>
                        <Col span={8}>
                            <span>{this.props.equipment.model}</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={3} className="align-right">
                            序列号：
                        </Col>
                        <Col span={8}>
                            <span>{this.props.equipment.serial}</span>
                        </Col>
                        <Col span={3} offset={2} className="align-right">
                            入库日期：
                        </Col>
                        <Col span={8}>
                            <span>{this.props.equipment.storageTime.substr(0, 10)}</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={3} className="align-right">
                            备注：
                        </Col>
                        <Col span={21}>
                            <span>{this.props.equipment.remark}</span>
                        </Col>
                    </Row>
                </Col>
                <Col style={{borderTop: '1px solid #e9e9e9', margin: '10px 0px'}}>
                </Col>
                <Col>
                    {'receive' === this.props.operation &&
                    <EmployeeSelect onSelectChange={this.handleSelectChange} status="induction"/>}
                    {'return' === this.props.operation &&
                        <Row>
                            <Col span={3} className="align-right">
                                领用员工：
                            </Col>
                            <Col span={8}>
                                <span>{employee && employee.name}</span>
                            </Col>
                            <Col span={3} offset={2} className="align-right">
                                领用日期：
                            </Col>
                            <Col span={8}>
                                <span>???</span>
                            </Col>
                        </Row>
                    }
                </Col>
                <Col style={{borderTop: '1px solid #e9e9e9', margin: '10px 0'}}>
                </Col>
                <Col>
                    <Button type="primary" htmlType="submit" className="margin-right-16"
                            onClick={this.handleSubmit}>确认</Button>
                    <Button type="default" onClick={this.props.onClose}>取消</Button>
                </Col>
            </Row>
        );
    }
}

export default EquipmentShow;