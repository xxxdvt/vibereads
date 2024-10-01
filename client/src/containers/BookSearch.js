import React, { useState } from 'react';
import axios from 'axios';


const BookSearch = () => {
    const [searchTerm, setSearchTerm] = useState(''); // Для хранения названия книги.
    const [bookImage, setBookImage] = useState('');   // Для хранения URL обложки книги.

    const API_KEY = 'AIzaSyDcXf8K8l0xmGbCAfGEmQca30oREh-vDPU';

    const searchBook = async () => {
        try {
            const response = await axios.get(
                `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=${API_KEY}`
            );

            // Получаем обложку первой книги из результатов поиска.
            const imageUrl = response.data.items[0].volumeInfo.imageLinks.thumbnail;
            console.log(response.data.items);
            setBookImage(imageUrl);
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            setBookImage('');
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <input
                type="text"
                placeholder="Введите название книги"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '300px', padding: '10px' }}
            />
            <br />
            <button onClick={searchBook} style={{ marginTop: '20px' }}>Поиск</button>
            <div style={{ marginTop: '20px' }}>
                {bookImage ? <img src={bookImage} alt="Обложка книги" /> : <p>Обложка не найдена</p>}
            </div>
        </div>
    );
};

export default BookSearch;