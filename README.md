# TypeSpeed - Interactive Typing Speed Tester

A lightweight, modern web application built to measure typing speed (WPM) and accuracy in real-time. Statements are fetched dynamically using a REST API, ensuring a new sentence on every attempt.

![TypeSpeed Preview](https://img.shields.io/badge/Status-Active-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue)

## Features

* **Dynamic Text Generation:** Fetches random quotes on demand via REST API.
* **Real-time Visual Feedback:** Color-coded character highlighting (Green for correct, Red for mistakes).
* **Live Metrics Calculation:** Calculates Words Per Minute (WPM) and Accuracy percentage on the fly.
* **High Score Persistence:** Saves your personal record locally using `localStorage`.
* **Clean Dark Mode UI:** Styled with a responsive, modern dark layout using custom CSS variables.

## Built With

* **HTML5** - Structure and semantics
* **CSS3** - Custom properties (variables), Flexbox, modern dark theme styling
* **JavaScript (ES6+)** - Dynamic DOM manipulation, Fetch API (`async/await`), `localStorage`
