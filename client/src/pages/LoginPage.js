import React, {useState} from 'react';
import '../scss/LoginPage.css';
import {Link, useNavigate} from "react-router-dom";

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log(username, password);
        const response = await fetch("http://127.0.0.1:5000/api/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            navigate('/profile');
        } else {
            alert('Ошибка входа, проверьте логин и пароль');
        }
    }

    return (
        <div className='login-wrapper'>
            <div className="login-container">
                <form onSubmit={handleLogin}>
                    <div className="login-title">Вход</div>
                    <div className="login-input-box login-underline">
                        <input
                            type="text"
                            placeholder="Логин"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <div className="login-underline"></div>
                    </div>
                    <div className="login-input-box">
                        <input
                            type="password"
                            placeholder="Пароль"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
