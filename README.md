# Baatein

> _A quiet place to put your thoughts down._

Baatein is a minimalist journaling application designed to provide a calm, distraction-free space for personal reflection and writing. Built with modern web technologies, it emphasizes simplicity, elegance, and emotional resonance.

## ✨ Features

- **Minimalist Design** - Clean, neutral-to-emotion aesthetic with a dark theme
- **End-to-End Encryption (E2EE)** - Your journals are encrypted in the browser, ensuring absolute privacy
- **Secure Authentication** - Google OAuth integration via Supabase
- **Private Journaling** - Your thoughts, your space
- **Smooth Animations** - Subtle Framer Motion animations for enhanced UX
- **Responsive** - Beautiful on all devices

## 🔐 Security & Privacy

Baatein is built with security as a core principle. We use **End-to-End Encryption (E2EE)** to ensure that your thoughts remain private.

- **Client-Side Encryption**: All sensitive data is encrypted in your browser using the Web Crypto API.
- **No Access**: Not even the developers can read your journals.
- **Zero-Knowledge**: Your PIN is never sent to the server.

For a detailed technical explanation of our encryption strategy, read the [Encryption Architecture guide](./ENCRYPTION.md).

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database & Auth**: [Supabase](https://supabase.com)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **UI Components**: Custom component library with CVA (Class Variance Authority)
- **Icons**: [Lucide React](https://lucide.dev)

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd baatein
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env.local` and add your Supabase credentials:

   ```bash
   cp .env.example .env.local
   ```

   Update the following values in `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000 # or your production URL
   ```

   Get these values from your [Supabase Dashboard](https://supabase.com/dashboard/project/_/settings/api)

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Design Philosophy

Baatein follows a "Neutral to Emotion" design philosophy. See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for detailed information about the UI design, typography, color palette, and component system.

## 🗂️ Project Structure

```
baatein/
├── app/                    # Next.js app router pages
│   ├── journal/           # Journal-related pages
│   ├── login/             # Authentication pages
│   ├── globals.css        # Global styles and theme
│   └── layout.tsx         # Root layout
├── components/
│   ├── features/          # Feature-specific components
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/
│   ├── supabase/         # Supabase client configuration
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## 🔐 Authentication

Baatein uses Supabase for authentication with Google OAuth. The authentication flow:

1. User clicks "Start writing" on welcome screen
2. Redirected to Google OAuth
3. After successful auth, redirected to `/journal`
4. Session managed via Supabase SSR

## 🛠️ Development

**Available Scripts:**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📝 Contributing

This is a personal project, but feedback and suggestions are welcome!

## 📄 License

Private project. All rights reserved.

## 🙏 Acknowledgments

- Built with Next.js and Supabase
- Design inspired by minimalist journaling practices
- Typography: Nunito (body) and Outfit (headings) from Google Fonts
