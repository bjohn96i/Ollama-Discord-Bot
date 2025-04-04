import { Client, GatewayIntentBits, Partials } from "discord.js";

/**
 * Creates and configures a Discord client with the specified intents and settings
 * @returns {Client} Configured Discord client instance
 */
export function createDiscordClient() {
  return new Client({
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
}
