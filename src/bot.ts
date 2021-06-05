import {Client, Message} from "discord.js";
import {Phone} from "./phone";

export class Bot {
    private client: Client
    private readonly token: string
    private phone: Phone

    constructor(client: Client, token: string) {
        this.client = client
        this.token = token
        this.phone = new Phone()
    }

    public listen(): Promise<string> {
        this.client.on('message', (message: Message) => {
            if (message.author.bot) return
            console.log(`${message.member.nickname}: ${message.content}`)

            if (message.content.startsWith(process.env.BOT_PREFIX)) {
                let msg = message.content.substring(process.env.BOT_PREFIX.length)
                let params = msg.split(' ')
                let cmd = params.shift()

                switch (cmd) {
                    case 'call':
                        this.phone.openConnection(message.channel)
                        break
                    case 'hangup':
                        this.phone.closeConnection(message.channel)
                        break
                }
            }
            else {
                this.phone.sendMessage(this.client, message)
            }
        })

        return this.client.login(this.token)
    }
}
