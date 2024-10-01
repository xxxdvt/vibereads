import React, { useState } from 'react';
import '../scss/Carousel.css'; // Подключение SCSS стилей
import cover from '../assets/img/cover3.jpg'

const Carousel = ({ books, sectionName, booksPerSlide = 4 }) => {
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
                <button className="carousel-button prev" onClick={prevSlide}>
                    &#10094;
                </button>

                <div className="carousel-slides">
                    {getVisibleBooks().map((book, index) => (
                        <div key={index} className="carousel-slide">
                            <img src={cover} alt={book.title} />
                            <div className="book-info">
                                <h3>{book.title}</h3>
                                <p>{book.author}</p>
                                <p>{book.rating}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="carousel-button next" onClick={nextSlide}>
                    &#10095;
                </button>
            </div>
        </div>
    );
};

const MultiCarousel = () => {
    const sections = [
        {
            sectionName: 'Новинки',
            books: [
                { title: 'Книга 1', author: 'Автор 1', rating: '4.8/5', thumbnail: 'url_to_image_1' },
                { title: 'Книга 2', author: 'Автор 2', rating: '4.1/5', thumbnail: 'url_to_image_2' },
                { title: 'Книга 3', author: 'Автор 3', rating: '4.5/5', thumbnail: 'url_to_image_3' },
                { title: 'Книга 4', author: 'Автор 4', rating: '5/5', thumbnail: 'url_to_image_4' },
                { title: 'Книга 5', author: 'Автор 5', rating: '4.7/5', thumbnail: 'url_to_image_5' },
                { title: 'Книга 6', author: 'Автор 6', rating: '4.3/5', thumbnail: 'url_to_image_6' },
                { title: 'Книга 7', author: 'Автор 7', rating: '3.8/5', thumbnail: 'url_to_image_7' },
                { title: 'Книга 8', author: 'Автор 8', rating: '2.3/5', thumbnail: 'url_to_image_8' },
            ],
        },
        {
            sectionName: 'Популярное',
            books: [
                { title: 'Книга 9', author: 'Автор 9', rating: '4/5', thumbnail: 'url_to_image_9' },
                { title: 'Книга 10', author: 'Автор 10', rating: '4.5/5', thumbnail: 'url_to_image_10' },
                { title: 'Книга 11', author: 'Автор 11', rating: '4.4/5', thumbnail: 'url_to_image_11' },
                { title: 'Книга 12', author: 'Автор 12', rating: '4.1/5', thumbnail: 'url_to_image_12' },
                { title: 'Книга 13', author: 'Автор 13', rating: '4.0/5', thumbnail: 'url_to_image_13' },
            ],
        },
    ];

    return (
        <div>
            {sections.map((section, index) => (
                <Carousel
                    key={index}
                    books={section.books}
                    sectionName={section.sectionName}
                    booksPerSlide={4}
                />
            ))}
        </div>
    );
};

export default MultiCarousel;
