require('dotenv').config()
const app = require('./app')

// Start the express server and listen on the port specified in the .env file
app.listen(process.env.PORT, () => {
	console.log(`Server listening on port ${process.env.PORT}`)
})
