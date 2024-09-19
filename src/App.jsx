import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import Main from './pages/main.jsx';
import Login from "./pages/Login.jsx";
import Library from "./pages/Library.jsx";


function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Main />} />
                    <Route path="/library" element={<Library />}/>
                    {/* Redirect from root to /home */}

                </Routes>
            </div>
        </Router>
    );
}

export default App;
