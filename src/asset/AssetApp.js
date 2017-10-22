/**
 * Created by ice_b on 2017/10/22.
 */
import React, {Component} from "react";
import {Layout, Menu, Breadcrumb, Icon, Row, Col} from 'antd';
import logo from './logo.png';
import asset from './asset.svg';
import './AssetApp.css';
import {log} from './Config';
import Login, {LoginOut} from './Login';

const {SubMenu} = Menu;
const {Header, Footer, Content, Sider} = Layout;

class AssetApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 'login',
            name: '张三'
        }
        this.handleLeftMenuClick = this.handleLeftMenuClick.bind(this);
    }

    handleLeftMenuClick(e) {
        this.setState({
            page: e.key
        });
        log("item:" + e.item + ",key:" + e.key + ",e:" + e.keyPath);
    }

    render() {
        const page = this.state.page;
        switch (page) {
            case "asset":

                break;
            case "employee":

                break;
            default:
                log("不支持的菜单点击事件！");
                break;
        }
        return (
            <Layout className="full-screen-absolute">
                <Header className="header">
                    <Row>
                        <Col className="logo" span={4}>
                            <img className="logo" src={logo} alt="logo" width={100}/>

                        </Col>
                        <Col span={2} offset={18}>
                            <LoginOut name={this.state.name}/>
                        </Col>
                    </Row>
                </Header>
                {page === 'login' ? (
                    /* 登录页 */
                        <Login />
                ):(
                    <Layout>
                        <Sider width={200} style={{background: '#fff'}}>
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={['1']}
                                defaultOpenKeys={['sub1']}
                                style={{height: '100%', borderRight: 0}}
                                onClick={this.handleLeftMenuClick}
                            >
                                <SubMenu key="assets" title={<span><Icon type="switcher"/>资产管理</span>}>
                                    <Menu.Item key="asset">资产</Menu.Item>
                                </SubMenu>
                                <SubMenu key="employees" title={<span><Icon type="user"/>员工管理</span>}>
                                    <Menu.Item key="employee">员工</Menu.Item>
                                </SubMenu>
                            </Menu>
                        </Sider>
                        <Layout style={{padding: '0 24px 0 24px'}}>
                            {/*<Breadcrumb style={{margin: '16px 0'}}>
                             <Breadcrumb.Item>Home</Breadcrumb.Item>
                             <Breadcrumb.Item>List</Breadcrumb.Item>
                             <Breadcrumb.Item>App</Breadcrumb.Item>
                             </Breadcrumb>*/}
                            <Content style={{background: '#fff', padding: 24, margin: 0, minHeight: 280}}>
                                {page}
                            </Content>
                        </Layout>
                    </Layout>
                )}
                <Footer>
                    <Row>
                        <Col span={4} offset={10}>IDCOS AMS @ 2017. All right reserved.</Col>
                    </Row>
                </Footer>
            </Layout>
        );
    }
}
export default AssetApp;
