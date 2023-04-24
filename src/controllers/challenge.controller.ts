import Prisma from '@prisma/client'
import { Response } from 'express'
import { v4 as uuidv4 } from 'uuid'

// This is a workaround because of the way the Prisma client is exported
// import { PrismaClient } from '@prisma/client' doesn't work
const { PrismaClient } = Prisma
const prisma = new PrismaClient()

async function assignChallenge() {
	try {
		const userId = 2

		const usedChallenges = await prisma.userChallenges.findMany({
			where: {
				userId,
			},
		})

		const usedChallengeIds = usedChallenges.map(
			(usedChallenge) => usedChallenge.challengeId
		)

		const availableChallenges = await prisma.challenge.findMany({
			where: {
				id: { notIn: usedChallengeIds },
			},
		})

		const randomIndex = Math.floor(
			Math.random() * availableChallenges.length
		)
		const randomChallenge = availableChallenges[randomIndex]

		if (!randomChallenge) {
			return new Error('No challenges available')
		}

		const data = {
			uuid: uuidv4(),
			userId,
			challengeId: randomChallenge.id,
		}

		const assignedChallenge = await prisma.userChallenges.create({ data })
		if (!assignedChallenge) {
			return new Error('Error assigning challenge')
		}

		return assignedChallenge
	} catch (err) {
		return err
	}
}

async function getChallenge(req: any, res: Response) {
	try {
		const { userId } = req

		const userChallenge = await prisma.userChallenges.findMany({
			where: { userId: Number(userId) },
			take: -1,
		})

		if (!userChallenge.length) {
			const assignedChallenge = await assignChallenge()
			res.status(200).json(assignedChallenge)
			return
		}

		res.status(200).json(userChallenge[0])
	} catch (err) {
		res.status(500).send('Error getting challenge')
	}
}

export default { getChallenge, assignChallenge }
