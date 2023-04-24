import Prisma from '@prisma/client'
import { Response } from 'express'

// This is a workaround because of the way the Prisma client is exported
// import { PrismaClient } from '@prisma/client' doesn't work
const { PrismaClient } = Prisma
const prisma = new PrismaClient()

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

		const followExists = await prisma.follows.findFirst({
			where: {
				followerId: userId,
				followingId: followId,
			},
		})

		if (followExists) {
			return res.status(400).send('User already followed')
		}

		const follow = await prisma.follows.create({
			data: {
				followerId: userId,
				followingId: followId,
			},
		})

		res.status(200).json(follow)
	} catch (err) {
		res.status(500).send('Error following user')
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
export default { followUser, getFeed }
