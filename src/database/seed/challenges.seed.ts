import Prisma from '@prisma/client'
import { Challenge } from '../models/Challenge.interface'
import { v4 as uuidv4 } from 'uuid'
import log from 'npmlog'

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
		log.info('SEED', 'Successfully seeded challenges!')
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		log.error('SEED', e)
		await prisma.$disconnect()
		process.exit(1)
	})
