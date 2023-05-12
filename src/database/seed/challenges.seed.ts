import Prisma from '@prisma/client'
import { Challenge } from '../models/Challenge.model'
import { v4 as uuidv4 } from 'uuid'
import log from 'npmlog'

const { PrismaClient } = Prisma
const prisma = new PrismaClient()

const challenges: Challenge[] = [
	{
		uuid: uuidv4(),
		title: 'Do 5 pushups',
		description: 'In order to complete the challenge you must do 5 pushups',
		icon: '💪',
		color: '#7B5EFF',
	},
	{
		uuid: uuidv4(),
		title: 'Give a compliment to a stranger',
		description:
			'You have to give a compliment to a random person on the street',
		icon: '👋',
		color: '#FF7DB8',
	},
	{
		uuid: uuidv4(),
		title: 'Make 5K steps',
		description:
			'Try to make 5K steps today. You can do it! We believe in you!',
		icon: '🚶',
		color: '#FFB800',
	},
	{
		uuid: uuidv4(),
		title: 'Make somebody laugh',
		description:
			'You have to make somebody laugh. It can be a friend, a family member or a stranger',
		icon: '😂',
		color: '#FF7DB8',
	},
	{
		uuid: uuidv4(),
		title: 'Write a haiku',
		description:
			'You have to write a haiku. It can be about anything you want',
		icon: '📝',
		color: '#FFB800',
	},
	{
		uuid: uuidv4(),
		title: 'Learn words of a song',
		description:
			'You have to learn the words of a song. It can be any song you want',
		icon: '🎤',
		color: '#7B5EFF',
	},
	{
		uuid: uuidv4(),
		title: 'Hum your favorite melody in public for 2 minutes',
		description:
			'You have to hum your favorite melody in public for 2 minutes',
		icon: '🎵',
		color: '#7B5EFF',
	},
	{
		uuid: uuidv4(),
		title: 'Dance in public for 10 seconds',
		description:
			'You have to dance in public for 10 seconds. It can be any dance you want',
		icon: '💃',
		color: '#FFB800',
	},
	{
		uuid: uuidv4(),
		title: 'Do 10 squats',
		description:
			'You have to do 10 squats. It can be any type of squats you want',
		icon: '🏋️‍️',
		color: '#FFB800',
	},
	{
		uuid: uuidv4(),
		title: 'Read an article about something you are interested in',
		description:
			'Search about a topic and read something about it. It can be anything you want',
		icon: '📚',
		color: '#FFB800',
	},
]

const main = async () => {
	for (const challenge of challenges) {
		await prisma.challenge.upsert({
			where: { title: challenge.title },
			update: { ...challenge },
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
