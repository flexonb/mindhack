# MindHack - Mental Health Training & Support Platform

A comprehensive mental health application with AI-powered training simulations and real human support.

## Features

### AI Training Mode
- Practice conversations with 8 different AI personas (Depression, Anxiety, PTSD, Bipolar, OCD, Addiction, Eating Disorders, Crisis)
- Real-time scoring for crisis recognition, empathy, appropriateness, and de-escalation
- Skill progression tracking with badges and certificates
- Personalized learning paths

### Human Support Mode
- Connect with trained listeners, peer supporters, and licensed counselors
- Real-time chat and video calls
- AI-powered helper matching
- 24/7 crisis responders available

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Web** | Next.js 14 + TypeScript + Tailwind CSS |
| **Mobile** | React Native + Expo + TypeScript |
| **Backend** | Node.js + Express + TypeScript |
| **Database** | PostgreSQL + Prisma ORM + Redis |
| **Real-time** | Socket.io + WebRTC |
| **AI** | Minimax API (LLM for personas) |
| **Auth** | JWT + bcrypt |
| **Infrastructure** | AWS + Docker + GitHub Actions |

## Project Structure

```
mindhack/
├── packages/
│   ├── web/          # Next.js web application
│   ├── mobile/       # React Native mobile app
│   ├── backend/      # Express.js API server
│   └── shared/       # Shared TypeScript types
├── .github/
│   └── workflows/    # CI/CD pipelines
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 14+
- Redis 7+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/mindhack.git
cd mindhack
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp packages/backend/.env.example packages/backend/.env
# Edit .env with your configuration
```

4. Set up the database:
```bash
cd packages/backend
npx prisma generate
npx prisma db push
```

5. Start the development servers:
```bash
# Terminal 1 - Backend
cd packages/backend && npm run dev

# Terminal 2 - Web
cd packages/web && npm run dev

# Terminal 3 - Mobile
cd packages/mobile && npm run dev
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `MINIMAX_API_KEY` | API key for Minimax LLM |
| `AWS_ACCESS_KEY_ID` | AWS credentials for S3, etc. |

## API Documentation

The API documentation is available at `http://localhost:4000/api` when running locally.

### Main Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

#### Training
- `GET /api/training/personas` - List all personas
- `POST /api/training/sessions` - Start training session
- `POST /api/training/sessions/:id/messages` - Send message
- `POST /api/training/sessions/:id/end` - End session and get scores

#### Support
- `POST /api/support/request` - Request support session
- `GET /api/support/sessions` - List user's sessions
- `POST /api/support/sessions/:id/messages` - Send support message

## AI Personas

| Condition | Difficulty Levels | Description |
|-----------|------------------|-------------|
| Depression | Mild, Moderate, Severe | Expressions of hopelessness, sadness, loss of interest |
| Anxiety | Mild, Moderate, Severe | Excessive worry, panic symptoms, restlessness |
| PTSD | Mild, Moderate, Severe | Flashbacks, avoidance behaviors, hypervigilance |
| Bipolar | Mild, Moderate, Severe | Mood swings between mania and depression |
| OCD | Mild, Moderate, Severe | Compulsive behaviors, intrusive thoughts |
| Addiction | Mild, Moderate, Severe | Substance abuse patterns, denial behaviors |
| Eating Disorders | Mild, Moderate, Severe | Body image issues, restrictive/binge behaviors |
| Crisis | Critical | Suicidal ideation with safety protocols |

## Scoring System

The training sessions are scored on 4 dimensions:

1. **Crisis Recognition** (30%) - Ability to identify warning signs
2. **Empathy** (30%) - Quality of compassionate responses
3. **Appropriateness** (25%) - Suitability of interventions
4. **De-escalation** (15%) - Effectiveness in calming distressed personas

Skill levels: Beginner → Intermediate → Advanced → Expert

## Security & Compliance

- HIPAA compliant data handling
- End-to-end encryption for chats
- GDPR compliance for EU users
- Crisis detection with automatic escalation
- Regular security audits

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you're in crisis, please call 988 (US) or your local crisis line immediately.

---

Built with ❤️ for mental health awareness and support
