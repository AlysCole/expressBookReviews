const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const { isbn } = req.params;
  
  const book = books[isbn];

  if (!book) return res.status(404).json({ message: "ISBN not found" });
  return res.send(JSON.stringify(book, null, 2));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const { author } = req.params;
  const keys = Object.keys(books);
  const matchedBooks = keys.filter((key) => books[key].author === author).map((key) => books[key]);

  if (!matchedBooks.length) return res.status(404).json({ message: "Author not found" });
  return res.send(JSON.stringify(matchedBooks, null, 2));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const { title } = req.params;
  const keys = Object.keys(books);
  const matchedBooks = keys.filter((key) => books[key].title === title).map((key) => books[key]);

  if (!matchedBooks.length) return res.status(404).json({ message: "Title not found" });
  return res.send(JSON.stringify(matchedBooks, null, 2));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const { isbn } = req.params;
  
  const book = books[isbn];

  if (!book) return res.status(404).json({ message: "ISBN not found" });
  return res.send(JSON.stringify(book.reviews, null, 2));
});

module.exports.general = public_users;
