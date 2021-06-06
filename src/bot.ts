import {Client, ClientOptions, Collection, Message, MessageEmbed, MessageEmbedOptions} from "discord.js";
import {CallType, Phone} from "./phone";
import {Command} from "./interfaces/Command";
import {promisify} from "util";
import * as fs from "fs";
import * as path from "path";
import {getFilesFromDir} from "./utils";
import {Event} from "./interfaces/Event";

export class Bot extends Client {
    public phone: Phone = new Phone()
    public commands: Collection<string, Command> = new Collection()
    public events: Collection<string, Event> = new Collection()
    public aliases: Collection<string, string> = new Collection()
    public categories: Set<string> = new Set()

    constructor(token: string, clientOptions?: ClientOptions) {
        super(clientOptions)
        this.token = token
    }

    public async listen(): Promise<string> {
        const commandFiles: string[] = await getFilesFromDir(path.resolve(__dirname, 'commands'), '.js')
        const eventFiles: string[] = await getFilesFromDir(path.resolve(__dirname, 'events'), '.js')

        commandFiles.map(async (path: string) => {
            const file: Command = await import(path)
            this.commands.set(file.name, file)
            this.events.set(file.name, file)
            this.categories.add(file.category.toLowerCase())
            console.log(file)
            if (file.aliases?.length) {
                file.aliases.map((alias: string) => this.aliases.set(alias, file.name))
            }
        })

        eventFiles.map(async (path: string) => {
            const file: Event = await import(path)
            this.events.set(file.name, file)
            this.on(file.name, file.execute.bind(null, this))
        })

        return this.login(this.token)
    }

    public embed(options: MessageEmbedOptions, message: Message): MessageEmbed {
        return new MessageEmbed({...options})
            .setFooter(message.author.tag, message.author.displayAvatarURL())
            .setTimestamp(new Date())
            .setColor('YELLOW')
    }
}
