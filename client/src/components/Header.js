import React, {useContext, useEffect} from 'react';
import '../scss/Header.css';
import {Link} from "react-router-dom";
import Toggle from "./ToggleTheme";
import {ThemeContext, themes} from "../context/ThemeContext";
import {AuthContext} from "../context/AuthContext";

function Header() {
    const {userData, login, logout} = useContext(AuthContext);

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
    }, []);

    return (
        <header>
            <nav>
                <Link to='/'><p className='app-name'>VibeReads</p></Link>
                <div className="btn-wrapper">
                    <Link to='/search'><p className='search-bar-btn'>Поиск</p></Link>
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

