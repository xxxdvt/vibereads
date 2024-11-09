import React from 'react';
import '../scss/Header.css';
import {Link} from "react-router-dom";
import Toggle from "./ToggleTheme";
import {ThemeContext, themes} from "../context/ThemeContext";

function Header() {

    const handleLogout = async (e) => {
        e.preventDefault();
        const response = await fetch('http://127.0.0.1:5000/api/logout', {
            method: 'POST',
            credentials: 'include'})
        const data = response.json();
        if (response.ok) {
            console.log('logged out');
        }
    }

    return (
        <header>
            <nav>
                <Link to='/'><p className='app-name'>VibeReads</p></Link>
                <div className="btn-wrapper">
                <button onClick={handleLogout}>OUT</button>
                    <Link to='/search'><p className='search-bar-btn'>Поиск</p></Link>
                    <Link to='/catalog'><p className='catalog-btn'>Каталог</p></Link>
                    <Link to='/moody'><p className='mood-search-btn'>Настроение</p></Link>
                    <Link to='/about'><p className='contacts-btn'>О нас</p></Link>
                    {/*{user ? (*/}
                    {/*    <Link to="/profile"><p>{user.surname} {user.name[0]}.</p></Link>*/}
                    {/*) : (*/}
                        <Link to="/login"><p className='login-btn'>Вход</p></Link>
                    <ThemeContext.Consumer>
                        {({ theme, setTheme }) => (
                            <Toggle
                                onChange={() => {
                                    if (theme === themes.light) setTheme(themes.dark)
                                    if (theme === themes.dark) setTheme(themes.light)
                                }}
                                value={theme === themes.light}
                            />
                        )}
                    </ThemeContext.Consumer>
                    {/*)}*/}
                </div>
            </nav>
        </header>
    );
}

export default Header;

