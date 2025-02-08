import dotenv from "dotenv";
import axios from "axios";
import { Logger, LogLevel } from "meklog";
import {
  Client,
  Events,
  GatewayIntentBits,
  Partials,
  cleanContent,
} from "discord.js";

dotenv.config();

const production =
  process.env.NODE_ENV == "prod" || process.env.NODE_ENV == "production";
const log = new Logger(production, "BOT");
// let chatHistory = [];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  allowedMentions: { users: [], roles: [], repliedUser: false },
  partials: [Partials.Channel],
});

async function makeRequest(method, path, data) {
  let config = {
    method: method,
    url: `${process.env.OLLAMA}${path}`,
    data: data,
  };
  return await axios(config)
    .then(function (response) {
      const reply = response.data[0].output;
      log(LogLevel.Info, `Reply: ${reply}`);
      return reply;
    })
    .catch(function (error) {
      log(LogLevel.Fatal, error);
    });
}

function chunkResponse(msg) {
  return msg.match(/[\s\S]{1,2000}/g);
}

client.on("ready", async () => {
  log(LogLevel.Info, `Logged in as ${client.user.tag}!`);
});

client.on(Events.MessageCreate, async (msg) => {
  log(LogLevel.Info, `Message Sent: ${msg.content}`);
  if (msg.mentions.has(client.user.id)) {
    let query = cleanContent(msg.content, msg);
    query = query.replace(`@${process.env.BOTNAME}`, "");
    log(LogLevel.Info, `Message Recieved: ${msg.content}`);

    let data = {
      session_id: client.user.id,
      chatInput: query,
    };
    let response = await makeRequest("post", "/webhook/message", data);
    chunkResponse(response).forEach((chunk) => {
      msg.reply(chunk);
    });
  }
  // }
});

client.login(process.env.TOKEN);
