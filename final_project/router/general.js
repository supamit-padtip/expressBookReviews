const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let authenticatedUser = require("./auth_users.js").authenticatedUser;
let axios = require("axios");
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  const promise = new Promise((resolve, reject) => {
    axios
      .get("http://localhost:5000/")
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });

  promise
    .then((data) => res.status(200).json(data))
    .catch((error) =>
      res
        .status(500)
        .json({ message: "Error fetching book list", error: error.message }),
    );
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const promise = new Promise((resolve, reject) => {
    axios
      .get(`http://localhost:5000/isbn/${isbn}`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });

    promise
    .then((data) => res.status(200).json(data))
    .catch((error) =>
      res
        .status(404)
        .json({ message: `Book with ISBN ${isbn} not found`, error: error.message }),
    );
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
    const author = req.params.author

    const promise = new Promise((resolve, reject) => {
    axios
      .get(`http://localhost:5000/author/${encodeURIComponent(author)}`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });

    promise
    .then((data) => res.status(200).json(data))
    .catch((error) =>
      res
        .status(404)
        .json({ message: `Author not found`, error: error.message }),
    );
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
    const title = req.params.title

    const promise = new Promise((resolve, reject) => {
    axios
      .get(`http://localhost:5000/title/${encodeURIComponent(title)}`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });

    promise
    .then((data) => res.status(200).json(data))
    .catch((error) =>
      res
        .status(404)
        .json({ message: `Title not found`, error: error.message }),
    );
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const newObj = {};

  Object.entries(books)
    .filter(([key, value]) => key === isbn)
    .forEach(([key, value]) => {
      newObj[key] = value.reviews;
    });

  return res.status(300).json(newObj);
});

module.exports.general = public_users;
