import React from 'react';
import '../scss/SearchPage.css';
import Search from '../containers/Search.js';

function SearchPage(props) {
    return (
        <div className='search-page-wrapper'>
            <Search />
        </div>
    );
}

export default SearchPage;