import React, {useEffect, useState} from "react";
import "../scss/FavouritesButton.css";

const AnimatedButton = () => {
    const [buttonState, setButtonState] = useState("button-fav");
    const book_id = localStorage.getItem('curBook')
    useEffect(() => {
        async function getButtonState() {
            const response = await fetch(`http://127.0.0.1:5000/api/books/check-favourites/${book_id}`, {
                "method": "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            await setButtonState(data['message']);
            if (data['message'] === 'button-fav validate') {
                setBgColor("#0a36a9");
            } else {
                setBgColor("#fff");

            }
        }

        getButtonState().then()
    }, []);
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
