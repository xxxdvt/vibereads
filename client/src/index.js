import React from 'react';
import ReactDOM from 'react-dom/client';
import './scss/index.css'
import App from './App';
import LoginPage from "./pages/LoginPage";
import reportWebVitals from './reportWebVitals';
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CatalogPage from "./pages/CatalogPage";
import AboutPage from "./pages/AboutPage";
import BookPage from "./pages/BookPage";
import SearchPage from "./pages/SearchPage";
import MoodPage from "./pages/MoodPage";
import ThemeProvider from "./providers/ThemeProvider";
import app from "./App";


function Main() {
    return (
        <Router>
            <ThemeProvider>
            <Header/>
            <Routes>
                <Route path='/' element={<App/>}/>
                <Route path='/login' element={<LoginPage/>}/>
                <Route path='/register' element={<RegisterPage/>}/>
                <Route path='/catalog' element={<CatalogPage/>}/>
                <Route path='/search' element={<SearchPage/>}></Route>
                <Route path="/books/:bookId" element={<BookPage/>}/>
                <Route path='/about' element={<AboutPage/>}/>
                <Route path='/profile' element={<ProfilePage/>}/>
                <Route path='/moody' element={<MoodPage/>}/>
            </Routes>
            <Footer/>
            </ThemeProvider>
        </Router>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<Main/>);

reportWebVitals();
