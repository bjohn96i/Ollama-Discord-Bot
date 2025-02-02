import dotenv from "dotenv";
import axios from "axios";
import { Logger, LogLevel } from "meklog";
import { Client, Events, GatewayIntentBits, Partials } from "discord.js";

dotenv.config();

const production =
  process.env.NODE_ENV == "prod" || process.env.NODE_ENV == "production";
const log = new Logger(production, "BOT");
let chatHistory = [];

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

function appendChatHistory(message) {
  chatHistory.push(message);
}

function purgeChatHistory() {
  log(LogLevel.Warning, "Purging Memory...");
  log(LogLevel.Warning, chatHistory);
  chatHistory = [];
}

async function makeRequest(method, path, data) {
  let config = {
    method: method,
    url: `${process.env.OLLAMA}${path}`,
    data: data,
  };
  return await axios(config)
    .then(function (response) {
      appendChatHistory(response.data.message);
      const reply = response.data.message.content.split(/<\/[^>]*>/);
      log(LogLevel.Info, `Thoughts: ${reply[0]}`);
      log(LogLevel.Info, `Response: ${reply[1]}`);
      return reply[1];
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
  if (msg.content.includes(`<@${process.env.BOTID}>`)) {
    log(LogLevel.Info, `Message Recieved: ${msg.content}`);

    if (msg.content.includes("/purge")) {
      purgeChatHistory();
      msg.reply("Memory Purged.");
    } else {
      appendChatHistory({
        role: "user",
        content: msg.content,
      });

      let data = JSON.stringify({
        model: process.env.MODEL,
        messages: chatHistory,
        stream: false,
      });
      let response = await makeRequest("post", "/api/chat", data);
      chunkResponse(response).forEach((chunk) => {
        msg.reply(chunk);
      });
    }
  }
});

client.login(process.env.TOKEN);
