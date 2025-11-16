# Claude.md - UNO Emulator Project Guide

## Project Overview
This is a UNO card game emulator implemented in Node.js. It simulates UNO gameplay with multiple players, handling card distribution, turns, special cards, and game rules.

## Architecture

### Technology Stack
- **Runtime**: Node.js (ES Modules)
- **Package Manager**: npm
- **Key Dependencies**:
  - Express (web framework)
  - module-alias (path aliasing)

### Project Structure
```
uno_emulator/
├── index.js              # Entry point - game initialization and execution
├── model/                # Core game models
│   ├── stage.js         # Game stage/field management
│   ├── player.js        # Player logic
│   ├── card.js          # Base card class
│   ├── num_card.js      # Number cards
│   ├── special_card.js  # Special cards (Skip, Reverse, Draw, etc.)
│   └── color.js         # Card color management
├── constants/           # Card creation and game constants
│   ├── card_creators.js
│   ├── special_card_creators.js
│   └── colors.js
├── package.json         # Project configuration
└── Dockerfile           # Docker configuration
```

### Module Aliases
Configured in `package.json`:
- `@model` → `./model`
- `@constants` → `./constants`

## Key Components

### Stage (model/stage.js)
The main game controller that manages:
- **Players**: Array of player objects, tracks current and finished players
- **Turn Management**: Turn counter, current player index, direction (normal/opposite)
- **Field State**: Cards in play, latest card
- **Game State**: Current color, number, draw count, skip count
- **Core Methods**:
  - `setUpField()`: Initialize game (shuffle, distribute cards, place first card)
  - `playTurn()`: Execute one turn of gameplay
  - `shouldEndField()`: Check if game should end
  - `getResult()`: Return game results

### Player (model/player.js)
Manages individual player state and actions:
- Card hand management
- Card selection and playing logic
- UNO declaration tracking

### Cards
- **Base Card**: Abstract card behavior
- **Num Card**: Number cards (0-9)
- **Special Card**: Action cards
  - Skip: Skip next player
  - Reverse: Reverse turn order
  - Draw: Force next player to draw cards
  - Wild: Change color

## Game Flow

1. **Setup** (`setUpField`):
   - Shuffle players
   - Distribute 7 cards to each player
   - Place first non-special card on field

2. **Turn Loop** (`playTurn`):
   - Display current game state
   - Handle draw penalty if active
   - Player attempts to play card(s)
   - If no valid card, draw and try again (double chance)
   - Check UNO rule violations (penalties)
   - Move to next player

3. **End Game** (`shouldEndField`):
   - Game ends when all but one player finish
   - Winner is first to finish, loser has remaining cards

## Game Rules Implemented

- **UNO Declaration**: Players must declare UNO when they have 1 card left (tracked via `isUno` flag)
- **Draw Stacking**: Draw cards accumulate until a player can't counter
- **Skip Stacking**: Multiple skip cards can stack
- **Reverse**: Changes turn direction (affects `isOpposite` flag)
- **Multiple Card Play**: Players can play multiple cards of the same value simultaneously
- **First Card Rule**: First card cannot be a special card

## Development

### Running the Project
```bash
npm start  # Runs: node -r module-alias/register index.js
```

### Docker Support
Project includes Dockerfile and docker-compose.yml for containerized execution.

### Code Conventions
- ES6+ syntax with ES Modules (`import`/`export`)
- Class-based architecture for models
- Console logging for game state debugging
- Functional array methods (map, filter, etc.)

## Recent Changes
- Feature: Multiple card play support (PR #3)
- Changed: Each card's step changed to skip mechanism
- Added: Docker environment setup

## Important Notes

1. **Game State**: The `Stage` class is the single source of truth for all game state
2. **Card Creators**: Cards are randomly created using factory functions in `constants/card_creators.js`
3. **Player Strategy**: Player logic determines which cards to play (can be extended for different strategies)
4. **Turn Direction**: The `isOpposite` flag controls whether turns go clockwise or counter-clockwise
5. **Draw Penalty**: `drawNum` accumulates when draw cards are played, must be handled or taken
6. **Skip Mechanism**: `skipNum` determines how many players to skip on next turn

## Future Considerations
- Add AI player strategies
- Implement scoring system
- Add web UI for gameplay visualization
- Support for house rules/variants
- Multiplayer network support
