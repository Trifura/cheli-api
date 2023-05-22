/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for the majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.post('/v2/auth/register', 'AuthController.register')
Route.post('/v2/auth/login', 'AuthController.login')
Route.get('/v2/auth/me', 'AuthController.me').middleware('auth')

Route.post('/v2/user/follow/accept/:followerId', 'UserFollowsController.acceptFollow').middleware(
  'auth'
)
Route.post('/v2/user/follow/:followingId', 'UserFollowsController.follow').middleware('auth')
Route.get('/v2/user/follow/notifications', 'UserFollowsController.getNotifications').middleware(
  'auth'
)

Route.get('/v2/user/search', 'UsersController.search').middleware('auth')
Route.get('/v2/user/home', 'UsersController.getHomeFeed').middleware('auth')
Route.get('/v2/user/:userId', 'UsersController.getProfile').middleware('auth')

// Cheli
// POST complete CheliPost

// User
// GET home feed
