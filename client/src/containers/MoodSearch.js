import React, {useState} from 'react';
import '../scss/MoodSearch.css'
import searchIcon from '../assets/icons/search.png';

function MoodSearch(props) {
    const [isFilled, setIsFilled] = useState('search-bar-mood unfilled');

    function handleBlur(event) {
        if (event.target.value === '') {
            setIsFilled('search-bar-mood unfilled')
        } else {
            setIsFilled('search-bar-mood filled')
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        event.target.querySelector('.search-bar-mood-input').blur();
    }

    return (
        <div className={isFilled}>
            <div className="w-full sm:max-w-2xl sm:mx-auto">
                <div className="overflow-hidden z-0 rounded-full relative p-3">
                    <form role="form" onSubmit={handleSubmit} className="relative flex z-50 bg-white rounded-full">
                        <input type="text" placeholder="как вы чувствуете себя сегодня?"
                               className="search-bar-mood-input rounded-full flex-1 px-6 py-4 text-gray-700 focus:outline-none" onBlur={handleBlur}/>
                        <button
                            className="rounded-full font-semibold px-8 py-4 focus:outline-none">
                            <img src={searchIcon} alt="Search" className="w-8"/>
                        </button>
                    </form>
                    <div className="glow glow-1 z-10 bg-blue-300 absolute"></div>
                    <div className="glow glow-2 z-20 bg-blue-500 absolute"></div>
                    <div className="glow glow-3 z-30 bg-blue-700 absolute"></div>
                    <div className="glow glow-4 z-40 bg-blue-900 absolute"></div>
                </div>
            </div>
        </div>
    );
}

export default MoodSearch;