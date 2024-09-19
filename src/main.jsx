import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {ConfigProvider, theme} from "antd";
import ruRu from 'antd/locale/ru_RU';
import {AuthProvider} from "./Providers/AuthContext.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ConfigProvider locale={ruRu}
                        theme={{
                            token: {

                                colorPrimary: '#25bc5d',
                                borderRadius: 0,


                            },

                        }}
        >
            <AuthProvider>
                <App/>
            </AuthProvider>
        </ConfigProvider>
    </StrictMode>,
)
