import express from 'express'
import authRoute from './auth.route'
import challengeRoute from './challenge.route'
import userRoute from './user.route'

const defaultRoutes = [
	{
		path: '/auth',
		route: authRoute,
	},
	{
		path: '/challenge',
		route: challengeRoute,
	},
	{
		path: '/user',
		route: userRoute,
	},
]

const router = express.Router()

defaultRoutes.forEach((route) => {
	router.use(route.path, route.route)
})

export default router
