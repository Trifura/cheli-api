import cron from 'node-cron'
import UserAppendCheliHandler from 'App/Cron/Handlers/UserAppendCheliHandler'

cron.schedule(
  '40 12 * * *',
  async () => {
    console.log('OKINULO')
    await new UserAppendCheliHandler().run()
  },
  {
    scheduled: true,
    timezone: 'Europe/Belgrade',
  }
)
