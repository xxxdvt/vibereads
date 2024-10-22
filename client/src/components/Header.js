import React, {useEffect, useState} from 'react';
import '../scss/Header.css';
import {Link} from "react-router-dom";

function Header() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Получаем информацию о пользователе из локального хранилища после входа
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (loggedInUser) {
            setUser(loggedInUser[0]);
        }
    }, []);
    return (
        <header>
            <nav>
                <Link to='/'><p className='app-name'>VibeReads</p></Link>
                <div className="btn-wrapper">
                    <Link to='/'><p className='search-bar-btn'>Поиск</p></Link>
                    <Link to='/catalog'><p className='catalog-btn'>Каталог</p></Link>
                    <Link to='/'><p className='mood-search-btn'>Настроение</p></Link>
                    <Link to='/about'><p className='contacts-btn'>О нас</p></Link>
                    {user ? (
                        <Link to="/profile"><p>{user.surname} {user.name[0]}.</p></Link>
                    ) : (
                        <Link to="/login"><p className='login-btn'>Вход</p></Link>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Header;

