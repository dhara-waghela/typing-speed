//const API_URL = 'https://dummyjson.com/quotes/random';
const API_URL = [https://api.quotable.io/random](https://api.quotable.io/random)
 
// DOM Elements
const quoteDisplay = document.getElementById('quoteDisplay');
const quoteInput = document.getElementById('quoteInput');
const loadingElement = document.getElementById('loading');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const highScoreElement = document.getElementById('highScore');
const nextBtn = document.getElementById('nextBtn');
const resetHighScoreBtn = document.getElementById('resetHighScoreBtn');

// State Variables
let timerInterval = null;
let startTime = null;
let totalErrors = 0;
let isTesting = false;
let highScore = localStorage.getItem('typingHighScore') || 0;

// Initialize
highScoreElement.innerText = `${highScore} WPM`;
fetchNewQuote();

// Fetch a new random quote from the API
async function fetchNewQuote() {
    resetState();
    loadingElement.style.display = 'block';
    quoteDisplay.innerHTML = '';
    quoteInput.disabled = true;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const quoteText = data.content;

        // Render each character wrapped in a span
        quoteText.split('').forEach(char => {
            const charSpan = document.createElement('span');
            charSpan.innerText = char;
            quoteDisplay.appendChild(charSpan);
        });

        loadingElement.style.display = 'none';
        quoteInput.disabled = false;
        quoteInput.focus();
    } catch (error) {
        loadingElement.innerText = 'Failed to load quote. Click "Next Quote" to retry.';
        console.error('Error fetching quote:', error);
    }
}

// Typing Event Handler
quoteInput.addEventListener('input', () => {
    const arrayQuote = quoteDisplay.querySelectorAll('span');
    const arrayValue = quoteInput.value.split('');

    // Start timer on first keystroke
    if (!isTesting && arrayValue.length > 0) {
        startTimer();
    }

    let errorsThisFrame = 0;

    arrayQuote.forEach((charSpan, index) => {
        const typedChar = arrayValue[index];

        if (typedChar == null) {
            charSpan.classList.remove('correct', 'incorrect');
        } else if (typedChar === charSpan.innerText) {
            charSpan.classList.add('correct');
            charSpan.classList.remove('incorrect');
        } else {
            charSpan.classList.add('incorrect');
            charSpan.classList.remove('correct');
            errorsThisFrame++;
        }
    });

    totalErrors = errorsThisFrame;
    updateAccuracy(arrayValue.length);

    // Check completion
    if (arrayValue.length >= arrayQuote.length && errorsThisFrame === 0) {
        completeTest();
    }
});

// Timer Logic
function startTimer() {
    isTesting = true;
    startTime = new Date();
    timerInterval = setInterval(() => {
        const elapsedTime = getElapsedTimeInSeconds();
        timerElement.innerText = `${elapsedTime}s`;
        updateWPM(elapsedTime);
    }, 1000);
}

function getElapsedTimeInSeconds() {
    return Math.floor((new Date() - startTime) / 1000);
}

function updateWPM(elapsedSeconds) {
    if (elapsedSeconds === 0) return;
    const typedWords = quoteInput.value.trim().length / 5; // Standard WPM measure (5 chars = 1 word)
    const wpm = Math.round((typedWords / elapsedSeconds) * 60);
    wpmElement.innerText = wpm >= 0 ? wpm : 0;
}

function updateAccuracy(totalTypedChars) {
    if (totalTypedChars === 0) {
        accuracyElement.innerText = '100%';
        return;
    }
    const correctChars = totalTypedChars - totalErrors;
    const accuracy = Math.max(0, Math.round((correctChars / totalTypedChars) * 100));
    accuracyElement.innerText = `${accuracy}%`;
}

function completeTest() {
    clearInterval(timerInterval);
    const finalWpm = parseInt(wpmElement.innerText);

    // Check for new High Score
    if (finalWpm > highScore) {
        highScore = finalWpm;
        localStorage.setItem('typingHighScore', highScore);
        highScoreElement.innerText = `${highScore} WPM`;
        alert(`🎉 New High Score: ${finalWpm} WPM!`);
    }

    quoteInput.disabled = true;
}

// Reset state between tests
function resetState() {
    clearInterval(timerInterval);
    isTesting = false;
    totalErrors = 0;
    timerElement.innerText = '0s';
    wpmElement.innerText = '0';
    accuracyElement.innerText = '100%';
    quoteInput.value = '';
    quoteInput.disabled = false;
}

// Control Buttons
nextBtn.addEventListener('click', fetchNewQuote);

resetHighScoreBtn.addEventListener('click', () => {
    localStorage.removeItem('typingHighScore');
    highScore = 0;
    highScoreElement.innerText = '0 WPM';
});
