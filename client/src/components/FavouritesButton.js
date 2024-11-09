import React, { useState } from "react";
import "../scss/FavouritesButton.css"; // Импортируйте стили кнопки

const AnimatedButton = () => {
    const [buttonState, setButtonState] = useState("button-fav"); // Управление классами
    const [bgColor, setBgColor] = useState("#fff");
    const handleClick = () => {
        if (buttonState === "button-fav") {
            setButtonState("button-fav clicked");
            setBgColor("transparent");
            setTimeout(() => {
                setButtonState("button-fav validate");
                setBgColor("#0a36a9");
            }, 2250);
        } else if (buttonState === "button-fav validate") {

            setButtonState("button-fav clicked");
            setBgColor("transparent");

            setTimeout(() => {
                setButtonState("button-fav");
                setBgColor("#fff");

            }, 2250);

        }

    };

    return (
        <div className="container-fav">
            <button className={buttonState} style={{background: `${bgColor}`}} onClick={handleClick}></button>
        </div>
    );
};

export default AnimatedButton;
