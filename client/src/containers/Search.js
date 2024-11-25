import React, {useState} from 'react';
import debounce from 'lodash.debounce';
import '../scss/Search.css';
import {useNavigate} from "react-router-dom";
import AlertDialogSlide from "../components/AlertDialog";


const Search = () => {
    const [query, setQuery] = useState('');
    const [autocompleteResults, setAutocompleteResults] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

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
    const [alertFlag, setAlertFlag] = useState(false);

    const handleBookClick = async (event) => {
        const clickedId = parseInt(event.target.src.toString().split('/')[5]);
        if (await checkUserLogin()) {
            navigate(`/books/${clickedId}`);
        } else {
            setAlertFlag(false);
            setTimeout(() => setAlertFlag(true), 0);
        }
    }
    // Автозаполнение при каждом изменении текста
    const handleInputChange = debounce(async (newQuery) => {
        if (newQuery.length > 2) {
            const response = await fetch(`http://127.0.0.1:5000/api/autocomplete?query=${newQuery}`);
            const data = await response.json();
            setAutocompleteResults(data);
            setSearchResults([]);
            console.log(data);
        } else {
            setAutocompleteResults([]);
        }
    }, 300);

    // Обработка изменения текста и вызов автозаполнения
    const handleChange = (e) => {
        const newQuery = e.target.value;
        console.log(newQuery);
        setQuery(newQuery);
        handleInputChange(newQuery);
    };

    // Запуск обычного поиска при отправке формы
    const handleSearch = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://127.0.0.1:5000/api/search?query=${query}`);
        const data = await response.json();
        setSearchResults(data);
        setAutocompleteResults([]);
        e.target.querySelector('#search-barrr').blur()
    };

    return (
        <div>
            <form className="w-1/2 mx-auto" onSubmit={handleSearch}>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor"
                                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={handleChange}
                        placeholder="Введите название книги или автора..."
                        id='search-barrr'
                        className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <button type="submit"
                            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Поиск
                    </button>
                </div>
            </form>

            {/* Отображение результатов автозаполнения */}

            <div className='grid--container-search'>
                {autocompleteResults.map((book, index) => (
                    <div className="grid--container-search-elem" key={index}>
                        <img src={book["thumbnail"]} alt={book.title} className="grid--container-search-elem-img"
                             onClick={handleBookClick}/>
                        <div className="search-book-info">
                            <p className='search-hn'>{book.title}</p>
                            <p className='search-hn1'>{book.author}</p>
                            <p className='search-hn1'>
                                {(book['rating'] === '0/5') ? (
                                    <span>Нет оценок</span>
                                ) : (
                                    <span>{book['rating']}</span>
                                )}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            {/* Отображение результатов поиска */}
            <div className='grid--container-search'>
                {searchResults.map((book, index) => (
                    <div className="grid--container-search-elem" key={index}>
                        <img src={book["thumbnail"]} alt={book.title} className="grid--container-search-elem-img"
                             onClick={handleBookClick}/>
                        <div className="search-book-info">
                            <p className='search-hn'>{book.title}</p>
                            <p className='search-hn1'>{book.author}</p>
                            <p className='search-hn1'>
                                {(book['rating'] === '0/5') ? (
                                    <span>Нет оценок</span>
                                ) : (
                                    <span>{book['rating']}</span>
                                )}</p>
                        </div>
                    </div>
                ))}
            </div>
            {alertFlag && (
                <AlertDialogSlide isDialog={true} defState={true} />
            )}
        </div>
    );
};

export default Search;
