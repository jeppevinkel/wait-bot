import {Channel, Client, DMChannel, Message, NewsChannel, TextChannel} from "discord.js";

export class Phone {
    public connections: Array<PhoneConnection> = Array<PhoneConnection>()
    public awaitingConnection: Array<TextChannel | DMChannel | NewsChannel> = Array<TextChannel | DMChannel | NewsChannel>()

    public openConnection(channel: TextChannel | DMChannel | NewsChannel) {
        let alreadyConnected: boolean = false

        if (this.connections.find(connection => connection.channels.includes(channel))) {
            alreadyConnected = true
        }

        if (this.awaitingConnection.includes(channel) || alreadyConnected) {
            channel.send('**Please hang up before opening a new connection!**')
            return
        }

        channel.send('**Opening connection...**')

        if (this.awaitingConnection.length) {
            let channel2 = this.awaitingConnection.pop()
            let phoneConnection = new PhoneConnection(channel2, channel)
            this.connections.push(phoneConnection)

            phoneConnection.channels[0].send('**Phone connection established!**')
            phoneConnection.channels[1].send('**Phone connection established!**')
        } else {
            this.awaitingConnection.push(channel)
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

        if (this.awaitingConnection.includes(channel)) {
            openConnection = true
            let index = this.awaitingConnection.indexOf(channel)

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

            distChannel.send(`**${message.author.username}**: ${message.content}`).catch(err => {
                console.log('Error: ', err)
            })
        }
    }
}


class PhoneConnection {
    channels: [TextChannel | DMChannel | NewsChannel, TextChannel | DMChannel | NewsChannel]

    constructor(channel1: TextChannel | DMChannel | NewsChannel, channel2: TextChannel | DMChannel | NewsChannel) {
        this.channels = [channel1, channel2]
    }

}
