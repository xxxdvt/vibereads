import React from 'react';
import MoodSearch from "../containers/MoodSearch";
import '../scss/MoodPage.css'

function MoodPage(props) {
    return (
        <div className='mood-search-wrapper'>
            <MoodSearch/>
        </div>
    );
}

export default MoodPage;