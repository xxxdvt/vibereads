import React, {useEffect, useState} from 'react';
import '../scss/Carousel.css'; // Подключение SCSS стилей

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
                            <img src={book.thumbnail} alt={book.title} />
                            <div className="book-info">
                                <p className='hn'>{book.title}</p>
                                <p className='hn1'>{book.author}</p>
                                <p className='hn1'>{book.rating}</p>
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
    // const sections = ['Новинки', 'Популярные книги'];
    const [myData, setMyData] = useState([{}])
    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/books').then(
            response => response.json()
        ).then(data => setMyData(data));
    }, []);
    console.log(Array.from(myData));
    const sections = [
        {
            sectionName: 'Новинки',
            books: myData
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
