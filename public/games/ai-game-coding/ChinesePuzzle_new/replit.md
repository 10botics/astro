# Chengyu Game - Chinese Idiom Learning Game

## Overview

This is a web application for learning Chinese idioms (成语/chengyu) through an interactive guessing game. The app presents users with English clues and pinyin pronunciations, challenging them to guess the correct Chinese idiom. Built with vanilla HTML, CSS, and JavaScript for simplicity and direct browser compatibility.

## System Architecture

### Frontend Architecture
- **Technology**: Vanilla HTML5, CSS3, and JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Grid and Flexbox for layout
- **Fonts**: Google Fonts (Inter and Noto Sans SC for Chinese characters)
- **State Management**: Local browser storage (localStorage) for game persistence
- **No Build Process**: Direct browser execution without compilation

### Backend Architecture
- **Server**: Simple Node.js HTTP server for static file serving
- **File Structure**: All assets served directly from root directory
- **Data Storage**: Embedded JavaScript objects for idiom database
- **Session Management**: Client-side storage using localStorage

### Key Design Decisions
1. **Vanilla Web Technologies**: No frameworks or build tools for maximum simplicity and compatibility
2. **Client-Side Storage**: Game state persisted in browser localStorage
3. **Embedded Data**: Chinese idioms stored directly in JavaScript for offline functionality
4. **Responsive Design**: CSS media queries for mobile and desktop compatibility
5. **Progressive Enhancement**: Core functionality works without JavaScript libraries

## Key Components

### File Structure
- **index.html**: Main game interface with semantic HTML structure
- **styles.css**: Complete styling with responsive design and animations
- **script.js**: Game logic, state management, and user interactions
- **server.js**: Simple Node.js static file server

### Game Logic
- **Session Management**: Browser localStorage for persistent game sessions
- **Puzzle Selection**: Random idiom selection from embedded database
- **Scoring System**: Points based on correctness, hints used, and difficulty
- **Progress Tracking**: Round-based gameplay with 10 total rounds per session

### Data Layer
- **Embedded Database**: 10 Chinese idioms stored directly in JavaScript
- **Client Storage**: Game state and recent attempts saved in localStorage
- **No External Dependencies**: All data and logic contained within the application

## Data Flow

1. **Game Initialization**: Browser loads index.html, script.js initializes game state from localStorage
2. **Puzzle Delivery**: JavaScript selects random idiom from embedded database excluding completed ones
3. **Guess Submission**: Client-side validation and scoring with immediate feedback
4. **Progress Update**: Game state updated in localStorage with new score and completed idioms
5. **Game Completion**: Session marked complete when all 10 rounds finished

## Dependencies

### Runtime Dependencies
- **Node.js**: Only for the static file server (server.js)
- **Web Browser**: Modern browser with ES6+ support and localStorage

### External Resources
- **Google Fonts**: Inter and Noto Sans SC fonts loaded via CDN
- **SVG Icons**: Inline SVG icons for UI elements

## Deployment Strategy

### Development
- **Server**: `node server.js` starts simple HTTP server on port 3000/5000
- **No Build Process**: Files served directly without compilation
- **Live Editing**: Changes to HTML/CSS/JS are immediately available on refresh

### Production
- **Single Server**: Node.js HTTP server serves all static files
- **No Database**: All data embedded in JavaScript, no external database required
- **Deployment**: Copy all files and run `node server.js`

### File Serving
- **Static Assets**: All HTML, CSS, JS files served with appropriate MIME types
- **Error Handling**: Custom 404 and 500 error pages
- **Cache Headers**: Files served with cache control for performance

## Changelog

```
Changelog:
- July 04, 2025. Complete conversion to vanilla HTML/CSS/JavaScript
  - Removed React, TypeScript, and all framework dependencies
  - Replaced complex build system with simple Node.js static server
  - Converted UI components to pure HTML/CSS with custom styling
  - Migrated data storage from database to localStorage and embedded objects
  - Simplified architecture to 4 core files: index.html, styles.css, script.js, server.js
- July 03, 2025. Initial setup with React/Express architecture
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
``` 