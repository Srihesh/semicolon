# The Regex Engine 🚂

A cyberpunk-themed, interactive world for learning and testing regular expressions. Built with 100% vanilla HTML, CSS, and JavaScript.

### ✨ [Live Demo Link Here] ✨

---

## About The Project

The Regex Engine isn't just a tool; it's a self-contained world perpetually in motion. The theme is a cyberpunk train, where each "carriage" is a different utility for working with regular expressions.

* **The Engine Room (`visualizer.html`):** An interactive visualizer that breaks down how a regex pattern processes a string, step by step.
* **The Greenhouse (`playground.html`):** A sterile, safe environment to test patterns against multiple strings and experiment with substitutions.
* **The Tail Section (`challenges.html`):** A "Regex Golf" arena where you try to solve challenges with the shortest possible pattern.
* **The Archive (`archive.html`):** A dusty library of common regex patterns and a handy cheatsheet for quick reference.

The entire project is designed to be an immersive and fun way to engage with the often-intimidating world of regex.

---

## Features

* **Interactive Regex Visualizer:** See exactly how the regex engine walks through your string.
* **Live Regex Playground:** Test your patterns against multiple cases in real-time and see substitution results.
* **"Regex Golf" Challenges:** Test your skills with challenges that require you to match and reject specific strings.
* **Pattern Library:** A curated list of common regex patterns (like emails, URLs, IPs) that you can copy with one click.
* **Dynamic Cheatsheet:** An interactive reference for common regex tokens.
* **Multiple Cyberpunk Themes:** Choose between Cyber, Matrix, and Solarized color schemes.
* **Immersive UI/UX:** Featuring glitch text effects, a dynamic cursor light, subtle animations, and UI sound effects to bring the world to life.

---

## How It Works

The entire application is driven by a single `script.js` file that contains all the logic. It uses a main `RegexVoyagerApp` class to initialize pages and common features.

### Core Logic
* **Page Detection:** On load, the script checks for a specific element unique to each page (e.g., `.home-section`, `.playground-section`) and runs the corresponding initialization function.
* **UI/UX:** Common features like the theme-switcher, navbar clock, preloader effects, cursor light, and sound effects are initialized on every page.
* **Data Constants:** The script holds predefined JavaScript arrays for common patterns, cheatsheet data, and challenges, which are used to dynamically populate the content on relevant pages.

### The Engine Room (Visualizer)
1.  When you click "Visualize," the script captures the regex pattern and test string.
2.  It runs a custom function (`generateStepsDetailed`) that simulates a simple regex engine. It iterates through the test string, attempting to match the pattern from each possible starting position.
3.  The function builds an array of "steps," where each step is an object describing an action (e.g., "Token `\d` matches `7`," "FAIL: Token `a` does not match `b`," "MATCH FOUND").
4.  For complex patterns containing lookarounds or advanced features, it switches to a simplified mode that only highlights the final matches.
5.  You can then use the "Next," "Previous," and "Auto-Play" buttons to step through this array, and a `renderStep` function updates the UI to highlight the current characters in the pattern and string, and prints the explanation to the log.

### The Greenhouse (Playground)
1.  The "Execute" button triggers a function that reads the regex pattern, test cases (splitting the textarea value by new lines), and the substitution string.
2.  It validates the regex pattern inside a `try...catch` block to prevent errors from invalid syntax.
3.  It then loops through each test case:
    * It uses `new RegExp(pattern).test(testCase)` to check for a match and dynamically adds a "PASS" or "FAIL" list item to the results.
    * If a substitution string is provided, it uses `testCase.replace(new RegExp(pattern, 'g'), subPattern)` to perform a global substitution and displays the result.
4.  The "Share" button encodes the content of the three input fields into a URL using `btoa()` (Base64) and copies it to the clipboard. The script can also read these URL parameters to pre-fill the playground.

### The Tail Section (Challenges)
1.  The page loads the list of challenges from the `CHALLENGES_DATA` constant into the dropdown selector.
2.  When a challenge is selected, a `loadChallenge` function populates the description and dynamically creates the "Must Match" and "Must Not Match" lists.
3.  An `input` event listener on the text field triggers a `validate` function every time you type.
4.  This function creates a new `RegExp` from your input. It then iterates through the "Must Match" list, testing if the regex matches each item, and through the "Must Not Match" list, testing if the regex *does not* match.
5.  Based on the test results, it applies a `.pass` or `.fail` CSS class to each list item for immediate visual feedback.

### The Archive (Library & Cheatsheet)
1.  The page dynamically generates the HTML for the Pattern Library by mapping over the `COMMON_PATTERNS` array, creating a card for each pattern.
2.  A click listener on each pattern card copies the regex stored in its `data-pattern` attribute to the user's clipboard.
3.  Similarly, the Cheatsheet grid is built by iterating through the `CHEATSHEET_DATA` array.
4.  When a cheatsheet token is clicked, it opens a modal and populates it with the token's data, including a simple demonstration of the token in action.

---

## Tech Stack

This project was built with a focus on fundamentals and a framework-free approach.

* **HTML5:** Semantic and accessible structure.
* **CSS3:** Modern styling with Custom Properties (for theming), Flexbox, and Grid.
* **Vanilla JavaScript (ES6+):** All logic, from DOM manipulation to the regex tool implementation, is written in pure, dependency-free JavaScript.

**No frameworks, no libraries, no dependencies!**

---

## Running Locally

It couldn't be simpler. Since there are no build steps or dependencies:

1.  Clone the repository:
    ```sh
    git clone [https://github.com/Srihesh/semicolon.git](https://github.com/Srihesh/semicolon.git)
    ```
2.  Navigate to the project directory:
    ```sh
    cd semicolon
    ```
3.  Open the `index.html` file in your favorite web browser.

And you're ready to board the train! Thanks for checking it out.
