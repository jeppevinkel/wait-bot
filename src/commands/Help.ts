import { Execute, Command } from "../interfaces/Command";
import {EmbedFieldData, Message, MessageEmbed} from "discord.js";

export const execute: Execute = async (client, message, args) => {
    if (args.length) {

        const cmd: Command = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]))
        if (cmd) {
            return await message.channel.send(client.embed({}, message)
                .setDescription(Object.entries(cmd)
                    .filter((val) => val[0] != 'execute')
                    .sort()
                    .map((value: [string, any]) => value[1]?.map
                        ? value[1].map(
                            (value2: unknown) =>
                                `${value[0][0].toUpperCase() + value[0].slice(1)}: \`${value2}\``)
                            .join(', ')
                        : `${value[0][0].toUpperCase() + value[0].slice(1)}: \`${value[1]}\``
                    )
                    .join('\n')
                )
                .setColor('GREY')
            )
        }

        const isCategory: boolean = client.categories.has(args[0].toLowerCase())
        if (isCategory) {
            let commands = client.commands.filter((cmd: Command) => cmd.category.toLowerCase() == args[0].toLowerCase())
            message.channel.send(client.embed({}, message)
                .addField(`${args[0][0].toUpperCase() + args[0].slice(1).toLowerCase()} [${commands.size}]`, commands.map((cmd: Command) => `\`${cmd.name}\``).join(', '))
                .setColor('GREY'))
        }
    }

    const fields: Array<EmbedFieldData> = [...client.categories].map((category: string) => {
        let commands = client.commands.filter((cmd: Command) => cmd.category.toLowerCase() == category.toLowerCase())
        return {
            name: `${category[0].toUpperCase() + category.slice(1).toLowerCase()} [${commands.size}]`,
            value: commands.map((cmd: Command) => `\`${cmd.name}\``).join(', ')
        }
    })
    const commandEmbed: MessageEmbed = client.embed({fields, description: `${client.commands.size}`}, message)
        .setColor('GREY')

    if (!args.length) return await message.channel.send(commandEmbed)
}

export const name: string = 'help'
export const aliases: string[] = [ 'h' ]
export const category: string = 'misc'
