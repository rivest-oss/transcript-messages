module.exports = function(requireObject) {
	const TextChannel = requireObject(`discord.js/src/structures/BaseGuildTextChannel.js`);
	
	class TranscriptMessages extends TextChannel {
		/**
		 * Makes a transcript.
		 * @returns string A JSON string with all the messages
		 * @async
		 */
		async transcript() {
			try {
				const messagesArray = await this.messages.fetch({
					limit: 100,
				});
				
				return JSON.stringify(messagesArray.toJSON());
			} catch (e) {
				console.error(`[TranscriptMessages] There was an error while transcribing the messages:`, e);
			}
		};
		
		/**
		 * Imports a transcript into a channel (recreates all conversation).
		 * @param {string} transcript - The JSON string returned by `<TextChannel>.transcript()`.
		 * @param {WebhookClient?} [webhookClient] - A webhook client of the channel.
		 * @async
		 */
		async importTranscript(transcript, webhookClient) {
			const messages = JSON.parse(transcript);
			
			if(!webhookClient) webhookClient = this.createWebhook({
				name: `TranscriptWebhook`,
				reason: `Transcript messages.`
			});
			
			for(var message of messages) {
				console.log("item");
				if(this.client.users.cache.has(message.authorId) === false) await this.client.users.fetch(message.authorId).catch(e => console.error(`[TranscriptMessages] There was an error while obtaining information from user ${message.authorId}:`, e));
				
				const user = this.client.users.cache.get(message.authorId) ?? { id: message.authorId, discriminator: 0, };
				
				console.log(`Item:`, user);
				
				await webhookClient.send({
					username: user.username ?? `????`,
					avatarURL: user.avatar
						? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`
						: `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`,
					content: message.content ?? `????`,
					attachments: message.attachments,
					embeds: message.embeds,
					components: message.components,
					stickers: message.stickers,
				}).catch(e => console.error(`[TranscriptMessages] There was an error while importing messages:`, e));
			}
		};
	};
	
	requireObject.cache[requireObject.resolve(`discord.js/src/structures/BaseGuildTextChannel.js`)].exports = TranscriptMessages;
};
