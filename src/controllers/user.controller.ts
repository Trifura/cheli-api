import Prisma from '@prisma/client'
import { Response } from 'express'
import ChallengeController from './challenge.controller'

// This is a workaround because of the way the Prisma client is exported
// import { PrismaClient } from '@prisma/client' doesn't work
const { PrismaClient } = Prisma
const prisma = new PrismaClient()

async function getChallenge(req: any, res: Response) {
	try {
		const { userId } = req

		const userChallenge = await prisma.userChallenges.findMany({
			where: { userId: Number(userId) },
			take: -1,
		})

		if (!userChallenge.length) {
			const assignedChallenge = await ChallengeController.assignChallenge(
				userId
			)
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
			(follow) => follow.following.id
		)

		const latestUserChallengesPromises = followingUserIds.map(
			async (followingUserId) => {
				return await prisma.userChallenges.findFirst({
					where: {
						userId: followingUserId,
					},
					select: {
						user: {
							select: {
								id: true,
								username: true,
								fullName: true,
								email: true,
							},
						},
						challenge: true,
					},
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

		res.status(200).json(filteredUserChallenges)
	} catch (err) {
		res.status(500).send('Error getting feed')
	}
}

async function followUser(req: any, res: Response) {
	try {
		const { userId } = req
		const followId = Number(req.params.followId)

		const user = await prisma.user.findUnique({
			where: {
				id: followId,
			},
		})

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
			return res.status(200).json({ ...user, following: false })
		}

		await prisma.follows.create({
			data: {
				followerId: userId,
				followingId: followId,
			},
		})

		res.status(200).json({ ...user, following: true })
	} catch (err) {
		res.status(500).send('Error following user')
	}
}

async function searchUsers(req: any, res: Response) {
	try {
		const { username } = req.query
		const { userId } = req

		const users = await prisma.user.findMany({
			take: username ? 10 : 3,
			where: {
				// Search is insensitive by default
				// https://www.prisma.io/docs/concepts/components/prisma-client/case-sensitivity#microsoft-sql-server-provider
				username: username ? { contains: username } : undefined,
				NOT: {
					id: userId,
				},
			},
			select: {
				id: true,
				uuid: true,
				username: true,
				fullName: true,
				email: true,
				followedBy: {
					where: {
						followerId: userId,
					},
				},
			},
		})

		const usersWithFollowed = users.map((user) => {
			return {
				...user,
				following: user.followedBy.length > 0,
				followedBy: undefined,
			}
		})

		res.status(200).json(usersWithFollowed)
	} catch (err) {
		res.status(500).send('Error searching users')
	}
}

export default { followUser, getFeed, getChallenge, searchUsers }
