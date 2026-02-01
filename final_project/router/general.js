const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
const public_users = express.Router();


public_users.use(express.json());



// registering with username and password
public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  console.log(req.body)
  if(username && password){
    if(isValid(username)){
      users.push({username:username,password:password});
      return res.status(200).json({message: "User registered successfully"});
    }
    else{
      return res.status(400).json({message: "Username already exists"});
    }
  }else{
    return res.status(400).json({message: "Username or password not provided"});
  }


});

// get all the books with an async function
public_users.get('/', async function (req, res) {
  console.log('hello m here');
  axios.get('http://localhost:5000/books').then(
    (responseBooks)=>{
      return res.status(200).send(JSON.stringify(responseBooks.data,null , 4));
    }
  ).catch(e=>
    res.status(404).send("cant get books <br>  "+ e)
    )
});

// get the isbn with an aync function
public_users.get('/isbn/:isbn', async function (req, res) {
  let isbn = req.params.isbn;

  try {
    const response = await axios.get('http://localhost:5000/books');

    if (response.data[isbn]) {
      return res.status(200).send(JSON.stringify(response.data[isbn], null, 4));
    } else {
      return res.status(404).send("No book found with ISBN " + isbn);
    }
  } catch (error) {
    // Handle errors, e.g., network issues or API errors
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

// get the authors with an async function
public_users.get('/author/:author', async function (req, res) {
  let author = req.params.author;
  let booksByAuthor = [];

  try {
    // Assuming the API endpoint for getting all books is http://localhost:5000/books
    const response = await axios.get('http://localhost:5000/books');

    for (let isbn in response.data) {
      if (response.data[isbn].author == author) {
        booksByAuthor.push(response.data[isbn]);
      }
    }

    if (booksByAuthor.length > 0) {
      return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
    } else {
      return res.status(404).send("No book found with author " + author);
    }
  } catch (error) {
    // Handle errors, e.g., network issues or API errors
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

//  Get book title with async
public_users.get('/title/:title', async function (req, res) {
  let title = req.params.title;
  let booksByTitle = [];

  try {
    // Assuming the API endpoint for getting all books is http://localhost:5000/books
    const response = await axios.get('http://localhost:5000/books');

    for (let isbn in response.data) {
      if (response.data[isbn].title == title) {
        booksByTitle.push(response.data[isbn]);
      }
    }

    if (booksByTitle.length > 0) {
      return res.status(200).send(JSON.stringify(booksByTitle, null, 4));
    } else {
      return res.status(404).send("No book found with title " + title);
    }
  } catch (error) {
    // Handle errors, e.g., network issues or API errors
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

//  Get book review with the isbn
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if(books[isbn]){
    return res.status(200).send(JSON.stringify(books[isbn].reviews,null,4));
  }
  else{
    return res.status(404).send("No book found with ISBN "+isbn);
  }
});

module.exports.general = public_users;