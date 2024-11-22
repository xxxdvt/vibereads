import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import '../scss/BookPage.css'
import AnimatedButton from "../components/FavouritesButton";
import {Rating} from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";

function BookPage(props) {
    const {bookId} = useParams();
    localStorage.setItem('curBook', bookId);
    const [bookInfo, setBookInfo] = useState(null);
    useEffect( () => {
        async function fetchBookInfo() {
            const response = await fetch(`http://127.0.0.1:5000/api/books/book/${bookId}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            setBookInfo(data);
        }
        fetchBookInfo().then();
    }, [bookId])
    const [value, setValue] = useState(null);

    useEffect( () => {
        async function fetchRatingInfo() {
            const response = await fetch(`http://127.0.0.1:5000/api/books/rating/${bookId}`, {
                "method": "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            setValue(data['rating']);
        }
        fetchRatingInfo().then();
    }, [bookId])


    async function handleChangeRating(event, newValue) {
        setValue(newValue);
        const response = await fetch(`http://127.0.0.1:5000/api/books/rating/${bookId}/${newValue}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        console.log(data);
    }

    async function handleAddToFavourites() {
        const response = await fetch(`http://127.0.0.1:5000/api/books/favourites/${bookId}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        console.log(data);
    }

    return (
        <div className='book-page-wrapper'>
            {bookInfo ? (
                <div  className='book-grid-column-container'>
                    <div className='book-grid-fav-rate-img'>
                        <img src={bookInfo['thumbnail']} alt='Cover' className="book-info-img"/>
                        <div className="add-book-to-favourites" onClick={handleAddToFavourites}>
                            <AnimatedButton/>
                        </div>
                        <div className="rating-book">
                            <Rating
                                name="simple-controlled"
                                value={value || 0}
                                onChange={handleChangeRating}
                                size="large"
                                emptyIcon={
                                    <StarBorderIcon style={{ color: "#888" }} fontSize="inherit" /> // Цвет для пустых звезд
                                }
                            />
                        </div>
                    </div>
                    <div className='book-grid-row-info'>
                        <div className="book-grid-title">
                            {bookInfo.title}
                        </div>
                        <div className="book-grid-author">
                            {bookInfo.author}
                        </div>
                        <div className="book-grid-rating">
                            {bookInfo.rating}
                        </div>
                        <div className="wrap read-online">
                            <button className="button"><a href={bookInfo.text}>Читать онлайн</a></button>
                        </div>
                    </div>

                </div>
            ) : (
                <div>Загрузка...</div>
            )}

        </div>
    );
}

export default BookPage;