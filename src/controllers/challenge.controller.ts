import Prisma from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import { Response } from 'express'
import { UserChallenge } from '../database/models/UserChallenge.model'

// This is a workaround because of the way the Prisma client is exported
// import { PrismaClient } from '@prisma/client' doesn't work
const { PrismaClient } = Prisma
const prisma = new PrismaClient()

async function assignChallenge(userId: string) {
	try {
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
				uuid: { notIn: usedChallengeIds },
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
			challengeId: randomChallenge.uuid,
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

async function completeChallenge(req: any, res: Response) {
	try {
		const { userChallengeId } = req.params

		// TODO: check if it's the user's challenge
		const updatedChallenge = UserChallenge.clean(
			await prisma.userChallenges.update({
				where: {
					uuid: userChallengeId,
				},
				data: {
					finished: true,
				},
			})
		)

		res.status(200).json(updatedChallenge)
	} catch (err) {
		res.status(500).send('Error completing challenge')
	}
}

export default { assignChallenge, completeChallenge }
