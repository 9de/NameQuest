@echo off
echo Creating directory structure for NameQuest...

:: Create main source directory
mkdir src
cd src

:: Create commands directory and its subdirectories
mkdir commands
mkdir commands\minecraft
mkdir commands\utility

:: Create events directory
mkdir events

:: Create services directory and its subdirectories
mkdir services
mkdir services\minecraft

:: Create utils directory and its subdirectories
mkdir utils
mkdir utils\handlers

:: Create initial files
echo. > commands\minecraft\namehistory.js
echo. > commands\utility\ping.js
echo. > events\ready.js
echo. > events\interactionCreate.js
echo. > services\minecraft\labymod.js
echo. > services\minecraft\badlion.js
echo. > services\minecraft\craftygg.js
echo. > services\index.js
echo. > utils\handlers\CommandHandler.js
echo. > utils\handlers\EventHandler.js
echo. > utils\constants.js
echo. > index.js

cd ..

:: Create root files if they don't exist
if not exist .env echo. > .env
if not exist .gitignore echo. > .gitignore
if not exist package.json echo. > package.json
if not exist README.md echo. > README.md

echo Directory structure created successfully!
echo.
echo The following structure has been created:
echo.
echo namequest/
echo ├── src/
echo │   ├── commands/
echo │   │   ├── minecraft/
echo │   │   │   └── namehistory.js
echo │   │   └── utility/
echo │   │       └── ping.js
echo │   ├── events/
echo │   │   ├── ready.js
echo │   │   └── interactionCreate.js
echo │   ├── services/
echo │   │   ├── minecraft/
echo │   │   │   ├── labymod.js
echo │   │   │   ├── badlion.js
echo │   │   │   └── craftygg.js
echo │   │   └── index.js
echo │   ├── utils/
echo │   │   ├── handlers/
echo │   │   │   ├── CommandHandler.js
echo │   │   │   └── EventHandler.js
echo │   │   └── constants.js
echo │   └── index.js
echo ├── .env
echo ├── .gitignore
echo ├── package.json
echo └── README.md
echo.
echo Done! You can now start adding your code to these files.
pause