const API_URL = 'https://quoteslate.vercel.app/api/quotes/random';

// DOM Elements - Main Page
const quoteDisplay = document.getElementById('quoteDisplay');
const quoteInput = document.getElementById('quoteInput');
const loadingElement = document.getElementById('loading');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const highScoreElement = document.getElementById('highScore');
const nextBtn = document.getElementById('nextBtn');
const resetHighScoreBtn = document.getElementById('resetHighScoreBtn');

// DOM Elements - Modal Popup
const resultModal = document.getElementById('resultModal');
const modalWpm = document.getElementById('modalWpm');
const modalAccuracy = document.getElementById('modalAccuracy');
const modalTime = document.getElementById('modalTime');
const highScoreNotice = document.getElementById('highScoreNotice');
const modalNextBtn = document.getElementById('modalNextBtn');
const modalExitBtn = document.getElementById('modalExitBtn');

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
    closeModal();
    loadingElement.style.display = 'block';
    quoteDisplay.innerHTML = '';
    quoteInput.disabled = true;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const quoteText = data.quote;

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
    const typedWords = quoteInput.value.trim().length / 5;
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

// Called when test is finished
function completeTest() {
    clearInterval(timerInterval);
    const finalWpm = parseInt(wpmElement.innerText);
    const finalAccuracy = accuracyElement.innerText;
    const finalTime = timerElement.innerText;

    // Check high score
    if (finalWpm > highScore) {
        highScore = finalWpm;
        localStorage.setItem('typingHighScore', highScore);
        highScoreElement.innerText = `${highScore} WPM`;
        highScoreNotice.style.display = 'block';
    } else {
        highScoreNotice.style.display = 'none';
    }

    quoteInput.disabled = true;

    // Show custom modal popup
    showModal(finalWpm, finalAccuracy, finalTime);
}

// Modal Functions
function showModal(wpm, accuracy, time) {
    modalWpm.innerText = `${wpm} WPM`;
    modalAccuracy.innerText = accuracy;
    modalTime.innerText = time;
    resultModal.classList.add('active');
}

function closeModal() {
    resultModal.classList.remove('active');
}

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

// Event Listeners
nextBtn.addEventListener('click', fetchNewQuote);

resetHighScoreBtn.addEventListener('click', () => {
    localStorage.removeItem('typingHighScore');
    highScore = 0;
    highScoreElement.innerText = '0 WPM';
});

// Modal Action Buttons
modalNextBtn.addEventListener('click', fetchNewQuote);

modalExitBtn.addEventListener('click', () => {
    closeModal();
});
