HNG13 Backend Stage 1 – String Analysis API

This is my backend Stage 1 task for HNG13, built with Node.js, Express, and MongoDB (hosted on Railway).

The API takes a string, analyzes it, and returns details like its length, word count, character frequency, hash, and whether it’s a palindrome.

What I Did (Step by Step)

Initialized Project

Ran npm init -y

Installed dependencies:

npm install express mongoose dotenv cors

Added nodemon for local development.

Setup Express Server

Created index.js file and added a simple / test route.

Confirmed server running on http://localhost:3000.

Connected MongoDB

Tried MongoDB Atlas but it was stuck on “Adding universal IP.”

Switched to Railway’s built-in MongoDB, updated .env:

MONGO_URI=mongdb<railway-uri>
PORT=3000


Created String Model

Defined a schema in models/StringModel.js:

const StringSchema = new mongoose.Schema({
  value: String,
  properties: Object,
  created_at: { type: Date, default: Date.now }
});


Built Core Endpoints

POST /strings – analyze and save a string

GET /strings – list all analyzed strings

GET /strings/:value – fetch a single string by value

Added logic for length, palindrome, word count, and hash using Node’s crypto.

Deployed to Railway

Pushed repo to GitHub

Linked repo to Railway

Deployed automatically from main branch

Verified working endpoint on live URL

https://hng-production-3067.up.railway.app/

Stack

Node.js

Express

MongoDB (Railway)

Mongoose

Dotenv

Author

Slack: @RidwanA

