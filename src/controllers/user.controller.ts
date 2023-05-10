import Prisma from '@prisma/client'
import { Response } from 'express'
import ChallengeController from './challenge.controller'
import { User, UserRelations } from '../database/models/User.model'
import {
	UserChallenge,
	UserChallengeRelations,
} from '../database/models/UserChallenge.model'
// This is a workaround because of the way the Prisma client is exported
// import { PrismaClient } from '@prisma/client' doesn't work
const { PrismaClient } = Prisma
const prisma = new PrismaClient()

async function getChallenge(req: any, res: Response) {
	try {
		const { userId } = req

		const userChallenge = await prisma.userChallenges.findMany({
			where: { userId },
			take: -1,
		})

		if (!userChallenge.length) {
			const assignedChallenge = await ChallengeController.assignChallenge(
				userId
			)
			console.log(assignedChallenge)
			res.status(200).json(assignedChallenge)
			return
		}

		res.status(200).json(userChallenge[0])
	} catch (err) {
		res.status(500).send('Error getting challenge')
	}
}

async function getFeed(req: any, res: Response) {
	try {
		const { userId } = req

		const userFollows = await prisma.follows.findMany({
			where: {
				followerId: userId,
			},
			select: {
				following: true,
			},
		})

		const followingUserIds = userFollows.map(
			(follow) => follow.following.uuid
		)

		const latestUserChallengesPromises = followingUserIds.map(
			async (followingUserId) => {
				return await prisma.userChallenges.findFirst({
					where: {
						userId: followingUserId,
					},
					include: UserChallengeRelations,
					orderBy: {
						createdAt: 'desc',
					},
				})
			}
		)

		const latestUserChallenges = await Promise.all(
			latestUserChallengesPromises
		)

		const filteredUserChallenges = latestUserChallenges.filter(
			(userChallenge) => userChallenge !== null
		)

		res.status(200).json(UserChallenge.cleanMany(filteredUserChallenges))
	} catch (err) {
		console.log(err)
		res.status(500).send('Error getting feed')
	}
}

async function followUser(req: any, res: Response) {
	try {
		const { userId } = req
		const { followId } = req.params

		const user = User.clean(
			await prisma.user.findUnique({
				where: {
					uuid: followId,
				},
				include: UserRelations,
			})
		)

		if (!user) {
			return res.status(404).send('User not found')
		}

		const { count: followExists } = await prisma.follows.deleteMany({
			where: {
				followerId: userId,
				followingId: followId,
			},
		})

		if (followExists) {
			return res.status(200).json({ ...user, isFollowed: false })
		}

		await prisma.follows.create({
			data: {
				followerId: userId,
				followingId: followId,
			},
		})

		res.status(200).json({ ...user, isFollowed: true })
	} catch (err) {
		console.log(err)
		res.status(500).send('Error following user')
	}
}

async function searchUsers(req: any, res: Response) {
	try {
		const { username } = req.query
		const { userId } = req

		const users = User.cleanMany(
			await prisma.user.findMany({
				take: username ? 10 : 4,
				where: {
					// Search is insensitive by default
					// https://www.prisma.io/docs/concepts/components/prisma-client/case-sensitivity#microsoft-sql-server-provider
					username: username ? { contains: username } : undefined,
					NOT: {
						uuid: userId,
					},
				},
				include: UserRelations,
			})
		)

		const checkedFollowingUsers = users.map((user) => {
			const isFollowed = user.followedBy.some(
				(followers) => followers.followerId === userId
			)
			return { ...user, isFollowed }
		})

		res.status(200).json(checkedFollowingUsers)
	} catch (err) {
		console.log(err)
		res.status(500).send('Error searching users')
	}
}

async function getUser(req: any, res: Response) {
	try {
		const { userId } = req

		const user = User.clean(
			await prisma.user.findUnique({
				where: {
					uuid: req.params.userId,
				},
				include: UserRelations,
			})
		)

		if (!user) {
			return res.status(404).send('User not found')
		}

		const isFollowed = user.followedBy.some(
			(followers) => followers.followerId === userId
		)

		res.status(200).json({ user, isFollowed })
	} catch (err) {
		console.log(err)
		res.status(500).send('Error getting user')
	}
}

export default { followUser, getFeed, getChallenge, searchUsers, getUser }
