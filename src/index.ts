import * as dotenv from 'dotenv'
dotenv.config() // Load the environment variables before app.js

import app from './app'

const port = process.env.PORT

// Start the express server and listen on the port specified in the .env file
app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
