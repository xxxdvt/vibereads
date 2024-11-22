import React, {useContext, useState} from 'react';
import '../scss/RegisterPage.css';
import {Link, useNavigate} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";

function RegisterPage() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleRegister = async (e) => {
        e.preventDefault();
        console.log(username, password);
        await fetch("http://127.0.0.1:5000/api/register", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({surname, name, username, password, passwordCheck}),
        })
            .then(response => response.json())
            .then(data => {
                if (data) {
                    // Авторизуем пользователя в контексте
                    login(data);
                    navigate('/profile');
                }
            })
            .catch(err => {
                alert("Check your Login and Password")
            })
    }
    return (
        <div className='register-wrapper'>
            <div className="register-container">
                <form onSubmit={handleRegister}>
                    <div className="register-title">Регистрация</div>
                    <div className="register-input-box underline">
                        <input
                            type="text"
                            placeholder="Фамилия"
                            required
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                        />
                        <div className="register-underline"></div>
                    </div>
                    <div className="register-input-box">
                        <input
                            type="text"
                            placeholder="Имя"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <div className="register-underline"></div>
                    </div>
                    <div className="register-input-box">
                        <input
                            type="text"
                            placeholder="Логин"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <div className="register-underline"></div>
                    </div>
                    <div className="register-input-box">
                        <input
                            type="password"
                            placeholder="Пароль"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="register-underline"></div>
                    </div>
                    <div className="register-input-box">
                        <input
                            type="password"
                            placeholder="Подтвердите пароль"
                            required
                            value={passwordCheck}
                            onChange={(e) => setPasswordCheck(e.target.value)}
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
