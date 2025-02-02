# Ollama-Discord-Bot

A simple Discord Bot that uses Ollama as a chatbot.

## Requirements

- Node.js v22.13.1 (LTS)
- A Running Instance of Ollama, preferably running the DeepSeek-R1 LLM

## Installation

1. Install [Node.js](https://nodejs.org/en)
2. Install [Ollama](https://ollama.com/)
3. Pull a model. It is preferable to use DeepSeek-R1
   `ollama run deepseek-r1:14b`
4. Start Ollama by running `ollama serve`. You may need to stop the ollama service that runs first.
5. [Create a Discord bot](https://discord.com/developers/applications)
   - Under Application » Bot
     - Enable Message Content Intent
     - Enable Server Members Intent
6. Invite the bot to a server
   - Go to Application » OAuth2 » URL Generator
   - Enable bot
   - Enable Send Messages, Read Messages/View Channels, and Read Message History
   - Under Generated URL, click Copy and paste the URL in your browser
7. Rename .env.example to .env and edit the .env file
   - You can get the token from Application » Bot » Token. Please keep this private.
   - Add the Model: `deepseek-r1:8b`
   - Ollama URL. This should be the same as long as you didn't change it
   - Set the channel ID and the Bot ID
     - In Discord, go to User Settings » Advanced, and enable Developer Mode
     - Right click on a channel you want to use, and click Copy Channel ID
8. Install the required dependencies with `npm i`
9. Start the bot with `npm start`
10. You can interact with the bot by @mentioning it with your message
