import React, { useState } from 'react';
import '../scss/RegisterPage.css';
import { Link, useNavigate } from "react-router-dom";

function RegisterPage() {
    const [surname, setSurname] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Проверка на совпадение паролей
        if (password !== confirmPassword) {
            console.error('Passwords do not match');
            return;
        }

        // Отправка данных на сервер
        const response = await fetch('http://127.0.0.1:5000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ surname, name, username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            console.log('Registration successful');
            navigate('/login');  // Перенаправление на страницу входа
        } else {
            console.error(data.message);
        }
    };

    return (
        <div className='register-wrapper'>
            <div className="register-container">
                <form onSubmit={handleSubmit}>
                    <div className="register-title">Регистрация</div>
                    <div className="register-input-box underline">
                        <input
                            type="text"
                            placeholder="Фамилия"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            required
                        />
                        <div className="register-underline"></div>
                    </div>
                    <div className="register-input-box">
                        <input
                            type="text"
                            placeholder="Имя"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <div className="register-underline"></div>
                    </div>
                    <div className="register-input-box">
                        <input
                            type="text"
                            placeholder="Логин"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <div className="register-underline"></div>
                    </div>
                    <div className="register-input-box">
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div className="register-underline"></div>
                    </div>
                    <div className="register-input-box">
                        <input
                            type="password"
                            placeholder="Подтвердите пароль"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <div className="register-underline"></div>
                    </div>
                    <div className="register-input-box register-button">
                        <input type="submit" value="Continue"/>
                    </div>
                </form>
                <div className='register-alternative'>
                    Уже есть аккаунт? <Link to='/login'>Войти</Link>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
