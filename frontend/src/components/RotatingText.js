import React, {useEffect, useRef} from "react";
import "../scss/RotatingText.css"; // Импортируйте ваш CSS файл

const RotatingText = () => {
    const wordsRef = useRef([]);

    useEffect(() => {
        const words = wordsRef.current;
        let currentWordIndex = 0;
        const maxWordIndex = words.length - 1;
        words[currentWordIndex].style.opacity = "1";

        const rotateText = () => {
            const currentWord = words[currentWordIndex];
            const nextWord =
                currentWordIndex === maxWordIndex ? words[0] : words[currentWordIndex + 1];

            // rotate out letters of current word
            Array.from(currentWord.children).forEach((letter, i) => {
                setTimeout(() => {
                    letter.className = "letter out";
                }, i * 80);
            });

            // reveal and rotate in letters of next word
            nextWord.style.opacity = "1";
            Array.from(nextWord.children).forEach((letter, i) => {
                letter.className = "letter behind";
                setTimeout(() => {
                    letter.className = "letter in";
                }, 340 + i * 80);
            });

            currentWordIndex = currentWordIndex === maxWordIndex ? 0 : currentWordIndex + 1;
        };

        rotateText();
        const intervalId = setInterval(rotateText, 4000);

        return () => clearInterval(intervalId); // очистка при размонтировании компонента
    }, []);

    return (
        <div className="rotating-text">
            <p>каждое настроение -&nbsp;</p>
            <p>
                {["история.", "впечатление.", "открытие.", "приключение."].map((word, index) => (
                    <span
                        key={index}
                        className={`word ${index % 5 === 0 ? 'alizarin' : index % 5 === 1 ? 'wisteria' : index % 5 === 2 ? 'emerald' : 'sun-flower'} `}
                        ref={(el) => (wordsRef.current[index] = el)}
                        // style={{textAlign: 'end'}}
                    >
            {word.split("").map((letter, letterIndex) => (
                <span key={letterIndex} className="letter">
                {letter}
              </span>
            ))}
          </span>
                ))}
            </p>
        </div>
    );
};

export default RotatingText;
