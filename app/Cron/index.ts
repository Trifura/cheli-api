import cron from 'node-cron'
import UserAppendCheliHandler from 'App/Cron/Handlers/UserAppendCheliHandler'
import Env from '@ioc:Adonis/Core/Env'

cron.schedule(
  Env.get('CHELI_APPEND_SCHEDULE'),
  async () => {
    console.log("CHILI'S APPENDED")
    void new UserAppendCheliHandler().run()
  },
  {
    scheduled: true,
    timezone: 'Europe/Belgrade',
  }
)
