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

// Cheli
// POST complete CheliPost

// User
// GET search
// POST follow/unfollow user
// POST accept follow
// GET home feed
// GET user profile
