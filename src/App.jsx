import {useState} from 'react'

import {Button} from "antd";
import Header from "./components/Header.jsx";
import Main from "./pages/main.jsx";
import Login from "./pages/Login.jsx";

function App() {


    return (
        <>
            <div className="App">
                <Header>
                    <Button type="primary">Button</Button>
                </Header>
                <Login/>
            </div>
        </>
    )
}

export default App
