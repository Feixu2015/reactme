/**
 * Created by ice_b on 2017/10/22.
 */
import React, {Component} from "react";
import {Layout, Menu, Breadcrumb, Icon, Row, Col} from 'antd';
import './AssetApp.css';
import logo from './logo.png';
import asset from './asset.svg';
import {log} from './Config';
import Login, {LoginOut} from './Login';
import AssetList from './AssetList';
import EmployeeList from './EmployeeList';

const {SubMenu} = Menu;
const {Header, Footer, Content, Sider} = Layout;

/**
 * 资产管理系统主页面组件
 */
class AssetApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 'login',
            userName: '张三'
        }
    }

    /**
     * 处理菜单项点击事件
     * @param {Object} e [事件入参]
     * e.item       为触发的菜单项
     * e.key        为菜单项的key
     * e.keyPath    为菜单项的key路径
     */
    handleLeftMenuClick = (e)=>{
        this.setState({
            page: e.key
        });
        log(e.type, "item:" + e.item + ",key:" + e.key + ",e:" + e.keyPath);
    };

    /**
     * 处理登录成功的回调
     * @param userName 当前登录的用户名
     */
    handleLoginCallback = (userName)=>{
        this.setState({
            page:'asset',
            userName: userName
        })
    };

    /**
     * 处理登出的回调
     */
    handleLoginOutCallback = ()=>{
        this.setState({
            page:'login',
            userName: ''
        })
    };

    render() {
        const page = this.state.page;
        let content = null;
        switch (page) {
            case "asset":
                content = (<AssetList/>);
                break;
            case "employee":
                content = (<EmployeeList/>);
                break;
            default:
                //log("不支持的菜单点击事件！");
                break;
        }
        return (
            <Layout className="full-screen-absolute">
                <Header className="header">
                    <Row>
                        <Col className="logo" span={4}>
                            <img className="logo" src={logo} alt="logo" width={100}/>

                        </Col>
                        <Col span={4} offset={16} className="align-right">
                            { !(page === 'login') && <LoginOut onLoginOut={this.handleLoginOutCallback} name={this.state.userName}/>}
                        </Col>
                    </Row>
                </Header>
                {page === 'login' ? (
                    /* 登录页 */
                        <Login onLoginCallback={this.handleLoginCallback}/>
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
                                {content}
                            </Content>
                        </Layout>
                    </Layout>
                )}
                <Footer className="centered-footer">
                    IDCOS AMS @ 2017. All right reserved.
                </Footer>
            </Layout>
        );
    }
}
export default AssetApp;
