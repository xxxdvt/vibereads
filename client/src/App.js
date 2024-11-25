import './scss/App.css'
import RotatingText from "./components/RotatingText";
import React from "react";
import {useNavigate} from "react-router-dom";


function App() {
    const navigate = useNavigate();
    return (
        <main>
            <div className="adv-content">
                <RotatingText/>
                <button className="adv-content-btn" onClick={
                    () => {
                        navigate('/moody')
                    }
                }>Попробовать</button>
            </div>
        </main>
    );
}

export default App;
