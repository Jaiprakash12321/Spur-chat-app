# Spur Chat App

This is a full-stack AI chat application built with **Next.js**, **PostgreSQL**, **Prisma**

---

## What is this project?

Spur Chat is a real-time chat app where users can:
- Authenticate using OAuth
- Create multiple chats
- Send messages with instant (optimistic) UI updates
- Receive streamed AI responses

The app focuses on clean architecture, fast UX, and modern React patterns.

---

## Tech Stack

- **Next.js (App Router)**
- **NextAuth**
- **Prisma**
- **PostgreSQL (Docker)**
- **React Query**
- **Zustand**
- **Tailwind CSS**
- **Framer Motion**
- **LLMs via Gemini API**

---

## How to run locally ?

**1.Clone the repo**

```bash 
git clone https://github.com/Jaiprakash12321/Spur-chat-app
cd Spur-chat-app
```
**2. Install pnpm and then dependencies**

```bash 
npm i -g pnpm
```
```bash
pnpm install
```

**3. Run the server**

```bash
pnpm dev
```

**4. Create .env and add environment variables**

Refer .env.example

Keep DATABASE_URL as it is

**5. Start Database**

Pull postgres image

```bash
docker pull postgres
```
Run docker container

```bash
docker run --name postgres-ctr -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres

```
Run this command

```bash
pnpm dlx prisma migrate deploy
```

Run this command to open prisma studio

```bash
pnpm dlx prisma studio
```
Open [http://localhost:5555]

**6. Authentication**

Run this to generate a key

```bash
openssl rand -base64 32
```

Add the key to AUTH_SECRET env var

Go to [https://github.com/settings/apps] and create an OAuth app

GITHUB_CLIENT_ID=""  
GITHUB_CLIENT_SECRET=""  

(Optional. You can just login using Github)

Go to [https://console.cloud.google.com/] and create an OAuth app

GOOGLE_CLIENT_ID="" GOOGLE_CLIENT_SECRET=""

**7. Gemini API**

Go to [https://aistudio.google.com/] and create an API key

GEMINI_API_KEY="your_gemini_api_key"

GOOGLE_GENERATIVE_AI_API_KEY="your_gemini_api_key"









