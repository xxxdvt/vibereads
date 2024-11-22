import React, {useContext, useEffect, useState} from 'react';
import booksLogo from '../assets/icons/books-stack-of-three-svgrepo-com.svg';
import ratingsLogo from '../assets/icons/rating-svgrepo-com.svg';
import '../scss/ProfilePage.css'
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";

function ProfilePage() {
    const [user, setUser] = useState(null);
    const [favouritesNumber, setFavouritesNumber] = useState(0);
    const [ratesNumber, setRatesNumber] = useState(0);
    const {logout} = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUser() {
            const response = await fetch('http://127.0.0.1:5000/api/current_user', {
                "method": "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            if (data['message'] === "UNAUTHORIZED") {
                navigate('/login');
            } else {
                setUser(data);
            }
        }

        fetchUser().then()
        // eslint-disable-next-line
    }, []);

    const handleLogout = async (e) => {
        e.preventDefault();
        const response = await fetch('http://127.0.0.1:5000/api/logout', {
            method: 'POST',
            credentials: 'include'
        })
        const data = response.json();
        console.log(data);
        if (response.ok) {
            await logout();
            await navigate('/');
            window.location.reload();
        }
    }

    useEffect(() => {
        async function getFavouritesNumber() {
            const response = await fetch('http://127.0.0.1:5000/api/favourites', {
                method: 'GET',
                credentials: 'include'
            })
            const data = await response.json();

            await setFavouritesNumber(data.number);
        }
        getFavouritesNumber().then();
    }, [favouritesNumber]);

    useEffect(() => {
        async function getRatingsNumber() {
            const response = await fetch('http://127.0.0.1:5000/api/ratingsNum', {
                method: 'GET',
                credentials: 'include'
            })
            const data = await response.json();

            await setRatesNumber(data.number);
        }
        getRatingsNumber().then();
    }, [ratesNumber]);

    return (
        <div className="profile-wrapper">
            {user ? (
                <div className="pt-4">
                    <div className="max-w-sm mx-auto bg-white dark:bg-red-300 rounded-lg overflow-hidden shadow-2xl">
                        <div className="border-b px-4 pb-6">
                            <div className="text-center my-4">
                                <img
                                    className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 mx-auto my-4"
                                    src="https://randomuser.me/api/portraits/women/21.jpg" alt=""/>
                                <div className="py-2">
                                    <h3 className="font-bold text-2xl text-gray-800 dark:text-white mb-1">
                                        {user.name} {user.surname}
                                    </h3>
                                    <div className="inline-flex text-gray-700 dark:text-gray-300 items-center">

                                        <svg
                                            className="h-5 w-5 text-gray-400 dark:text-gray-600 mr-1"
                                            viewBox="0 0 24 24" width="24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                                                stroke="#292D32"/>
                                            <path
                                                d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"
                                                stroke="#292D32"/>
                                        </svg>
                                        {user.username}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 px-2">
                                <button
                                    className="flex-1 rounded-full bg-blue-600 dark:bg-blue-800 text-white dark:text-white antialiased font-bold hover:bg-blue-800 dark:hover:bg-blue-900 px-4 py-2"
                                    onClick={() => {
                                        navigate('/catalog');
                                    }}
                                >
                                    Читать
                                </button>
                                <button
                                    className="flex-1 rounded-full border-2 border-gray-400 dark:border-gray-700 font-semibold text-black dark:text-white px-4 py-2"
                                    onClick={handleLogout}
                                >
                                    Выйти
                                </button>
                            </div>
                        </div>
                        <div className="px-4 pt-4">
                            <div className="flex gap-2 items-center text-gray-800 dark:text-gray-300 mb-4">

                                <img
                                    className="h-5 w-5 text-gray-400 dark:text-gray-600 mr-1" width="24"
                                    src={`${booksLogo}`}
                                    alt="Favs"
                                />
                                <span><strong
                                    className="text-black dark:text-white">{favouritesNumber}</strong> Favourites</span>
                            </div>
                        </div>
                        <div className="px-4">
                            <div className="flex gap-2 items-center text-gray-800 dark:text-gray-300 mb-4">

                                <img
                                    className="h-5 w-5 text-gray-400 dark:text-gray-600 mr-1" width="24"
                                    src={`${ratingsLogo}`}
                                    alt="Favs"
                                />
                                <span><strong
                                    className="text-black dark:text-white">{ratesNumber}</strong> Ratings</span>
                            </div>
                        </div>
                    </div>

                </div>
            ) : (
                <div>Загрузка...</div>
            )}
        </div>
    );
}

export default ProfilePage;
