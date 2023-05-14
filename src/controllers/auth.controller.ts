import Prisma from '@prisma/client'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { User, UserRelations } from '../database/models/User.model'

// This is a workaround because of the way the Prisma client is exported
// import { PrismaClient } from '@prisma/client' doesn't work
const { PrismaClient } = Prisma
const prisma = new PrismaClient()

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

async function register(req: Request, res: Response) {
	try {
		const { fullName, username, email, password } = req.body
		if (!username || !password) {
			return res.status(400).send('Username and password are required')
		}

		const userExists = await prisma.user.findUnique({
			where: {
				username: username,
			},
		})

		if (userExists) {
			return res.status(409).send('Username already exists')
		}

		const emailExists = await prisma.user.findUnique({
			where: {
				email: email,
			},
		})

		if (emailExists) {
			return res.status(409).send('Email already exists')
		}

		const uuid = uuidv4()

		const hashedPassword = await bcrypt.hash(password, 10)

		const data = {
			uuid,
			fullName,
			username,
			email,
			password: hashedPassword,
		}
		await prisma.user.create({ data })

		const token = jwt.sign({ uuid: uuid }, JWT_SECRET, {
			expiresIn: '7d',
		})
		res.status(200).json({ token })
	} catch (err) {
		console.log(err)
		res.status(500).send('Error registering user')
	}
}

async function login(req: Request, res: Response) {
	try {
		const { username, password } = req.body
		if (!username || !password) {
			return res.status(400).send('Username and password are required')
		}

		const user = await prisma.user.findUnique({
			where: {
				username: username,
			},
		})

		if (!user) {
			return res.status(404).send('User not found')
		}

		const validPassword = await bcrypt.compare(password, user.password)
		if (!validPassword) {
			return res.status(401).send('Invalid password')
		}

		const token = jwt.sign({ uuid: user.uuid }, JWT_SECRET, {
			expiresIn: '7d',
		})
		res.status(200).json({ token })
	} catch (err) {
		res.status(500).send('Error logging in')
	}
}

async function me(req: any, res: Response) {
	try {
		const { userId } = req
		const dirtyUser = await prisma.user.findUnique({
			where: {
				uuid: userId,
			},
			include: {
				following: {
					include: { following: true },
				},
				followedBy: {
					include: { follower: true },
				},
				UserChallenges: {
					include: { challenge: true },
					orderBy: { createdAt: 'desc' },
					skip: 1,
				},
			},
		})

		const user = User.clean(dirtyUser)

		if (!user) {
			return res.status(404).send('User not found')
		}

		res.status(200).json(user)
	} catch (err) {
		console.log(err)
		res.status(500).send('Error getting user')
	}
}

export default { register, login, me }
