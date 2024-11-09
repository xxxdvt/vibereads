import './scss/App.css'
import RotatingText from "./components/RotatingText";
import React from "react";


function App() {

    return (
        <main>

            <div className="adv-content">
                <RotatingText/>
                <button className="adv-content-btn">Попробовать</button>
            </div>
        </main>
    );
}

export default App;
