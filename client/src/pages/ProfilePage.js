import React, {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import '../scss/ProfilePage.css'

function ProfilePage() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Получаем информацию о пользователе из локального хранилища
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (loggedInUser) {
            setUser(loggedInUser[0]);
            console.log(loggedInUser[0]);
        }
    }, []);

    if (!user) {
        return <div>Вы не вошли в систему.</div>;
    }
    const handleLogout = async () => {
        localStorage.removeItem('user');

        try {
            const response = await fetch('http://127.0.0.1:5000/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Успешный выход
                console.log('Logged out successfully');
                localStorage.removeItem('user');
                navigate('/');
                // Например, можно сделать редирект или очистить состояние
            } else {
                console.error('Failed to log out');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div className="profile-wrapper">
            <div className="profile-container">
                <h1>Профиль пользователя</h1>
                <p><strong>Фамилия:</strong> {user.surname}</p>
                <p><strong>Имя:</strong> {user.name}</p>
                {/* Можно добавить больше информации о пользователе */}
            </div>
            <button onClick={handleLogout}>Выйти</button>
        </div>
    );
}

export default ProfilePage;
