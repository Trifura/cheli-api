const express = require('express')
const treblle = require('@treblle/express')
const mysql = require('mysql2')

// TODO: Check if MySQL works, this logic will be moved to a separate file later on
const connection = mysql.createConnection({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
})

connection.connect()

// Initialize express app
const app = express()

// Parse json request body
app.use(express.json())

// Pass treblle middleware to express app
app.use(treblle())

app.get('/', (req, res) => {
	// TODO: Used just for testing, will be removed later on
	connection.query('SELECT 1 + 1 AS solution', (err) => {
		if (err) throw err

		console.log('proslo')
	})
	res.json({ test: 'test' })
})

// Export it so index.js can use it to start the server
module.exports = app
