# 🌳 TreeBio

TreeBio is a **link-in-bio platform** inspired by Linktree that helps creators, professionals, and businesses share all their important links in one place.  
Built to be simple, customizable, and powerful — TreeBio makes it easy to manage your digital presence from a single bio link.  

🔗 Live Demo: [tree-bio.vercel.app](https://tree-bio.vercel.app/)  
👤 My TreeBio: [tree-bio.vercel.app/harshdebug](https://tree-bio.vercel.app/harshdebug)  

---

## ✨ Features

- 🔗 **Add multiple links** — Socials, websites, or custom links, all in one place  
- 📊 **Analytics dashboard** — Track profile views, link clicks & top-performing links  
- 📱 **Live preview editor** — Instantly see how your profile looks while editing  
- 📌 **QR code generator** — Share your TreeBio via a scannable QR code  
- 🎨 **Clean UI** — Minimal, modern, and mobile-friendly design  

---

## 🛠 Tech Stack

- **Framework:** Next.js (React)  
- **Styling:** Tailwind CSS, shadcn/ui  
- **Database:** PostgreSQL (hosted on [Neon](https://neon.tech))  
- **ORM:** Prisma  
- **Authentication:** Clerk  
- **Deployment:** Vercel  

---

## 🚀 Getting Started

Follow these steps to run TreeBio locally:

### 1️⃣ Clone the repo
```bash
git clone https://github.com/harshh-debug/tree-bio.git
cd tree-bio

```

**Install dependencies**
```
npm install
```

3️⃣ Set up environment variables

Create a .env file in the root and add the following (update with your own keys):
```
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://<username>:<password>@<host>/<database>?sslmode=require"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key

# Clerk Routes
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
```

4️⃣ Prisma setup

Generate Prisma client:
```
npx prisma generate
```

Run migrations:
```
npx prisma migrate dev
```

5️⃣ Run the app
```
npm run dev
```

The app will be live at http://localhost:3000
.
