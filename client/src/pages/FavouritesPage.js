import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import '../scss/FavouritesPage.css'


function FavouritesPage() {
    const [favourites, setFavourites] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        async function fetchFavouritesInfo() {
            const response = await fetch("http://127.0.0.1:5000/api/user/favourites", {
                "method": "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json()
            await setFavourites(data);
        }

        fetchFavouritesInfo().then()
    }, []);

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

    console.log(favourites)


    return (
        <div className='favourites-wrapper'>
            <p className="section-name-header">Избранное</p>
            <div className='grid--container-favourites'>
                {favourites.map((book, index) => (
                    <div className="grid--container-favourites-elem" key={index}>
                        <img src={book["cover"]} alt={book.title} className="grid--container-favourites-elem-img"
                             onClick={handleBookClick}/>
                        <div className="favourites-book-info">
                            <p className='favourites-hn'>{book.title}</p>
                            <p className='favourites-hn1'>{book.author}</p>
                            <p className='favourites-hn1'>{book["rating"]}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FavouritesPage;