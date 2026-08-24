const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "User already exists"
    });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(201).json({
    message: "User successfully registered"
  });
});


// ======================================================
// TASK 10
// Get the book list using Async/Await and Axios
// ======================================================

public_users.get('/', async function (req, res) {

  try {

    const response = await axios.get('http://localhost:5000/books');

    return res.status(200).json(response.data);

  } catch (error) {

    // Use the local books database as the source
    // when the Axios request cannot be completed.
    return res.status(200).json(books);

  }

});


// Internal endpoint used by Axios for Task 10
public_users.get('/books', function (req, res) {

  return res.status(200).json(books);

});


// ======================================================
// TASK 11
// Get book details based on ISBN using Async/Await
// and Axios
// ======================================================

public_users.get('/isbn/:isbn', async function (req, res) {

  const isbn = req.params.isbn;

  try {

    const response = await axios.get(
      `http://localhost:5000/books/isbn/${isbn}`
    );

    return res.status(200).json(response.data);

  } catch (error) {

    if (books[isbn]) {
      return res.status(200).json(books[isbn]);
    }

    return res.status(404).json({
      message: "Book not found"
    });

  }

});


// Internal endpoint used by Axios for Task 11
public_users.get('/books/isbn/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }

  return res.status(404).json({
    message: "Book not found"
  });

});


// ======================================================
// TASK 12
// Get books by author using Async/Await and Axios
// ======================================================

public_users.get('/author/:author', async function (req, res) {

  const author = req.params.author;

  try {

    const response = await axios.get(
      `http://localhost:5000/books/author/${encodeURIComponent(author)}`
    );

    return res.status(200).json(response.data);

  } catch (error) {

    const result = {};

    Object.keys(books).forEach((key) => {

      if (
        books[key].author.toLowerCase() ===
        author.toLowerCase()
      ) {
        result[key] = books[key];
      }

    });

    if (Object.keys(result).length > 0) {
      return res.status(200).json(result);
    }

    return res.status(404).json({
      message: "No books found for this author"
    });

  }

});


// Internal endpoint used by Axios for Task 12
public_users.get('/books/author/:author', function (req, res) {

  const author = req.params.author;

  const result = {};

  Object.keys(books).forEach((key) => {

    if (
      books[key].author.toLowerCase() ===
      author.toLowerCase()
    ) {
      result[key] = books[key];
    }

  });

  if (Object.keys(result).length > 0) {
    return res.status(200).json(result);
  }

  return res.status(404).json({
    message: "No books found for this author"
  });

});


// ======================================================
// TASK 13
// Get books by title using Async/Await and Axios
// ======================================================

public_users.get('/title/:title', async function (req, res) {

  const title = req.params.title;

  try {

    const response = await axios.get(
      `http://localhost:5000/books/title/${encodeURIComponent(title)}`
    );

    return res.status(200).json(response.data);

  } catch (error) {

    const result = {};

    Object.keys(books).forEach((key) => {

      if (
        books[key].title.toLowerCase() ===
        title.toLowerCase()
      ) {
        result[key] = books[key];
      }

    });

    if (Object.keys(result).length > 0) {
      return res.status(200).json(result);
    }

    return res.status(404).json({
      message: "No books found with this title"
    });

  }

});


// Internal endpoint used by Axios for Task 13
public_users.get('/books/title/:title', function (req, res) {

  const title = req.params.title;

  const result = {};

  Object.keys(books).forEach((key) => {

    if (
      books[key].title.toLowerCase() ===
      title.toLowerCase()
    ) {
      result[key] = books[key];
    }

  });

  if (Object.keys(result).length > 0) {
    return res.status(200).json(result);
  }

  return res.status(404).json({
    message: "No books found with this title"
  });

});


// ======================================================
// Get book review
// ======================================================

public_users.get('/review/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({
    message: "Book not found"
  });

});


module.exports.general = public_users;
