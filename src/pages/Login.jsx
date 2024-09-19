import React, { useEffect, useState } from 'react';
import { FaTelegramPlane } from 'react-icons/fa';

const LoginPage = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userData, setUserData] = useState(null);
    const [apiResponse, setApiResponse] = useState(null);

    useEffect(() => {
        // Проверка наличия данных в URL
        if (window.location.hash.includes('tgAuthResult')) {
            const hashData = window.location.hash.split('=')[1];
            const decodedData = decodeURIComponent(atob(hashData));
            const user = JSON.parse(decodedData);

            onTelegramAuth(user);
        }
    }, []);

    const handleTelegramLogin = () => {
        const telegramBotId = '8133898169';
        window.location.href = `https://oauth.telegram.org/auth?bot_id=${telegramBotId}&origin=${window.location.origin}&embed=1&request_access=write`;
    };

    const onTelegramAuth = async (user) => {
        // Проверка обязательных полей
        if (!user.id || !user.first_name || !user.auth_date || !user.hash) {
            console.error('Missing required fields');
            return;
        }

        // Приведение типов для соответствия требованиям бэка
        setUserData(user);
        console.log(user);
        console.log(JSON.stringify({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name || "",
            username: user.username || "",

            auth_date: parseInt(user.auth_date, 10),
            hash: user.hash
        }))
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
                    photo_url: user.photo_url || "",
                    auth_date: parseInt(user.auth_date, 10),
                    hash: user.hash
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to authenticate');
            }

            const tokens = await response.json();
            setApiResponse(tokens);
            setIsModalVisible(true);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setUserData(null);
        setApiResponse(null);
    };

    return (
        <div className="relative min-h-screen bg-cover bg-center"
             style={{backgroundImage: "url('/img/map_back.webp')"}}>
            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-50"></div>

            {/* Login Card */}
            <div className="relative z-10 flex items-center justify-center min-h-screen">
                <div
                    className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition duration-500 hover:scale-105">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold text-gray-800">Добро пожаловать</h2>
                        <p className="text-gray-600">Войдите через Telegram, чтобы продолжить</p>
                    </div>

                    {/* Custom Telegram Login Button */}
                    <button
                        onClick={handleTelegramLogin}
                        className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg flex items-center justify-center space-x-2 shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
                    >
                        <FaTelegramPlane className="text-xl"/>
                        <span>Войти через Telegram</span>
                    </button>
                </div>
            </div>

            {/* Modal */}
            {isModalVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-2xl font-bold mb-4">User Information</h3>
                        {userData ? (
                            <div>
                                <p><strong>ID:</strong> {userData.id}</p>
                                <p><strong>First Name:</strong> {userData.first_name}</p>
                                <p><strong>Last Name:</strong> {userData.last_name}</p>
                                {userData.username && <p><strong>Username:</strong> @{userData.username}</p>}
                            </div>
                        ) : (
                            <p>No user data available</p>
                        )}
                        {/* Display API response */}
                        {apiResponse && (
                            <div className="mt-4">
                                <h4 className="font-bold">API Response:</h4>
                                <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
                            </div>
                        )}
                        <button
                            onClick={closeModal}
                            className="mt-4 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginPage;
