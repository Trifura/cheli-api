import Prisma from '@prisma/client'
import { Challenge } from '../models/Challenge.interface'
import { v4 as uuidv4 } from 'uuid'

const { PrismaClient } = Prisma
const prisma = new PrismaClient()

const challenges: Challenge[] = [
	{
		uuid: uuidv4(),
		title: 'Do 5 pushups',
		description: 'In order to complete the challenge you must do 5 pushups',
	},
	{
		uuid: uuidv4(),
		title: 'Give a compliment to a stranger',
		description:
			'You have to give a compliment to a random person on the streets',
	},
]

const main = async () => {
	for (const challenge of challenges) {
		await prisma.challenge.upsert({
			where: { title: challenge.title },
			update: {},
			create: challenge,
		})
	}
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
