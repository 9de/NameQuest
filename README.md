# NameQuest

Your ultimate companion for tracking Minecraft username histories across LabyMod, Badlion, and Crafty.gg

## Features

- 🔍 Track username history from multiple sources
- ⚡ Fast and reliable responses
- 🎮 Support for LabyMod, Badlion, and Crafty.gg
- 🤖 Easy-to-use Discord slash commands
- 🎨 Beautiful embed responses

## Prerequisites

- Node.js 16.9.0 or higher
- Discord Bot Token
- Discord Server with slash command permissions

## Installation

1. Clone the repository
```bash
git clone https://github.com/9de/NameQuest.git
cd NameQuest
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Discord bot token:
```env
TOKEN=your_discord_bot_token_here
```

4. Deploy slash commands
```bash
npm run deploy
```

5. Start the bot
```bash
npm start
```

For development:
```bash
npm run dev
```

## Commands

- `/namehistory <username> [service]` - Get a player's username history
- `/ping` - Check bot's latency

## Services Supported

- LabyMod
- Badlion
- Crafty.gg

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any problems or have suggestions, please [open an issue](https://github.com/TurkiPro/NameQuest/issues).

## Author

**Turki** - [GitHub](https://github.com/TurkiPro)
