import express from 'express'
import authRoute from './auth.route'

const defaultRoutes = [
	{
		path: '/auth',
		route: authRoute,
	},
]

const router = express.Router()

defaultRoutes.forEach((route) => {
	router.use(route.path, route.route)
})

export default router
