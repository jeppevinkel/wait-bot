import {Execute} from "../../interfaces/Event";
import {Message} from "discord.js";
import {Command} from "../../interfaces/Command";

export const execute: Execute = async (client, message: Message) => {
    if (message.author.id != client.user.id) {
        client.phone.sendMessage(client, message)
    }

    if (message.author.bot || !message.guild || !message.content.startsWith(process.env.BOT_PREFIX)) return

    const args: string[] = message.content.substring(process.env.BOT_PREFIX.length).trim().split(' ')
    const cmd: string = args.shift()
    const command: Command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd))
    if (!command) return
    command.execute(client, message, args).catch((err: any) => message.channel.send(client.embed({description: `An error has occurred: ${err}`}, message)))
}

export const name: string = 'message'
