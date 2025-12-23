# MindHack - Mental Health Training & Support Platform

A web application for mental health training and AI-powered emotional support. Practice helping skills through realistic simulations or chat with supportive AI companions anytime.

## Features

### Training Mode
Practice empathetic conversations with AI personas representing various mental health scenarios:
- **Realistic AI Personas**: Depression, Anxiety, Burnout, Grief, Self-Esteem, Relationships, Crisis
- **Skill Progression**: 10 levels from "Beginner Helper" to "Master Supporter"
- **Empathy Scoring**: AI evaluates your responses and provides feedback
- **XP & Badges**: Earn experience points and unlock achievements
- **Progress Tracking**: Track sessions, streaks, and growth over time

### Support Mode
24/7 AI companions for emotional support:
- **Emma** - Empathetic Listener (depression, loneliness)
- **Marcus** - Anxiety Specialist (worry, overthinking, panic)
- **Jordan** - Burnout Coach (stress, exhaustion, work-life balance)
- **Sofia** - Grief Companion (loss, bereavement)
- **Alex** - Relationship Guide (relationships, communication)
- **Casey** - Self-Esteem Coach (confidence, self-worth)

### Crisis Resources
- Global crisis hotline directory (100+ countries)
- Immediate emergency numbers
- Safety planning tools
- Professional resource links

### Additional Features
- **Dark Mode**: Full dark theme support
- **Panic Mode**: Quick-hide feature for privacy
- **Responsive Design**: Works on mobile and desktop
- **Markdown Support**: Rich text in messages
- **Local Progress Storage**: Your data stays on your device

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, React, TypeScript, Tailwind CSS |
| **Backend** | Express.js, TypeScript |
| **AI** | Minimax API (LLM for responses and scoring) |
| **Styling** | Tailwind CSS, Lucide Icons |

## Project Structure

```
mindhack/
├── packages/
│   ├── web/                    # Next.js frontend
│   │   └── src/
│   │       ├── app/            # App pages (App Router)
│   │       │   ├── training/   # Training mode
│   │       │   ├── support/    # Support mode
│   │       │   ├── crisis/     # Crisis resources
│   │       │   ├── resources/  # Mental health articles
│   │       │   ├── how-it-works/
│   │       │   ├── privacy-policy/
│   │       │   ├── terms-of-service/
│   │       │   └── disclaimer/
│   │       ├── components/     # Reusable UI components
│   │       ├── context/        # React contexts (theme)
│   │       └── hooks/          # Custom React hooks
│   │
│   ├── backend/                # Express API server
│   │   └── src/
│   │       ├── routes/         # API endpoints
│   │       ├── services/       # Business logic
│   │       └── middleware/     # Express middleware
│   │
│   ├── mobile/                 # React Native (planned)
│   └── shared/                 # Shared TypeScript types
│
├── .env.example                # Environment variables template
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/flexonb/mindhack.git
cd mindhack
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp packages/backend/.env.example packages/backend/.env
# Edit .env with your API keys
```

4. Start development servers:

**Backend (Terminal 1):**
```bash
cd packages/backend
npm run dev
```

**Web (Terminal 2):**
```bash
cd packages/web
npm run dev
```

5. Open http://localhost:3000 in your browser

### Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Backend server port (default: 4000) |
| `MINIMAX_API_KEY` | API key for Minimax LLM |
| `MINIMAX_BASE_URL` | Minimax API endpoint |

## API Endpoints

### AI Chat
- `POST /api/ai/chat` - Send message to companion/persona
- `GET /api/ai/support/companions` - Get available companions
- `GET /api/ai/training/personas` - Get training personas

## How It Works

### Training Mode Flow
1. Choose a persona (e.g., someone experiencing anxiety)
2. Practice empathetic responses in chat
3. AI evaluates your responses with a score
4. Earn XP and track your progress

### Support Mode Flow
1. Select a companion that matches your needs
2. Start chatting about what's on your mind
3. Receive empathetic, supportive responses
4. Access crisis resources if needed

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with feature overview |
| `/training` | Training mode with personas |
| `/training/chat` | Chat interface for training |
| `/support` | Support companions selection |
| `/support/chat` | Chat with AI companion |
| `/crisis` | Global crisis hotlines |
| `/resources` | Mental health articles |
| `/how-it-works` | Step-by-step guide |
| `/privacy-policy` | Privacy policy |
| `/terms-of-service` | Terms of service |
| `/disclaimer` | Medical disclaimer |

## Security

- **API Keys**: Stored in `.env` (never committed)
- **Local Storage**: Progress stored locally on your device
- **No Sensitive Data**: No personal data collected or transmitted
- **HTTPS**: Use HTTPS in production

## Disclaimer

MindHack is an educational tool and NOT a substitute for professional mental health care. If you're experiencing a mental health crisis:
- Call 988 (US) or your local emergency number
- Go to your nearest emergency room
- Contact a crisis hotline

## License

MIT License - See LICENSE file for details.

---

Built with care for mental health awareness and support 💙
