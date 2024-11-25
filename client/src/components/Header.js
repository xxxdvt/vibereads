import React, {useContext, useEffect} from 'react';
import '../scss/Header.css';
import {Link, useLocation} from "react-router-dom";
import Toggle from "./ToggleTheme";
import {ThemeContext, themes} from "../context/ThemeContext";
import {AuthContext} from "../context/AuthContext";

function Header() {
    const {userData, login} = useContext(AuthContext);
    useEffect(() => {
        async function fetchUserData() {
            const response = await fetch('http://127.0.0.1:5000/api/current_user', {
                "method": "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const data = await response.json();
            if (data['message'] !== 'UNAUTHORIZED') {
                login(data);
            }
        }

        fetchUserData().then()
        // eslint-disable-next-line
    }, []);
    const location = useLocation();
    useEffect(() => {
        // Меняем тему на admin, если маршрут /admin
        if (location.pathname === '/admin') {
            document.documentElement.dataset.theme = themes.admin;
        } else {
            // Возвращаем тему из локального хранилища или по умолчанию
            document.documentElement.dataset.theme = localStorage.getItem('theme') || themes.dark;
        }
    }, [location.pathname]);
    return (
        <header>
            <nav>
                <Link to='/'><p className='app-name'>VibeReads</p></Link>
                <div className="btn-wrapper">
                    <Link to='/catalog'><p className='catalog-btn'>Каталог</p></Link>
                    <Link to='/moody'><p className='mood-search-btn'>Настроение</p></Link>
                    <Link to='/about'><p className='contacts-btn'>О нас</p></Link>

                    {userData ? (
                        <Link to="/profile"><p>{userData.surname} {userData.name[0]}.</p></Link>
                    ) : (
                        <Link to="/login"><p className='login-btn'>Вход</p></Link>
                    )}
                    <ThemeContext.Consumer>
                        {({theme, setTheme}) => (
                            location.pathname !== '/admin' && (
                                    <Toggle
                                        onChange={() => {
                                            if (theme === themes.light) setTheme(themes.dark)
                                            if (theme === themes.dark) setTheme(themes.light)
                                        }}
                                        value={theme === themes.light}
                                    />
                            )
                        )}
                    </ThemeContext.Consumer>
                    {/*)}*/}
                </div>
            </nav>
        </header>
    );
}

export default Header;

