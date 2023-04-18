import * as dotenv from 'dotenv'
import log from 'npmlog'

// Load the environment variables before app.js is loaded
dotenv.config()
import app from './app'

// Start the express server and listen on the port specified in the .env file
const port = process.env.PORT
app.listen(port, () => {
	log.info('SERVER', `Server is running at http://localhost:${port}`)
})
