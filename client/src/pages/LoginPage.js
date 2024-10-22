import React, { useState } from 'react';
import '../scss/LoginPage.css';
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();  // Для перенаправления пользователя после успешного входа

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Отправка данных на сервер
        const response = await fetch('http://127.0.0.1:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Login successful');
            console.log(data);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/profile');  // Перенаправление на страницу профиля или другую после входа
        } else {
            console.error(data.message);
        }
    };

    return (
        <div className='login-wrapper'>
            <div className="login-container">
                <form onSubmit={handleSubmit}>
                    <div className="login-title">Вход</div>
                    <div className="login-input-box login-underline">
                        <input
                            type="text"
                            placeholder="Логин"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <div className="login-underline"></div>
                    </div>
                    <div className="login-input-box">
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div className="login-underline"></div>
                    </div>
                    <div className="login-input-box login-button">
                        <input type="submit" name="" value="Continue"/>
                    </div>
                </form>
                <div className='login-alternative'>
                    Еще нет аккаунта? <Link to='/register'>Зарегистрироваться</Link>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
