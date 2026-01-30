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
        const getBooks = await new Promise((resolve) => {
            resolve(books);
        });
        res.status(200).send(JSON.stringify(getBooks, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const getBookByISBN = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book not found");
        }
    });

    getBookByISBN
        .then((book) => res.status(200).json(book))
        .catch((err) => res.status(404).json({ message: err }));
});

public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const getBooksByAuthor = await new Promise((resolve) => {
            let filteredBooks = Object.values(books).filter(b => b.author === author);
            resolve(filteredBooks);
        });
        if (getBooksByAuthor.length > 0) {
            res.status(200).json(getBooksByAuthor);
        } else {
            res.status(404).json({ message: "No books found by this author" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const getBooksByTitle = await new Promise((resolve) => {
            let filteredBooks = Object.values(books).filter(b => b.title === title);
            resolve(filteredBooks);
        });
        if (getBooksByTitle.length > 0) {
            res.status(200).json(getBooksByTitle);
        } else {
            res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
