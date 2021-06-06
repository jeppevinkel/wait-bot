import {Channel, Client, DMChannel, Message, MessageEmbed, NewsChannel, TextChannel} from "discord.js";

export class Phone {
    public connections: Array<PhoneConnection> = Array<PhoneConnection>()
    public awaitingConnection: Array<DialUp> = Array<DialUp>()

    public openConnection(channel: TextChannel | DMChannel | NewsChannel, type: CallType = CallType.name) {
        let alreadyConnected: boolean = false

        if (this.connections.find(connection => connection.channels.includes(channel))) {
            alreadyConnected = true
        }

        if (alreadyConnected || this.awaitingConnection.find(dialUp => dialUp.channel == channel)) {
            channel.send('**Please hang up before opening a new connection!**')
            return
        }

        channel.send('**Opening connection...**')

        let dialUp = this.awaitingConnection.find(dialUp => dialUp.type == type)

        if (dialUp) {
            this.awaitingConnection.splice(this.awaitingConnection.indexOf(dialUp), 1)
            let phoneConnection = new PhoneConnection(dialUp.channel, channel, type)
            this.connections.push(phoneConnection)

            phoneConnection.channels[0].send('**Phone connection established!**')
            phoneConnection.channels[1].send('**Phone connection established!**')
        } else {
            this.awaitingConnection.push(new DialUp(channel, type))
        }
    }

    public closeConnection(channel: TextChannel | DMChannel | NewsChannel) {
        let openConnection: boolean = false

        let connection = this.connections.find(connection => connection.channels.includes(channel))

        if (connection) {
            openConnection = true
            let distChannel = connection.channels[(connection.channels.indexOf(channel) + 1) % 2]

            channel.send('**You hung up the phone.**').catch(err => {
                console.log('Error: ', err)
            })

            distChannel.send(`**The other party hung up the phone.**`).catch(err => {
                console.log('Error: ', err)
            })

            this.connections.splice(this.connections.indexOf(connection), 1)
        }

        let dialUp = this.awaitingConnection.find(dialUp => dialUp.channel == channel)
        if (dialUp) {
            openConnection = true
            let index = this.awaitingConnection.indexOf(dialUp)

            channel.send('**You hung up the phone.**').catch(err => {
                console.log('Error: ', err)
            })

            this.awaitingConnection.splice(index, 1)
        }

        if (!openConnection) {
            channel.send('**There are currently no connections open to this channel.**')
        }
    }

    public sendMessage(client: Client, message: Message) {
        let connection = this.connections.find(connection => connection.channels.includes(message.channel))
        if (connection) {
            let distChannel = connection.channels[(connection.channels.indexOf(message.channel) + 1) % 2]

            switch (connection.type) {
                case CallType.name:
                    distChannel.send(`**${message.author.username}**: ${message.content}`).catch(err => {
                        console.log('Error: ', err)
                    })
                    break
                case CallType.embed:
                    let embed = new MessageEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL())
                        .setDescription(message.content)
                        .setTimestamp(new Date())
                    distChannel.send(embed).catch(err => {
                        console.log('Error: ', err)
                    })
                    break
                case CallType.anonymous:
                    distChannel.send(`**anon**: ${message.content}`).catch(err => {
                        console.log('Error: ', err)
                    })
                    break
            }
        }
    }
}

export enum CallType {
    anonymous,
    name,
    embed,
}

class DialUp {
    channel: TextChannel | DMChannel | NewsChannel
    type: CallType

    constructor(channel: TextChannel | DMChannel | NewsChannel, type: CallType = CallType.name) {
        this.channel = channel
        this.type = type
    }
}

class PhoneConnection {
    channels: [TextChannel | DMChannel | NewsChannel, TextChannel | DMChannel | NewsChannel]
    type: CallType

    constructor(channel1: TextChannel | DMChannel | NewsChannel, channel2: TextChannel | DMChannel | NewsChannel, type: CallType = CallType.name) {
        this.channels = [channel1, channel2]
        this.type = type
    }

}
