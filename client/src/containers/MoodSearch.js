import React, {useState} from 'react';
import '../scss/MoodSearch.css'
import searchIcon from '../assets/icons/search.png';
import {useNavigate} from "react-router-dom";
import AlertDialogSlide from "../components/AlertDialog";

function MoodSearch() {
    const [isFilled, setIsFilled] = useState('search-bar-mood unfilled');
    const navigate = useNavigate();

    function handleBlur(event) {
        if (event.target.value === '') {
            setIsFilled('search-bar-mood unfilled')
            setMoodData([]);
        } else {
            setIsFilled('search-bar-mood filled')
        }
    }

    const [moodQuery, setMoodQuery] = useState('')
    const [moodData, setMoodData] = useState([]);

    const handleChange = (e) => {
        const newQuery = e.target.value;
        console.log(newQuery);
        setMoodQuery(newQuery);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.target.querySelector('.search-bar-mood-input').blur();
        if (await checkUserLogin()) {
            const response = await fetch(`http://127.0.0.1:5000/api/moody?query=${moodQuery}`, {
                "method": "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const data = await response.json();
            await setMoodData(data);
        } else {
            setIsFilled('search-bar-mood unfilled')
            setAlertFlag(false);
            setTimeout(() => setAlertFlag(true), 0);
        }
    };

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
        navigate(`/books/${clickedId}`);
    }

    return (
        <div className='mood-search-wrapper'>
            <div className={isFilled}>
                <div className="w-full sm:max-w-2xl sm:mx-auto">
                    <div className="overflow-hidden z-0 rounded-full relative p-3">
                        <form onSubmit={handleSubmit} className="relative flex z-50 bg-white rounded-full">
                            <input type="text" placeholder="как вы чувствуете себя сегодня?"
                                   className="search-bar-mood-input rounded-full flex-1 px-6 py-4 text-gray-700 focus:outline-none"
                                   onChange={handleChange}
                                   onBlur={handleBlur}/>
                            <button
                                className="rounded-full font-semibold px-8 py-4 focus:outline-none">
                                <img src={`${searchIcon}`} alt="Search" className="w-8"/>
                            </button>
                        </form>
                        <div className="glow glow-1 z-10 bg-blue-300 absolute"></div>
                        <div className="glow glow-2 z-20 bg-blue-500 absolute"></div>
                        <div className="glow glow-3 z-30 bg-blue-700 absolute"></div>
                        <div className="glow glow-4 z-40 bg-blue-900 absolute"></div>
                    </div>
                </div>


            </div>
            <div className='grid--container-mood-search'>

                {moodData.map((book, index) => (
                    <div className="grid--container-mood-search-elem" key={index}>
                        <img src={book["thumbnail"]} alt={book.title} className="grid--container-mood-search-elem-img"
                             onClick={handleBookClick}/>
                        <div className="mood-search-book-info">
                            <p className='mood-search-hn'>{book.title}</p>
                            <p className='mood-search-hn1'>{book.author}</p>
                            <p className='mood-search-hn1'>
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
}

export default MoodSearch;