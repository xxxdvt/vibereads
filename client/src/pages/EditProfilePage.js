import React, {useEffect, useState} from 'react';
import Loader from "../components/Loader";
import '../scss/ProfilePage.css';
import {useNavigate} from "react-router-dom";
import PasswordCheckAlert from "../containers/PasswordCheckAlert";
import {IconButton, Input, InputAdornment} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";

function EditProfilePage(props) {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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
                setName(data.name);
                setSurname(data.surname);
                setUsername(data.username);
            }
        }

        fetchUser().then()
        // eslint-disable-next-line
    }, []);

    async function handleSubmitChanges() {
        const response = await fetch('http://127.0.0.1:5000/api/profile/edit/change', {
            "method": "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({name, surname, username, password}),
        })
        if (response.ok) {
            navigate('/profile')
        }
    }

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };
    return (
        <div className="profile-wrapper">
            {user ? (
                <>
                    <PasswordCheckAlert/>
                    <div className="pt-4">
                        <div
                            className="max-w-sm mx-auto bg-white dark:bg-red-300 rounded-lg overflow-hidden shadow-2xl">
                            <div className="border-b px-4 pb-6">
                                <div className="text-center my-4">
                                    <div className='edit-title text-black'>Профиль</div>

                                    <div className="py-5">
                                        <input className="font-bold text-2xl text-gray-800 dark:text-white mb-1 p-1"
                                               defaultValue={user.name}
                                               onChange={(e) => setName(e.target.value)}
                                        />

                                        <input className="font-bold text-2xl text-gray-800 dark:text-white mb-1 p-1"
                                               defaultValue={user.surname}
                                               onChange={(e) => setSurname(e.target.value)}
                                        />

                                        <div className="inline-flex text-gray-700 dark:text-gray-300 ml-2">

                                            <svg
                                                className="h-10 w-6 text-gray-400 dark:text-gray-600 mr-1 align-middle"
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
                                            <input className=" text-2xl text-gray-800 dark:text-white mb-1 p-1"
                                                   defaultValue={user.username}
                                                   onChange={(e) => setUsername(e.target.value)}
                                            />

                                        </div>
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder={'Новый пароль'}
                                            sx={{
                                                width: '90%',
                                                paddingX: '5px',
                                                fontSize: '1.2em'
                                            }}
                                            onChange={(e) => setPassword(e.target.value)}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label={
                                                            showPassword ? 'hide the password' : 'display the password'
                                                        }
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        onMouseUp={handleMouseUpPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff/> : <Visibility/>}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />


                                    </div>
                                </div>
                                <div className="flex gap-2 px-2">
                                    <button
                                        className="flex-1 rounded-full border-2 border-gray-400 dark:border-gray-700 font-semibold text-black dark:text-white px-4 py-2"
                                        onClick={() => {
                                            navigate('/profile')
                                        }}
                                    >
                                        Отменить
                                    </button>
                                    <button
                                        className="flex-1 rounded-full bg-blue-600 dark:bg-blue-800 text-white dark:text-white antialiased font-bold hover:bg-blue-800 dark:hover:bg-blue-900 px-4 py-2"
                                        onClick={handleSubmitChanges}
                                    >
                                        Сохранить
                                    </button>

                                </div>
                            </div>
                        </div>

                    </div>

                </>
            ) : (
                <Loader/>
            )}
        </div>
    );
}

export default EditProfilePage;