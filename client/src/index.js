import React from 'react';
import ReactDOM from 'react-dom/client';
import './scss/index.css'
import App from './App';
import LoginPage from "./pages/LoginPage";
import reportWebVitals from './reportWebVitals';
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import MoodSearchPage from "./pages/MoodSearchPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CatalogPage from "./pages/CatalogPage";
import AboutPage from "./pages/AboutPage";

function Main() {
    return (
        <Router>
            <Header/>
            <Routes>
                <Route path='/' element={<App/>}/>
                <Route path='/login' element={<LoginPage/>}/>
                <Route path='/register' element={<RegisterPage/>}/>
                <Route path='/catalog' element={<CatalogPage/>}/>
                <Route path='/about' element={<AboutPage/>}/>
                <Route path='/profile' element={<ProfilePage/>}/>
                <Route path='/mood-search' element={<MoodSearchPage/>}/>
            </Routes>
            <Footer/>
        </Router>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<Main/>);

reportWebVitals();
