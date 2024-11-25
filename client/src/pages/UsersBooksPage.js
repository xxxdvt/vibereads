import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import '../scss/UsersBooksPage.css'


function UsersBooksPage({pagename}) {
    const [usersBooks, setUsersBooks] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        async function fetchFavouritesInfo() {
            const response = await fetch(`http://127.0.0.1:5000/api/user/${pagename}`, {
                "method": "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json()
            await setUsersBooks(data);
        }

        fetchFavouritesInfo().then()
    }, [pagename]);

    async function checkUserLogin() {
        const response = await fetch('http://127.0.0.1:5000/api/current_user', {
            "method": "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        })
        const data = await response.json();
        return data['message'] !== 'UNAUTHORIZED';
    }

    const handleBookClick = async (event) => {
        const clickedId = parseInt(event.target.src.toString().split('/')[5]);
        if (await checkUserLogin()) {
            navigate(`/books/${clickedId}`);
        } else {
            alert('Login first')
        }
    }

    console.log(usersBooks)


    return (
        <div className='users-books-wrapper'>
            {pagename === 'favourites' ? (
                <p className="section-name-header-ub">Избранное</p>
            ) : (
                <p className="section-name-header-ub">Мои оценки</p>

            )}
            <div className='grid--container-users-books'>
                {usersBooks.map((book, index) => (
                    <div className="grid--container-users-books-elem" key={index}>
                        <img src={book["cover"]} alt={book.title} className="grid--container-users-books-elem-img"
                             onClick={handleBookClick}/>
                        <div className="users-books-book-info">
                            <p className='users-books-hn'>{book.title}</p>
                            <p className='users-books-hn1'>{book.author}</p>
                            <p className='users-books-hn1'>
                                {(book['rating'] === 0) ? (
                                    <span>Нет оценок</span>
                                ) : (
                                    <span>{book['rating'] % 1 === 0 ? book['rating'].toFixed(1) : book['rating'].toString()}/5</span>
                                )}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UsersBooksPage;