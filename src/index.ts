import {Client, Message, Intents, ClientOptions} from 'discord.js'
import {Bot} from "./bot";
import * as dotenv from 'dotenv'

dotenv.config()

let bot = new Bot(new Client({intents: [Intents.FLAGS.GUILD_MESSAGES]} as ClientOptions), process.env.TOKEN)

bot.listen().then(() => {
    console.log('Connected!')
}).catch(err => {
    console.log('Error: ', err)
})
