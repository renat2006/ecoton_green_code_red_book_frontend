import React, { useState } from 'react';
import { Tabs, Input, Select, List, Button, Dropdown, Menu, Collapse } from 'antd';
import { SearchOutlined, MoreOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Option } = Select;
const { Panel } = Collapse;

const LibraryPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('животные');
    const [filter, setFilter] = useState('');

    // Sample data for the list
    const data = Array(5).fill({
        title: 'Животное',
        description: 'что-то про животное',
    });

    // Handle tab change
    const handleTabChange = (key) => {
        setSelectedCategory(key);
    };

    // Menu for the more options dropdown
    const moreOptionsMenu = (
        <Menu>
            <Menu.Item key="1">Редактировать</Menu.Item>
            <Menu.Item key="2">Удалить</Menu.Item>
        </Menu>
    );

    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold">Библиотека</h1>
            <Tabs defaultActiveKey="животные" className="mt-5" onChange={handleTabChange}>
                <TabPane tab="Растения" key="растения">
                    {/* Plants content */}
                </TabPane>
                <TabPane tab="Животные" key="животные">
                    <div className="flex flex-col md:flex-row justify-between mb-5 ">

                                <Collapse >
                                    <Panel header="Искать по классам" key="1">
                                        <div className="flex flex-col space-y-2">

                                            <Select
                                                placeholder="Выберите класс"
                                                onChange={(value) => setFilter(value)}
                                            >
                                                <Option value="class1">Класс 1</Option>
                                                <Option value="class2">Класс 2</Option>
                                            </Select>
                                        </div>
                                    </Panel>
                                    <Panel header="Искать по отрядам" key="2">
                                        <Button type="default">Искать по отрядам</Button>
                                    </Panel>
                                    <Panel header="Искать по семействам" key="3">
                                        <Button type="default">Искать по семействам</Button>
                                    </Panel>
                                    <Panel header="Искать по родам" key="4">
                                        <Button type="default">Искать по родам</Button>
                                    </Panel>
                                    <Panel header="Искать по видам" key="5">
                                        <Button type="default">Искать по видам</Button>
                                    </Panel>

                        </Collapse>
                        <div className="flex-1 md:ml-5">
                            <List
                                itemLayout="horizontal"
                                dataSource={data}
                                renderItem={item => (
                                    <List.Item
                                        actions={[
                                            <Button type="link">Редактировать</Button>,
                                            <Button type="link" danger>Удалить</Button>,
                                            <Dropdown overlay={moreOptionsMenu} placement="bottomRight">
                                                <Button icon={<MoreOutlined />} />
                                            </Dropdown>
                                        ]}
                                    >
                                        <List.Item.Meta
                                            avatar={<img src="https://via.placeholder.com/50" alt="avatar" />}
                                            title={<a href="https://example.com">{item.title}</a>}
                                            description={item.description}
                                        />
                                    </List.Item>
                                )}
                            />
                            <Button type="default" className="mt-4">показать больше</Button>
                        </div>
                    </div>
                </TabPane>
                <TabPane tab="Грибы" key="грибы">
                    {/* Fungi content */}
                </TabPane>
            </Tabs>
        </div>
    );
};

export default LibraryPage;
