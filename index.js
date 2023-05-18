const { TextChannel, WebhookClient } = require(`discord.js`);
const bfj = require(`bfj`);

class TranscriptMessages extends TextChannel {
	constructor(options) {
		super(options)
	}

	/**
	 * Makes a transcript.
	 * @returns string A JSON string with all the messages
	 * @async
	 */
	async transcript() {
		try {
			const messagesArray = await this.messages.fetch({
				limit: 100,
			})
			const json = await bfj.stringify(messagesArray)
			return json;
		} catch (e) {
			console.log(`[TranscriptMessages] Error while transcripting ${e}`)
		}
	}

	/**
	 * Imports a transcript into a channel (recreates all conversation).
	 * @param {string} transcript The JSON string returned by transcript()
	 * @param {WebhookClient?} webhookClient A webhook client of the channel
	 * @async
	 */
	async importTranscript(transcript, webhookClient) {
		let client = webhookClient
		const decode = JSON.parse(transcript);
		let usersCache = {};

		if (!webhookClient)
			client = this.createWebhook({ name: "TranscriptWebhook", reason: "Transcript messages." })

		for (var msg of decode) {
			if (!usersCache[msg.authorID]) usersCache[msg.authorID] = await this.client.users.fetch(msg.authorID).catch(reject || callback);

			await client.send(msg.content || `Empty.`, {
				username: usersCache[msg.authorID].username || `Non-registered`,
				avatarURL: usersCache[msg.authorID].avatar ? `https://cdn.discordapp.com/avatars/${msg.authorID}/${usersCache[msg.authorID].avatar}.webp` : `https://cdn.discordapp.com/embed/avatars/${(usersCache[msg.authorID].discriminator || 5) % 5}.png`,
				attachments: msg.attachments || [],
			}).catch((e) => console.log(`[TranscriptMessages] Error ocurred while trying to import messages: ${e}`));
		}
	}
}

module.exports = TranscriptMessages