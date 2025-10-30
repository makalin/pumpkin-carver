# Digital Pumpkin Carver 🎃

Welcome to the Digital Pumpkin Carver\! This is a simple, fun, front-end-only web application that works like a "Mr. Potato Head" for pumpkins.

Drag, drop, resize, and rotate parts like eyes, noses, mouths, and hats onto a blank pumpkin to create your own spooky (or silly) jack-o'-lantern. When you're done, you can download your creation as a high-quality PNG.

-----

## 🚀 Live Demo

**[Try it live right here\!](https://makalin.github.io/pumpkin-carver/)**

-----

## ✨ Features

  * **Drag & Drop:** Easily drag assets from the toolbox onto the pumpkin.
  * **Transform:** Click any part on the pumpkin to activate controls for **resizing** and **rotating**.
  * **Download:** A one-click "Download" button saves your final creation as a `.png` file.
  * **Simple & Fun:** No login, no backend. Just pure, instant pumpkin carving.

-----

## 💻 Tech Stack

This project is intentionally simple and built with:

  * **HTML5**
  * **CSS3**
  * **Vanilla JavaScript (ES6+)**
  * **[Konva.js](https://konvajs.org/):** A powerful 2D canvas library that makes all the drag-and-drop, transforming, and canvas manipulation incredibly easy.

-----

## 🛠️ How to Run Locally

This is a front-end-only project, so it's very simple to run:

1.  **Clone this repository:**

    ```bash
    git clone https://github.com/makalin/pumpkin-carver.git
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd pumpkin-carver
    ```

3.  **Open the `index.html` file in your browser.**

      * You can do this by right-clicking the file and choosing "Open with..."
      * Or, if you have VS Code with the "Live Server" extension, just click "Go Live".

That's it\! No complex builds or dependencies.

-----

## 🎃 Contributing for Hacktoberfest

This project is **perfect for Hacktoberfest** and first-time open-source contributors\! We actively welcome your help.

### The Easiest Way to Contribute: Add an Asset\!

The most fun way to contribute is by adding your own custom-drawn parts to the toolbox.

1.  **Create Your Part:**

      * Draw a new eye, mouth, hat, scar, or any other accessory.
      * It **must** be a **transparent `.png`** file (e.g., `spooky-eye.png` or `clown-nose.png`).
      * A good size to aim for is around 100x100 pixels, but any size will work.

2.  **Add Your File:**

      * Fork this repository.
      * Add your new `.png` file to the `assets/` folder (or create it if it doesn't exist).

3.  **Add it to the Toolbox:**

      * Open `index.html`.
      * Find the `<div id="toolbox">` section.
      * Add a new `<img>` tag for your part, just like the others:
        ```html
        <img 
            src="assets/your-new-part.png" 
            alt="A cool new part" 
            class="asset" />
        ```

4.  **Submit a Pull Request\!**

      * Commit your changes and open a PR. We'll review it and get it merged.

### Other Ways to Contribute

  * Find and fix a bug.
  * Add a new feature (e.g., a "Delete Part" button, a "Clear All" button, or layer controls).
  * Improve the CSS or mobile responsiveness.
  * Refactor the JavaScript to make it cleaner.

We welcome all contributions. Just fork the repo, make your changes, and send a PR\!

-----

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
