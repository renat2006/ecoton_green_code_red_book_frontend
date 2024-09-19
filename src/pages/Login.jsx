import React from 'react';
import { FaTelegramPlane } from 'react-icons/fa'

const LoginPage = () => {
    const handleTelegramLogin = () => {
        // Replace with your actual bot_id
        const telegramBotId = '8133898169';
        window.location.href = `https://oauth.telegram.org/auth?bot_id=${telegramBotId}&origin=${window.location.origin}&embed=1&request_access=write`;
    };

    return (
        <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/img/map_back.png')" }}>
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
                    <button
                        onClick={handleTelegramLogin}
                        className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg flex items-center justify-center space-x-2 shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
                    >
                        <FaTelegramPlane className="text-xl" />
                        <span>Войти через Telegram</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
