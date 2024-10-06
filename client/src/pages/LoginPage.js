import React from 'react'
import '../scss/LoginPage.css'
import {Link} from "react-router-dom";

function LoginPage() {
    return (
        <div className='login-wrapper'>
            <div className="login-container">
                <form action="#">
                    <div className="login-title">Вход</div>
                    <div className="login-input-box login-underline">
                        <input type="text" placeholder="Логин" required/>
                        <div className="login-underline"></div>
                    </div>
                    <div className="login-input-box">
                        <input type="password" placeholder="Пароль" required/>
                        <div className="login-underline"></div>
                    </div>
                    <div className="login-input-box login-button">
                        <input type="submit" name="" value="Continue"/>
                    </div>
                </form>
                <div className='login-alternative'>Еще нет аккаунта? <Link to='/register'>Зарегистрироваться</Link>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;