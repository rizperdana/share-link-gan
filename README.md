<div align="center">
  <img src="src/app/icon.svg" width="128" height="128" alt="Share Link Gan Logo" />
  <h1>Share Link Gan 🔗</h1>
  <p><b>One link to rule them all. Connect your audiences to all of your content with just one click.</b></p>
  <p>Built with Next.js 14, Supabase, and Vercel.</p>

  [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fshare-link-gan&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&project-name=share-link-gan)
</div>

---

## ✨ Features

- **🎨 Premium Themes:** Match your brand flawlessly with beautiful CSS presets (`Glassmorphism`, `Neon Cipher`, `Dark`, `Light`).
- **📱 Real-time Mobile Preview:** An interactive dashboard that simulates exactly how your profile looks on a smartphone as you type.
- **🚀 Lightning Fast:** Deployed globally on the Edge using Vercel. Analyzed using Vercel Web Analytics.
- **🔐 Secure Auth:** Passwordless Google OAuth and Email/Password sign-in powered by Supabase Auth.
- **🌐 Social Integrations:** Scalable vector icons for Twitter/X, Instagram, GitHub, and LinkedIn out-of-the-box.
- **📸 Image Thumbnails:** Add vivid custom thumbnails to your individual link buttons.

## 🛠️ Tech Stack

- **Framework:** [Next.js 14 (App Router)](https://nextjs.org/)
- **Database & Auth:** [Supabase (PostgreSQL)](https://supabase.com/)
- **Styling:** Vanilla CSS with deep variable tokens (`globals.css`)
- **Hosting:** [Vercel](https://vercel.com/)
- **Analytics:** `@vercel/analytics`

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/share-link-gan.git
cd share-link-gan
npm install
```

### 2. Set up Supabase
1. Create a new project on [Supabase.com](https://supabase.com/).
2. Navigate to **SQL Editor** in your Supabase dashboard and run the contents of `supabase/schema.sql` to provision the `profiles` and `links` tables.
3. Configure Google OAuth under **Authentication > Providers**.
4. **CRITICAL STEP FOR VERCEL DEPLOYMENT:** Under **Authentication > URL Configuration**, you must add your production Vercel URL (e.g., `https://share-link-gan.vercel.app/auth/callback`) to the **Redirect URLs** Allow List. If you do not do this, Google Logins will redirect back to `localhost:3000`.

### 3. Add Environment Variables
Rename `.env.local.example` or create a `.env.local` file at the root:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📝 License
This project is [MIT](https://opensource.org/licenses/MIT) licensed.
