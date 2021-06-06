import { Execute } from "../interfaces/Command";
import {Message, MessageEmbed} from "discord.js";

export const execute: Execute = async (client, message) => {
    let received = Date.now()
    const msg: Message = await message.channel.send(client.embed({description: 'Ping!'}, message))
    // let apiPing = (new Date()).getUTCMilliseconds() - msg.createdAt.getMilliseconds()
    // @ts-ignore
    await msg.edit(client.embed({}, message)
        .addField('Ping', received - message.createdTimestamp)
        .addField('API Ping', msg.createdTimestamp - message.createdTimestamp))
}

export const name: string = 'ping'
export const aliases: string[] = [ 'pong' ]
export const category: string = 'misc'
