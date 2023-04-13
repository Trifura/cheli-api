const express = require('express')
const treblle = require('@treblle/express')

// Initialize express app
const app = express()

// Parse json request body
app.use(express.json())

// Pass treblle middleware to express app
app.use(
	treblle({
		apiKey: process.env.TREBLLE_API_KEY,
		projectId: process.env.TREBLLE_PROJECT_ID,
		additionalFieldsToMask: [],
	})
)

app.get('/', (req, res) => {
	res.json({ test: 'Hello World!' })
})

// Export it so index.js can use it to start the server
module.exports = app
