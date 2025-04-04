import yaml from "js-yaml";
import axios from "axios";
import { Logger, LogLevel } from "meklog";
import { Events, cleanContent } from "discord.js";
import fs from "fs";
import path from "path";
import { chunkResponse } from "./modules/messageUtils.js";
import { createDiscordClient } from "./modules/discordClient.js";

// Load YAML config
const config = yaml.load(
  fs.readFileSync(path.join(process.cwd(), "config.yml"), "utf8")
);

const production =
  process.env.NODE_ENV == "prod" || process.env.NODE_ENV == "production";
const log = new Logger(production, "BOT");

const client = createDiscordClient();

async function makeRequest(method, path, data) {
  let ollama_config = {
    method: method,
    url: `${config.ollama.url}${path}`,
    data: {
      ...data,
    },
  };
  return await axios(ollama_config)
    .then(function (response) {
      const reply = response.data.message.content;
      log(LogLevel.Info, `Reply: ${reply}`);
      return reply;
    })
    .catch(function (error) {
      log(LogLevel.Fatal, error);
    });
}

client.on("ready", async () => {
  log(LogLevel.Info, `Logged in as ${client.user.tag}!`);
});

client.on(Events.MessageCreate, async (msg) => {
  log(LogLevel.Info, `Message Sent: ${msg.content}`);
  if (msg.mentions.has(client.user.id)) {
    let query = cleanContent(msg.content, msg);
    query = query.replace(`@${config.discord.bot_name}`, "");
    log(LogLevel.Info, `Message Recieved: ${msg.content}`);

    let data = {
      model: config.ollama.model,
      messages: [
        {
          role: "user",
          content: query,
        },
      ],
      stream: false,
    };
    let response = await makeRequest("post", "/api/chat", data);
    chunkResponse(response).forEach((chunk) => {
      msg.reply(chunk);
    });
  }
});

client.login(config.discord.token);
