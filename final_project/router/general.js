const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(400).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get("http://localhost:5000/internal/books");
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    axios.get(`http://localhost:5000/internal/isbn/${isbn}`)
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            res.status(404).json({ message: "Book not found" });
        });
});

public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await axios.get(`http://localhost:5000/internal/author/${author}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: "Author not found" });
    }
});

public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const response = await axios.get(`http://localhost:5000/internal/title/${title}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: "Title not found" });
    }
});

public_users.get('/internal/books', (req, res) => {
    res.json(books);
});

public_users.get('/internal/isbn/:isbn', (req, res) => {
    const book = books[req.params.isbn];
    book ? res.json(book) : res.status(404).send("Not Found");
});

public_users.get('/internal/author/:author', (req, res) => {
    const filtered = Object.values(books).filter(b => b.author === req.params.author);
    res.json(filtered);
});

public_users.get('/internal/title/:title', (req, res) => {
    const filtered = Object.values(books).filter(b => b.title === req.params.title);
    res.json(filtered);
});

public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.status(200).json(books[isbn].reviews);
    } else {
        res.status(404).json({ message: "Review not found" });
    }
});

module.exports.general = public_users;
