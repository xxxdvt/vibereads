import React, {useEffect, useState} from 'react';
import '../scss/Carousel.css';
import {useNavigate} from "react-router-dom"; // Подключение SCSS стилей

const Carousel = ({func, books, sectionName, booksPerSlide = 4}) => {
    const [startIndex, setStartIndex] = useState(0); // Индекс первой отображаемой книги

    const nextSlide = () => {
        setStartIndex((prevIndex) =>
            prevIndex + booksPerSlide >= books.length ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setStartIndex((prevIndex) =>
            prevIndex === 0 ? books.length - booksPerSlide : prevIndex - 1
        );
    };

    const getVisibleBooks = () => {
        return books.slice(startIndex, startIndex + booksPerSlide);
    };

    return (
        <div className={`carousel-container ${sectionName}`}>
            <p className="section-name-header">{sectionName}</p>

            <div className="carousel">
                <div className='carousel-button-wrapper'>
                    <button className="carousel-button prev" onClick={prevSlide}>
                        &#10094;
                    </button>
                </div>
                <div className="carousel-slides">
                    {getVisibleBooks().map((book, index) => (
                        <div key={index} className="carousel-slide">
                            <img src={book.thumbnail} alt={book.title} className="grid--container-elem-img-p" onClick={func}/>
                            <div className="book-info">
                                <p className='hn'>{book.title}</p>
                                <p className='hn1'>{book.author}</p>
                                <p className='hn1'>{book.rating}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='carousel-button-wrapper'>
                    <button className="carousel-button next" onClick={nextSlide}>
                        &#10095;
                    </button>
                </div>
            </div>
        </div>
    );
};

const MultiCarousel = () => {
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);
    const [popularBooks, setPopularBooks] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        // Первоначальная загрузка книг
        loadMoreBooks().then();
        // eslint-disable-next-line
    }, []);

    const loadMoreBooks = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/books?page=${page}`);
            const data = await response.json();


            // Добавляем новые книги к текущему списку
            setBooks((prevBooks) => [...prevBooks, ...data]);
            setPage((prevPage) => prevPage + 1);
        } catch (error) {
            console.error('Error loading books:', error);
        }
    };

    function handleClickBookInfo(event) {
        const clickedId = parseInt(event.target.src.toString().split('/')[5]);
        navigate(`/books/${clickedId}`);
    }

    useEffect(() => {
        const loadPopularBooks = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/books/popular');
                const data = await response.json();
                console.log(data);
                setPopularBooks(data);
            } catch (err) {
                console.error('Error loading the most popular books:', err)
            }
        }
        loadPopularBooks().then();
    }, []);

    const section = {
        sectionName: 'Популярное',
        books: popularBooks,
    };

    return (
        <div>
            <div className="grid--container-wrapper">
                <p className="section-name-header">Каталог</p>
                <div className="grid--container">
                    {books.map((book, index) => (
                            <div className="grid--container-elem" key={index}>
                                <img src={book.thumbnail} alt={book.title} className="grid--container-elem-img" onClick={handleClickBookInfo}/>
                                <div className="book-info">
                                    <p className='hn'>{book.title}</p>
                                    <p className='hn1'>{book.author}</p>
                                    <p className='hn1'>{book.rating}</p>
                                </div>
                            </div>
                        )
                    )}
                </div>
                <button onClick={loadMoreBooks} className='load-more-books'>Показать ещё</button>
            </div>
            <Carousel
                func={handleClickBookInfo}
                key={0}
                books={section.books}
                sectionName={section.sectionName}
                booksPerSlide={4}
            />
        </div>
    );
};

export default MultiCarousel;
