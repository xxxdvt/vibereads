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
import MoodPage from "./pages/MoodPage";
import BookPage from "./pages/BookPage";
import ThemeProvider from "./providers/ThemeProvider";
import {AuthProvider} from "./context/AuthContext";
import UsersBooksPage from "./pages/UsersBooksPage";
import EditProfilePage from "./pages/EditProfilePage";
import AdminPage from "./pages/AdminPage";


function Main() {
    return (
        <Router>
            <ThemeProvider>
                <AuthProvider>
                    <Header/>
                    <Routes>
                        <Route path='/' element={<App/>}/>
                        <Route path='/login' element={<LoginPage/>}/>
                        <Route path='/register' element={<RegisterPage/>}/>
                        <Route path='/catalog' element={<CatalogPage/>}/>
                        <Route path="/books/:bookId" element={<BookPage/>}/>
                        <Route path='/about' element={<AboutPage/>}/>
                        <Route path='/profile' element={<ProfilePage/>}/>
                        <Route path='/profile/edit' element={<EditProfilePage/>}/>
                        <Route path='/moody' element={<MoodPage/>}/>
                        <Route path='/user/favourites' element={<UsersBooksPage pagename={'favourites'}/>}/>
                        <Route path='/user/ratings' element={<UsersBooksPage pagename={'ratings'}/>}/>
                        <Route path='/admin' element={<AdminPage/>}/>

                    </Routes>
                    <Footer/>
                </AuthProvider>
            </ThemeProvider>
        </Router>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<Main/>);

reportWebVitals();
