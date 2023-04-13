const express = require('express')

// Initialize express app
const app = express()

// Parse json request body
app.use(express.json())

// Export it so index.js can use it to start the server
module.exports = app
