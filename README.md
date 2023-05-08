<div align="center">
	<br />
	<p>
		<i>Transcript</i><b>Messages</b>
	</p>
	<br />
	<p>
		<a href="https://discord.gg/djs"><img src="https://img.shields.io/discord/222078108977594368?color=5865F2&logo=discord&logoColor=white" alt="Discord server" /></a>
		<a href="https://www.npmjs.com/package/transcript-messages"><img src="https://img.shields.io/npm/v/transcript-messages.svg?maxAge=3600" alt="npm version" /></a>
		<a href="https://www.npmjs.com/package/transcript-messages"><img src="https://img.shields.io/npm/dt/transcript-messages.svg?maxAge=3600" alt="npm downloads" /></a>
		<a href="https://github.com/discordjs/transcript-messages/actions"><img src="https://github.com/discordjs/transcript-messages/workflows/Testing/badge.svg" alt="Tests status" /></a>
	</p>
</div>

## About

`transcript-messages` allows you to easily transcript and import transcripts of Discord Channels (specialized in tickets).

## Installation

**Discord.js v13 or above is needed.**

```sh-session
npm install transcript-messages
yarn add transcript-messages
pnpm add transcript-messages
```

## How to use

It's easy to use:

`index.js`

```js
const Discord = require(`discord.js`);
const TextChannel = require(`transcript-messages`);

Discord.TextChannel.prototype = TextChannel; // Replace Discord's TextChannel with the package's one

const client = new Discord.Client(...);
// ...

client.transcripts = new Discord.Collection(); // Make a temporary collection to save transcripts, you probably would want to use a DB instead
```

`transcript.js`

```js
const json = await interaction.channel.transcript(); // Remember, it's an async function!
interaction.client.transcripts.set(interaction.guild.id, json);
```

`loadTranscript.js`

```js
const webhook = interaction.channel.createWebhook(...);

await interaction.channel.importTranscript(
  interaction.client.transcripts.get(interaction.guild.id),
  webhook // ...or you can leave this alone and it will generate it but it will not handle errors
);
```
