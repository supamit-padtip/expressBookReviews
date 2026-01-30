const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let authenticatedUser = require("./auth_users.js").authenticatedUser;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (authenticatedUser(username, password)) {
        return res.status(400).json({ message: "Username already exist" })
    }

    if (!username || !password) {
        return res.status(400).json({ message: "Username or Password is not provided" })
    }

    users.push({ username, password })

    return res.status(300).json({ message: "Registered user" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {

    new Promise((resolve) => {
        resolve(books)
    }).then((promiseBook) => {
        res.status(200).json(promiseBook);
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    new Promise((resolve) => {
        resolve(books)
    }).then((promiseBook) => {
        const isbn = req.params.isbn;
        const newObj = {}

        Object.entries(promiseBook).filter(([key, value]) =>
            key === isbn
        ).forEach((([key, value]) => {
            newObj[key] = value;
        }));

        return res.status(200).json(newObj);
    })

});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    new Promise((resolve) => {
        resolve(books)
    }).then((promiseBook) => {
        const author = req.params.author;
        const newObj = {}
    
        Object.entries(promiseBook).filter(([key, value]) =>
            value.author === author
        ).forEach((([key, value]) => {
            newObj[key] = value;
        }));
    
        return res.status(200).json(newObj);
    })
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    new Promise((resolve) => {
        resolve(books)
    }).then((promiseBook) => {
        const title = req.params.title;
        const newObj = {}
    
        Object.entries(promiseBook).filter(([key, value]) =>
            value.title === title
        ).forEach((([key, value]) => {
            newObj[key] = value;
        }));
    
        return res.status(200).json(newObj);
    })
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const newObj = {}

    Object.entries(books).filter(([key, value]) =>
        key === isbn
    ).forEach((([key, value]) => {
        newObj[key] = value.reviews;
    }));

    return res.status(300).json(newObj);
});

module.exports.general = public_users;
