/**
 * Created by biml on 2017/10/23.
 */
import React, {Component} from "react";
import {Col, Row, Table} from "antd";
import "./AssetApp.css";
import "fetch-polyfill";
import {equipmentStatus} from "./Utils";
import moment from "moment";

/**
 * 资产详情组件,显示资产的信息和已领用的资产列表
 */
class Equipment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            operationResult: {
                status: null,
                message: null
            }
        };
    }

    render() {
        const columns = [{
            title: '编号',
            dataIndex: 'code',
            key: 'code'
        }];
        return (
            <Row>
                <Col>
                    <Row>
                        <Col span={3}>
                            资产姓名：
                        </Col>
                        <Col span={4}>
                            <span>{this.props.equipment.name}</span>
                        </Col>
                        <Col span={3} offset={2}>
                            资产编号：
                        </Col>
                        <Col span={4}>
                            <span>{this.props.equipment.code}</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={3}>
                            办公地址：
                        </Col>
                        <Col span={4}>
                            <span>{this.props.equipment.officeAddress}</span>
                        </Col>
                        <Col span={3} offset={2}>
                            入职时间：
                        </Col>
                        <Col span={4}>
                            <span>{moment(this.props.equipment.inductionDate, "YYYY-MM-DD").format("YYYY-MM-DD")}</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={3}>
                            资产职位：
                        </Col>
                        <Col span={4}>
                            <span>{this.props.equipment.position}</span>
                        </Col>
                        <Col span={3} offset={2}>
                            资产状态：
                        </Col>
                        <Col span={4}>
                            <span>{equipmentStatus[this.props.equipment.status]}</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={3}>
                            <pre>备   注:</pre>
                        </Col>
                        <Col span={12}>
                            <span>{this.props.equipment.remark}</span>
                        </Col>
                    </Row>
                </Col>
                <Col style={{border:'0.5px solid lightgray', margin:'10px 0'}}>
                </Col>
                <Col>
                    <Table columns={columns} dataSource={null} />
                </Col>
            </Row>
        );
    }
}

export default Equipment;