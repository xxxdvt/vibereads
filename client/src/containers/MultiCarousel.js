import React, {useEffect, useState} from 'react';
import '../scss/Carousel.css';
import {useNavigate} from "react-router-dom"; // Подключение SCSS стилей

const Carousel = ({books, sectionName, booksPerSlide = 4}) => {
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
                            <img src={book.thumbnail} alt={book.title}/>
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
    const navigate = useNavigate();
    useEffect(() => {
        // Первоначальная загрузка книг
        loadMoreBooks();
    }, );

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

    const section = {
        sectionName: 'Популярное',
        books: [
            {
                title: 'Книга 9',
                author: 'Автор 9',
                rating: '4/5',
                thumbnail: 'https://www.gutenberg.org/cache/epub/74632/pg74632.cover.medium.jpg'
            },
            {
                title: 'Книга 10',
                author: 'Автор 10',
                rating: '4.5/5',
                thumbnail: 'https://www.gutenberg.org/cache/epub/74632/pg74632.cover.medium.jpg'
            },
            {
                title: 'Книга 11',
                author: 'Автор 11',
                rating: '4.4/5',
                thumbnail: 'https://www.gutenberg.org/cache/epub/74632/pg74632.cover.medium.jpg'
            },
            {
                title: 'Книга 12',
                author: 'Автор 12',
                rating: '4.1/5',
                thumbnail: 'https://www.gutenberg.org/cache/epub/74632/pg74632.cover.medium.jpg'
            },
            {
                title: 'Книга 13',
                author: 'Автор 13',
                rating: '4.0/5',
                thumbnail: 'https://www.gutenberg.org/cache/epub/74632/pg74632.cover.medium.jpg'
            },
        ],
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
                                    {/*<p className='hn1'>{book.rating}</p>*/}
                                    <p className='hn1'>4.7/5</p>
                                </div>
                            </div>
                        )
                    )}
                </div>
                <button onClick={loadMoreBooks} className='load-more-books'>Показать ещё</button>
            </div>
            <Carousel
                key={0}
                books={section.books}
                sectionName={section.sectionName}
                booksPerSlide={4}
            />
        </div>
    );
};

export default MultiCarousel;
