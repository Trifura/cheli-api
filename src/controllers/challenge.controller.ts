import Prisma from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

// This is a workaround because of the way the Prisma client is exported
// import { PrismaClient } from '@prisma/client' doesn't work
const { PrismaClient } = Prisma
const prisma = new PrismaClient()

async function assignChallenge(userId: number) {
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

export default { assignChallenge }
