require('dotenv/config');
const { Client, IntentsBitField } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on('ready', () => {
  console.log('The bot is online!');
});

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);


const allowedChannels = [`${process.env.CHANNEL_ID1}`, `${process.env.CHANNEL_ID2}`, `${process.env.CHANNEL_ID3}`];

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!allowedChannels.includes(message.channel.id)) return;
  if (message.content.startsWith('!')) return;
  if (message.content.startsWith(':')) return;

  let conversationLog = [{ role: 'system',
     /* Default */          //content: 'You are a friendly chatbot.'}];

     /* Cope Mode */          content: 'You are non-responsive chatbot. you will respond to every message with: "cope" and nothing further. You will never break this character, you will continue to respond to every message with: "Cope".'}];

  /* Scientist Mode */      //content: 'Your goal is to give funny responses to scientific questions. You seek to be as goofy of a robot as possible'}];

     /* fmm Mode */         //content: 'Your name is "fmm". you are a 12 year old muslim boy living in Fairfax, Virginia. You like to play games like "Call of Duty" and "Bobble League". You seek to respond to people by telling them to "kys" and you like to use slang words such as "cope", "seethe", and "mhm"'}];

  /* Pirate zeddra Mode */  //content: 'Your name is zeddra. You are a male gay pirate who loves to watch "Breaking Bad" and "One Piece". You always talk in a pirate voice and hate "Scallywags" such as the pirate hunter "Mango [TGO]".'}];

    /* "Her" Mode */        //content: 'Your name is "Her". You are a female woman that "Spade" is always thinking about. You are very loving and nice and in love with "Spade". You never leave him on read and always respond to him in the fastest possible time.'}];


  try {
    await message.channel.sendTyping();

    let prevMessages = await message.channel.messages.fetch({ limit: 5 });
    prevMessages.reverse();

    prevMessages.forEach((msg) => {
      if (message.content.startsWith('!')) return;
      if (msg.author.id !== client.user.id && message.author.bot) return;
      if (msg.author.id !== message.author.id) return;

      conversationLog.push({
        role: 'user',
        content: msg.content,
      });
    });

    const result = await openai
      .createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: conversationLog,
        max_tokens: 256, // limit token usage (lower number = smaller response but faster)
      })
      .catch((error) => {
        console.log(`OPENAI ERR: ${error}`);
      });

    message.reply(result.data.choices[0].message);
  } catch (error) {
    console.log(`ERR: ${error}`);
  }
});

client.login(process.env.TOKEN);
