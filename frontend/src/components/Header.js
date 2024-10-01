import React from 'react';
import '../scss/Header.css';
import {Link} from "react-router-dom";

function Header() {
    return (
        <header>
            <nav>
                <Link to='/'><p className='app-name'>VibeReads</p></Link>
                <div className="btn-wrapper">
                    <Link to='/'><p className='search-bar-btn'>Поиск</p></Link>
                    <Link to='/'><p className='catalog-btn'>Каталог</p></Link>
                    <Link to='/'><p className='mood-search-btn'>Настроение</p></Link>
                    <Link to='/'><p className='contacts-btn'>Контакты</p></Link>
                    <Link to='/login'><p className="login-btn">Вход</p></Link>
                </div>
            </nav>
        </header>
    );
}

export default Header;