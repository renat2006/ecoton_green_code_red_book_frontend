import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTelegramPlane } from 'react-icons/fa';
import { AuthContext } from "../Providers/AuthContext.jsx";

const LoginPage = () => {
    const [apiResponse, setApiResponse] = useState(null);
    const { user, login } = useContext(AuthContext);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        // Check for user data in URL
        if (window.location.hash.includes('tgAuthResult')) {
            const hashData = window.location.hash.split('=')[1];
            const decodedData = decodeURIComponent(atob(hashData));
            console.log('Decoded Data:', decodedData); // Debug: Check the decoded data

            const user = JSON.parse(decodedData);
            console.log('Parsed User Data:', user); // Debug: Check the parsed user data

            onTelegramAuth(user);
        }
    }, []);

    const handleTelegramLogin = () => {
        const telegramBotId = '8133898169';
        window.location.href = `https://oauth.telegram.org/auth?bot_id=${telegramBotId}&origin=${window.location.origin}&embed=1&request_access=write`;
    };

    const onTelegramAuth = async (user) => {
        // Validate necessary fields
        if (!user.id || !user.first_name || !user.auth_date || !user.hash) {
            console.error('Missing required fields');
            return;
        }

        try {
            const response = await fetch('https://api.zero-kilometer.ru/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name || "",
                    username: user.username || "",
                    photo_url: null,
                    auth_date: parseInt(user.auth_date, 10),
                    hash: user.hash
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to authenticate');
            }

            const tokens = await response.json();
            console.log('API Tokens:', tokens); // Debug: Check API tokens

            // Save user data and token in context and localStorage
            login(user, tokens.token);
            console.log(user, tokens)
            setApiResponse(tokens);



        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/img/map_back.webp')" }}>
            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-50"></div>

            {/* Login Card */}
            <div className="relative z-10 flex items-center justify-center min-h-screen">
                <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition duration-500 hover:scale-105">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold text-gray-800">Добро пожаловать</h2>
                        <p className="text-gray-600">Войдите через Telegram, чтобы продолжить</p>
                    </div>

                    {/* Custom Telegram Login Button */}
                    {!user ? (
                        <button
                            onClick={handleTelegramLogin}
                            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg flex items-center justify-center space-x-2 shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
                        >
                            <FaTelegramPlane className="text-xl"/>
                            <span>Войти через Telegram</span>
                        </button>
                    ) : (
                        <p>Добро пожаловать, {user.first_name}!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
