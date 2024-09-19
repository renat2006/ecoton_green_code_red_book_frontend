import React, { useContext } from 'react';
import { Layout, Menu, Button, Drawer, Grid, Avatar, Dropdown } from 'antd';
import { UserOutlined, MenuOutlined } from '@ant-design/icons';
import {AuthContext} from "../Providers/AuthContext.jsx";


const { Header } = Layout;
const { useBreakpoint } = Grid;

const AppHeader = () => {
    const [drawerVisible, setDrawerVisible] = React.useState(false);
    const screens = useBreakpoint();

    // Получаем данные пользователя и функцию logout из контекста
    const { user, logout } = useContext(AuthContext);

    const showDrawer = () => {
        setDrawerVisible(true);
    };

    const onClose = () => {
        setDrawerVisible(false);
    };

    const handleLogout = () => {
        logout();
    };

    const userMenu = (
        <Menu>
            {user && (
                <>
                    <Menu.Item key="1">
                        <strong>ID:</strong> {user.id}
                    </Menu.Item>
                    <Menu.Item key="2">
                        <strong>Username:</strong> {user.username}
                    </Menu.Item>
                    <Menu.Divider />
                </>
            )}
            <Menu.Item key="3" onClick={handleLogout}>
                Выйти
            </Menu.Item>
        </Menu>
    );

    return (
        <Header className="bg-primary-700 shadow-md fixed w-full z-50 top-0 ">
            <div className="flex justify-between items-center h-full px-6">

                <div className="text-2xl text-white font-jost">
                    EcoApp
                </div>

                {screens.md ? (
                    <>
                        <div className="flex gap-5">
                            <Button className="bg-transparent text-white rounded-sm">Карта</Button>
                            <Button className="bg-transparent text-white rounded-sm">Библиотека</Button>
                        </div>
                        <div className="flex items-center gap-5">
                            {!user ? (
                                <>
                                    <Button className="rounded-sm">Регистрация</Button>
                                    <Button className="bg-transparent text-white rounded-sm">Вход</Button>
                                </>
                            ) : (
                                <Dropdown overlay={userMenu} placement="bottomRight">
                                    <Avatar
                                        size="large"
                                        icon={<UserOutlined />}
                                        className="cursor-pointer"
                                    />
                                </Dropdown>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <Button
                            type="text"
                            icon={<MenuOutlined />}
                            onClick={showDrawer}
                            className="text-white"
                        />
                        <Drawer
                            title="Menu"
                            placement="right"
                            closable={true}
                            onClose={onClose}
                            visible={drawerVisible}
                            bodyStyle={{ padding: 0 }}
                        >
                            <Menu mode="vertical">
                                <Menu.Item key="1">Home</Menu.Item>
                                <Menu.Item key="2">About</Menu.Item>
                                <Menu.Item key="3">Contact</Menu.Item>
                                <Menu.Divider />
                                {user ? (
                                    <>
                                        <Menu.Item key="4" onClick={handleLogout}>Выйти</Menu.Item>
                                    </>
                                ) : (
                                    <>
                                        <Menu.Item key="5">Login</Menu.Item>
                                        <Menu.Item key="6">Signup</Menu.Item>
                                    </>
                                )}
                            </Menu>
                        </Drawer>
                    </>
                )}
            </div>
        </Header>
    );
};

export default AppHeader;
