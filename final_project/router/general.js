const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

const BASE_URL = "http://localhost:5000";

public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get(`${BASE_URL}/books_internal`); 
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    axios.get(`${BASE_URL}/books_internal/isbn/${isbn}`)
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            res.status(404).json({ message: "Book not found", error: error.message });
        });
});

public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await axios.get(`${BASE_URL}/books_internal/author/${author}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: "Error fetching books by author", error: error.message });
    }
});

public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const response = await axios.get(`${BASE_URL}/books_internal/title/${title}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: "Error fetching books by title", error: error.message });
    }
});

public_users.get('/books_internal', (req, res) => res.send(JSON.stringify(books, null, 4)));

public_users.get('/books_internal/isbn/:isbn', (req, res) => {
    const book = books[req.params.isbn];
    book ? res.json(book) : res.status(404).send("Not found");
});

public_users.get('/books_internal/author/:author', (req, res) => {
    let results = Object.values(books).filter(b => b.author === req.params.author);
    res.json(results);
});

public_users.get('/books_internal/title/:title', (req, res) => {
    let results = Object.values(books).filter(b => b.title === req.params.title);
    res.json(results);
});
