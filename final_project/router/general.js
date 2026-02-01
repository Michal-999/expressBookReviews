const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  let book = Object.values(books).filter((book) => {
    return book.isbn === isbn;
  });

  if (book.length > 0) {
    res.send(JSON.stringify(book, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  let book = Object.values(books).filter((book) => {
    return book.author === author;
  });

  if (book.length > 0) {
    res.send(JSON.stringify(book, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;

  let book = Object.values(books).filter((book) => {
    return book.title === title;
  });

  if (book.length > 0) {
    res.send(JSON.stringify(book, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  let book = Object.values(books).filter((book) => {
    return book.isbn === isbn;
  });

  if (book.length > 0) {
    res.send(JSON.stringify(book[0].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get the book list available in the shop
public_users.get('/get_async', async function (req, res) {

  let filterBooks = new Promise((resolve, reject) => {
    resolve(Object.values(books))
  });

  let filteredBooks = await filterBooks;
  
  if (filteredBooks.length > 0) {
    res.send(JSON.stringify(filteredBooks, null, 4));
  } else {
    return res.status(404).json({ message: "Books not found" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn_async/:isbn', async function (req, res) {

  const isbn = req.params.isbn;

  let filterBooks = new Promise((resolve, reject) => {

    let filteredBooks = Object.values(books).filter((book) => book.isbn === isbn);

    resolve(filteredBooks)
  });

  let filteredBooks = await filterBooks;

  if (filteredBooks.length > 0) {
    res.send(JSON.stringify(filteredBooks, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
 });
  
// Get book details based on author
public_users.get('/author_async/:author', async function (req, res) {

  const author = req.params.author;

  let filterBooks = new Promise((resolve, reject) => {

    let filteredBooks = Object.values(books).filter((book) => book.author === author);

    resolve(filteredBooks)
  });

  let filteredBooks = await filterBooks;

  if (filteredBooks.length > 0) {
    res.send(JSON.stringify(filteredBooks, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get all books based on title
public_users.get('/title_async/:title', async function (req, res) {

  const title = req.params.title;

  let filterBooks = new Promise((resolve, reject) => {

    let filteredBooks = Object.values(books).filter((book) => book.title === title);
    
    resolve(filteredBooks)
  });

  let filteredBooks = await filterBooks;

  if (filteredBooks.length > 0) {
    res.send(JSON.stringify(filteredBooks, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});


module.exports.general = public_users;
