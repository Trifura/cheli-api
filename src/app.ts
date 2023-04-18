import express, { Express } from 'express'
import treblle from '@treblle/express'
import cors from 'cors'
import routes from './routes/v1'

// Initialize express app
const app: Express = express()

// Pass treblle middleware to express app
app.use(treblle())

// Parse json request body
app.use(express.json())

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }))

// enable cors
app.use(cors())
app.options('*', cors())

// v1 API routes
app.use('/v1', routes)

// Export it so index.ts can use it to start the server
export default app
