import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Cheli from 'App/Models/Cheli'

export default class extends BaseSeeder {
  public async run() {
    const uniqueKey = 'title'

    await Cheli.updateOrCreateMany(uniqueKey, [
      {
        title: 'Do 5 pushups',
        description: 'In order to complete the challenge you must do 5 pushups',
        icon: '💪',
        color: '#7B5EFF',
      },
      {
        title: 'Give a compliment to a stranger',
        description: 'You have to give a compliment to a random person on the street',
        icon: '👋',
        color: '#FF7DB8',
      },
      {
        title: 'Make 5K steps',
        description: 'Try to make 5K steps today. You can do it! We believe in you!',
        icon: '🚶',
        color: '#FFB800',
      },
      {
        title: 'Make somebody laugh',
        description:
          'You have to make somebody laugh. It can be a friend, a family member or a stranger',
        icon: '😂',
        color: '#FF7DB8',
      },
      {
        title: 'Write a haiku',
        description: 'You have to write a haiku. It can be about anything you want',
        icon: '📝',
        color: '#FFB800',
      },
      {
        title: 'Learn words of a song',
        description: 'You have to learn the words of a song. It can be any song you want',
        icon: '🎤',
        color: '#7B5EFF',
      },
      {
        title: 'Hum your favorite melody in public for 2 minutes',
        description: 'You have to hum your favorite melody in public for 2 minutes',
        icon: '🎵',
        color: '#7B5EFF',
      },
      {
        title: 'Dance in public for 10 seconds',
        description: 'You have to dance in public for 10 seconds. It can be any dance you want',
        icon: '💃',
        color: '#FFB800',
      },
      {
        title: 'Do 10 squats',
        description: 'You have to do 10 squats. It can be any type of squats you want',
        icon: '🏋️‍️',
        color: '#FFB800',
      },
      {
        title: 'Read an article about something you are interested in',
        description:
          'Search about a topic and read something about it. It can be anything you want',
        icon: '📚',
        color: '#FFB800',
      },
    ])
  }
}
