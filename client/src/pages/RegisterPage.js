import React from 'react'
import '../scss/RegisterPage.css'
import {Link} from "react-router-dom";

function RegisterPage() {
    return (
        <div className='register-wrapper'>
            <div className="register-container">
                <form action="#">
                    <div className="register-title">Регистрация</div>
                    <div className="register-input-box underline">
                        <input type="text" placeholder="Фамилия" required/>
                        <div className="register-underline"></div>
                    </div>
                    <div className="register-input-box">
                        <input type="text" placeholder="Имя" required/>
                        <div className="register-underline"></div>
                    </div>
                    <div className="register-input-box">
                        <input type="text" placeholder="Логин" required/>
                        <div className="register-underline"></div>
                    </div>
                    <div className="register-input-box">
                        <input type="password" placeholder="Пароль" required/>
                        <div className="register-underline"></div>
                    </div>
                    <div className="register-input-box">
                        <input type="password" placeholder="Подтвердите пароль" required/>
                        <div className="register-underline"></div>
                    </div>
                    <div className="register-input-box register-button">
                        <input type="submit" name="" value="Continue"/>
                    </div>
                </form>
                <div className='register-alternative'>Уже есть аккаунт? <Link to='/login'>Войти</Link></div>
            </div>
        </div>  
    )
}

export default RegisterPage;