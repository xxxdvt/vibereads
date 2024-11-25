import React from 'react'
import { ThemeContext, themes } from '../context/ThemeContext'
import {useLocation} from "react-router-dom";

export const getTheme = () => {
    const theme = `${window?.localStorage?.getItem('theme')}`
    if (Object.values(themes).includes(theme)) return theme

    const userMedia = window.matchMedia('(prefers-color-scheme: dark)')
    if (userMedia.matches) return themes.dark

    return themes.light
}
const ThemeProvider = ({ children }) => {
    const location = useLocation(); // Получаем текущий маршрут
    const [theme, setTheme] = React.useState(getTheme);

    React.useEffect(() => {
        // Если маршрут начинается с "/admin", устанавливаем admin-тему
        if (location.pathname.startsWith('/admin')) {
            setTheme(themes.admin);
        } else {
            const storedTheme = localStorage.getItem('theme') || themes.light;
            setTheme(storedTheme);
        }
    }, [location.pathname]);

    React.useEffect(() => {
        document.documentElement.dataset.theme = theme;
        if (theme !== themes.admin) {
            localStorage.setItem('theme', theme); // Сохраняем тему, только если это не admin
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider