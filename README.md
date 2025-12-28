# 🎮 Tech Battle - Computer Society Tournament System

<div align="center">

![Tech Battle](assets/images/cs%20tech%20battle-01.png)

**A pixel-styled, retro-gaming themed tournament system for tech competitions**

[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red.svg)](https://github.com/MahmoudEsawi/TechBattle2)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

</div>

---

## 🌟 Features

### 🏆 Tournament Bracket System
- **8-team knockout tournament** with Quarter Finals, Semi Finals, and Final
- **Drag & Drop** team placement
- **Random Draw** functionality
- **Mystery Teams** support (pre-assigned slots)
- **Victory Celebration** with confetti and animations
- **Persistent State** - saves progress in browser

### 🎯 Games

#### ❓ What Do You Know
Teams answer questions alternately. Get 3 strikes and lose the point!

| Key | Action |
|-----|--------|
| `A` | Strike Team A |
| `B` | Strike Team B |
| `N` | Next Question |
| `P` | Previous Question |
| `R` | Reset |

#### ⏱️ Timer
30-second countdown timer for timed challenges.

| Key | Action |
|-----|--------|
| `S` | Start Timer (30s) |
| `N` | Next Question |
| `P` | Previous Question |
| `R` | Reset |
| `X` | Wrong Answer Sound |

#### 🔔 Buzzer
Fast-paced buzzer game - first to buzz gets the point!

| Key | Action |
|-----|--------|
| `1` | +1 Point Team A |
| `2` | +1 Point Team B |
| `N` | Next Question |
| `P` | Previous Question |
| `R` | Reset Scores |

---

## 📁 Project Structure

```
Tech-Battle/
├── index.html                 # 🏠 Home Page
├── README.md
│
├── 📂 pages/                  # Game Pages
│   ├── GameSetup.html         # 🎮 Game & Match Selection
│   ├── WhatDoYouKnow.html     # ❓ WDYK Game
│   ├── timer.html             # ⏱️ Timer Game
│   ├── buzzer.html            # 🔔 Buzzer Game
│   └── tournament.html        # 🏆 Tournament Bracket
│
├── 📂 css/                    # Stylesheets
│   ├── style.css              # 🎨 Global Styles
│   ├── tournament.css         # Tournament Styles
│   ├── whatDoYouKnow.css      # WDYK Styles
│   ├── buzzer.css             # Buzzer Styles
│   └── gameSetup.css          # Setup Page Styles
│
├── 📂 js/                     # JavaScript
│   ├── script.js              # Timer Logic
│   ├── tournament.js          # Tournament Logic
│   ├── whatDoYouKnow.js       # WDYK Logic
│   └── buzzer.js              # Buzzer Logic
│
├── 📂 questions/              # 📝 Question Files (Editable!)
│   ├── match1-questions.js    # Quarter Final 1
│   ├── match2-questions.js    # Quarter Final 2
│   ├── match3-questions.js    # Quarter Final 3
│   ├── match4-questions.js    # Quarter Final 4
│   ├── match5-questions.js    # Semi Final 1
│   ├── match6-questions.js    # Semi Final 2
│   ├── match7-questions.js    # 🏆 Final
│   ├── buzzer-questions.js    # Buzzer Questions (Legacy)
│   ├── timer-questions.js     # Timer Questions (Legacy)
│   └── whatdoyouknow-questions.js  # WDYK Questions (Legacy)
│
├── 📂 assets/
│   ├── 📂 images/             # Images & Logos
│   └── 📂 sounds/             # Sound Effects
│
└── 📂 archive/                # Old/Unused Files
```

---

## 🚀 Quick Start

### Option 1: Local Server (Recommended)
```bash
# Navigate to project folder
cd Tech-Battle

# Start Python server
python3 -m http.server 8080

# Open in browser
open http://localhost:8080
```

### Option 2: VS Code Live Server
1. Install "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"

---

## 📝 Customizing Questions

Edit files in the `questions/` folder. Each match file contains questions for all 3 games:

```javascript
// questions/match1-questions.js

const MATCH_QUESTIONS = {
    // "What Do You Know" questions
    wdyk: [
        "Press N to start!",
        "Name a programming language",
        "Name a web browser"
    ],
    
    // Timer questions
    timer: [
        "🎯 Match 1 - Ready?",
        "اذكر 5 لغات برمجة",
        "اذكر 5 متصفحات"
    ],
    
    // Buzzer questions
    buzzer: [
        "🔔 Quarter Final 1 - Ready?",
        "What does CPU stand for?",
        "What is the capital of Jordan?"
    ]
};
```

---

## 🎨 Design System

### Fonts
- **Press Start 2P** - Pixel/Retro headings
- **VT323** - Terminal/Retro text

### Colors
| Color | Hex | Usage |
|-------|-----|-------|
| 🟠 Primary | `#FF6B00` | Main accent |
| 🔵 Secondary | `#00FFFF` | Highlights |
| 🟣 Accent | `#FF00FF` | Special elements |
| 🟢 Success | `#00FF00` | Winner/Correct |
| 🔴 Danger | `#FF0040` | Strikes/Wrong |

### Effects
- ✨ Neon glow shadows
- 📺 CRT scanlines
- 🌟 Twinkling stars background
- 🎮 Pixel-style borders

---

## 🎮 Tournament Flow

```
1. 🏠 Home Page
   └── 🏆 Tournament (Set up bracket)
       └── 🎲 Draw Teams
       
2. 🏠 Home Page
   └── 🎮 Play Game
       └── Select Game (WDYK / Timer / Buzzer)
           └── Select Round (QF / SF / Final)
               └── Select Match
                   └── ▶️ Start Game!
```

---

## 👨‍💻 Teams

Default teams configured:
- **AI** - Artificial Intelligence
- **CIS** - Computer Information Systems
- **CSD** - Computer Science Department
- **CS** - Computer Science
- **ISE** - Information Systems Engineering
- **CE** - Computer Engineering
- **Mystery 1** - TBD (Group A)
- **Mystery 2** - TBD (Group B)

---

## 🔧 Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full |
| Firefox | ✅ Full |
| Safari | ✅ Full |
| Edge | ✅ Full |

---

## 📜 License

Made with ❤️ by **Computer Society**

---

<div align="center">

### 🏆 Good Luck & Have Fun! 🎮

</div>
