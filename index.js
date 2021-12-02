const { TextChannel, Structures } = require(`discord.js`);
var bfj = require(`bfj`);

class TranscriptMessages extends Structures.get(`TextChannel`) {
	transcript(callback) {
		var thi = this;
		if(!callback || typeof callback !== `function`) {
			return new Promise(async(resolve, reject) => {
				return doCode(this, resolve, reject);
			});
		} else {
			return doCode(this, callback);
		}

		async function doCode(this1, resolve, reject) {
			this1.messages.fetch({
				limit: 100,
			}).then(async messagesArray => {
				bfj.stringify(messagesArray).then(async json => {
					if(reject) {
						return resolve(json);
					} else {
						return resolve(null, json);
					}
				}).catch(async err => {
					if(reject) {
						return reject(err);
					} else {
						return resolve(err, null);
					}
				});
			}).catch(async err => {
				if(reject) {
					return reject(err);
				} else {
					return resolve(err, null);
				}
			});
		}
	}

	importTranscript(transcript, webhookClient, callback) {
		var thi = this;

		if(!callback || typeof callback !== `function`) {
			return new Promise(async(resolve, reject) => {
				if(!webhookClient) {
					this.createWebhook(`TranscriptWebhook`, {
						reason: `Importing transcript.`,
					}).then(async webhookClient => {
						return doCode(this, transcript, webhookClient, resolve, reject);
					}).catch(async err => {
						return reject(err);
					});
				} else {
					return doCode(this, transcript, webhookClient, resolve, reject);
				}
			});
		} else {
			if(!webhookClient) {
				this.createWebhook(`TranscriptWebhook`, {
					reason: `Importing transcript.`,
				}).then(async webhookClient => {
					return doCode(this, transcript, webhookClient, callback);
				}).catch(async err => {
					return callback(err, null);
				});
			} else {
				return doCode(this, transcript, webhookClient, callback);
			}
		}

		async function doCode(this1, transcript, webhookClient, resolve, reject) {
			var decode = JSON.parse(transcript);

			var lastID, usersCache = {}, data = {};
			for(var msg of decode) {
				if(!usersCache[msg.authorID]) usersCache[msg.authorID] = await this1.client.users.fetch(msg.authorID).catch(reject || callback);

				await webhookClient.send(msg.content || `Empty.`, {
					username: usersCache[msg.authorID].username || `Non-registered`,
					avatarURL: usersCache[msg.authorID].avatar ? `https://cdn.discordapp.com/avatars/${msg.authorID}/${usersCache[msg.authorID].avatar}.webp` : `https://cdn.discordapp.com/embed/avatars/${(usersCache[msg.authorID].discriminator || 5) % 5}.png`,
					attachments: msg.attachments || [],
				}).catch(reject || callback);
			}
		}
	}
}

Structures.extend(`TextChannel`, () => TranscriptMessages)
