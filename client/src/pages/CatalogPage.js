import React from 'react';
import MultiCarousel from "../containers/MultiCarousel";
import Search from "../containers/Search";

function CatalogPage() {
    return (
        <div className="catalog-wrapper">
            <Search />
        <MultiCarousel />
        </div>
    );
}

export default CatalogPage;