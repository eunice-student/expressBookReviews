const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// ======================================================
// TASK 6 - REGISTER NEW USER
// ======================================================

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check that username and password were provided
  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  // Check if username already exists
  if (isValid(username)) {
    return res.status(409).json({
      message: "Username already exists"
    });
  }

  // Register new user
  users.push({
    username: username,
    password: password
  });

  return res.status(200).json({
    message: "User successfully registered. Now you can login"
  });
});


// ======================================================
// TASK 1 - GET ALL BOOKS
// ======================================================

public_users.get('/', function (req, res) {
  res.status(200).json(books);
});


// ======================================================
// TASK 2 - GET BOOK BY ISBN
// ======================================================

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    res.status(200).json(books[isbn]);
  } else {
    res.status(404).json({
      message: "Book not found"
    });
  }
});


// ======================================================
// TASK 3 - GET BOOKS BY AUTHOR
// ======================================================

public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const result = [];

  const keys = Object.keys(books);

  keys.forEach((key) => {
    if (books[key].author === author) {
      result.push(books[key]);
    }
  });

  if (result.length > 0) {
    res.status(200).json(result);
  } else {
    res.status(404).json({
      message: "No books found for this author"
    });
  }
});


// ======================================================
// TASK 4 - GET BOOKS BY TITLE
// ======================================================

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const result = [];

  const keys = Object.keys(books);

  keys.forEach((key) => {
    if (books[key].title === title) {
      result.push(books[key]);
    }
  });

  if (result.length > 0) {
    res.status(200).json(result);
  } else {
    res.status(404).json({
      message: "No books found with this title"
    });
  }
});


// ======================================================
// TASK 5 - GET BOOK REVIEW
// ======================================================

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  if (Object.keys(books[isbn].reviews).length === 0) {
    return res.status(404).json({
      message: "No reviews found for this book."
    });
  }

  res.status(200).json(books[isbn].reviews);
});


// ======================================================
// TASK 10 - GET ALL BOOKS USING ASYNC/AWAIT + AXIOS
// ======================================================

public_users.get('/async/books', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving books",
      error: error.message
    });
  }
});


// ======================================================
// TASK 11 - GET BOOK BY ISBN USING ASYNC/AWAIT + AXIOS
// ======================================================

public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;

    const response = await axios.get(
      `http://localhost:5000/isbn/${isbn}`
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({
      message: "Book not found",
      error: error.message
    });
  }
});


// ======================================================
// TASK 12 - GET BOOKS BY AUTHOR USING ASYNC/AWAIT + AXIOS
// ======================================================

public_users.get('/async/author/:author', async function (req, res) {
  try {
    const author = req.params.author;

    const response = await axios.get(
      `http://localhost:5000/author/${encodeURIComponent(author)}`
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({
      message: "No books found for this author",
      error: error.message
    });
  }
});


// ======================================================
// TASK 13 - GET BOOKS BY TITLE USING ASYNC/AWAIT + AXIOS
// ======================================================

public_users.get('/async/title/:title', async function (req, res) {
  try {
    const title = req.params.title;

    const response = await axios.get(
      `http://localhost:5000/title/${encodeURIComponent(title)}`
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({
      message: "No books found with this title",
      error: error.message
    });
  }
});


module.exports.general = public_users;
