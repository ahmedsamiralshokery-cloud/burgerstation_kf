# 🍔 Burger Station - Restaurant Web App

A modern, bilingual (Arabic/English) restaurant ordering website for **Burger Station** in Kafr El Dawar, Egypt. Built with Next.js 15, featuring real-time menu management, WhatsApp ordering integration, and a beautiful dark theme.

![Next.js](https://img.shields.io/badge/Next.js-15.1.6-black)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)

## ✨ Features

### Customer Features
- 🌐 **Bilingual Support**: Full Arabic (RTL) and English (LTR) localization
- 🍔 **Interactive Menu**: Browse burgers, chicken, snacks, sides, and drinks
- 🛒 **Shopping Cart**: Add items, adjust quantities, review orders
- 📱 **WhatsApp Integration**: Send orders directly via WhatsApp
- 🎨 **Beautiful UI**: Dark burgundy/gold theme optimized for mobile
- 📸 **Photo Gallery**: Restaurant photos with smooth grid layout
- ⭐ **SEO Optimized**: Meta tags, OpenGraph, Schema.org structured data

### Admin Features
- 🔐 **Password Protected**: Secure admin panel
- ✏️ **Menu Management**: Add, edit, delete menu items in real-time
- 📷 **Image Upload**: Automatic image compression to 600px
- 💾 **Export Menu**: Download menu data as TypeScript file
- 🔄 **Reset Menu**: Restore default menu with one click
- 💻 **localStorage Based**: Changes persist locally per browser

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd burger-next

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
burger-next/
├── app/
│   ├── [lang]/              # Internationalized routes
│   │   ├── page.tsx         # Main storefront page
│   │   ├── layout.tsx       # Language-specific layout
│   │   └── admin/           # Admin panel route
│   │       └── page.tsx
│   ├── globals.css          # Global styles + CSS variables
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Root redirect to default locale
│   ├── providers.tsx        # React Context providers
│   ├── Toast.tsx            # Toast notification component
│   └── locale-sync.tsx      # Client-side locale synchronization
├── components/
│   ├── Storefront.tsx       # Main customer-facing UI
│   ├── Menu.tsx             # Menu display component
│   ├── CartDrawer.tsx       # Shopping cart drawer
│   └── AdminPanel.tsx       # Admin menu management
├── lib/
│   ├── config.ts            # App configuration
│   ├── i18n.ts              # Internationalization utilities
│   ├── menu-types.ts        # TypeScript interfaces
│   ├── menu-default.ts      # Default menu data
│   ├── cart-context.tsx     # Shopping cart state management
│   └── storage.ts           # localStorage utilities
├── messages/
│   ├── ar.json              # Arabic translations
│   └── en.json              # English translations
├── public/
│   └── images/              # Restaurant photos and assets
└── package.json
```

## 🎯 Key Routes

| Route | Description |
|-------|-------------|
| `/` | Redirects to `/ar` (default locale) |
| `/ar` | Arabic storefront |
| `/en` | English storefront |
| `/ar/admin` | Admin panel (Arabic) |
| `/en/admin` | Admin panel (English) |

## 🔧 Configuration

### Admin Password

Edit `lib/config.ts` to change the admin password:

```typescript
export const CONFIG = {
  adminPassword: "burger2026", // Change this!
  // ...
};
```

⚠️ **Security Note**: This is client-side only protection. For production, implement proper server-side authentication.

### WhatsApp Number

Update the WhatsApp number in `lib/config.ts`:

```typescript
export const CONFIG = {
  whatsapp: "201276570279", // International format, no +
  // ...
};
```

### Restaurant Information

Edit restaurant details in:
- `app/[lang]/page.tsx` - Metadata and Schema.org markup
- `messages/ar.json` & `messages/en.json` - Translations

## 🎨 Design System

### Color Palette

```css
--bg: #1a0c0c;      /* Dark burgundy background */
--card: #2a1414;    /* Card background */
--fg: #fff4e6;      /* Cream text */
--muted: #c9a99a;   /* Muted text */
--red: #c1121f;     /* Accent red */
--gold: #ffc300;    /* Primary gold */
```

### Typography

- Font Family: `Tahoma, "Segoe UI", Arial, sans-serif`
- Supports both Arabic (RTL) and English (LTR) text direction

## 📱 Admin Panel Usage

### Accessing Admin Panel

1. Navigate to `/ar/admin` or `/en/admin`
2. Enter password: `burger2026`
3. Click "دخول" (Login)

### Managing Menu Items

#### Add New Item
1. Click "+ إضافة صنف" (Add Item)
2. Fill in:
   - Category (القسم)
   - Arabic name (الاسم بالعربي)
   - English name
   - Single price (السعر)
   - Double price (optional, for burgers only)
   - Image path or upload image
3. Click "💾 حفظ" (Save)

#### Edit Item
1. Click "تعديل" (Edit) next to any item
2. Modify fields
3. Click "💾 حفظ" (Save)

#### Delete Item
1. Click "حذف" (Delete) next to any item
2. Confirm deletion

#### Export Menu
1. Click "⬇ تصدير menu-data.ts"
2. Save the downloaded file
3. Replace `lib/menu-default.ts` with exported file
4. Commit to make changes permanent for all users

#### Reset Menu
1. Click "استرجاع الافتراضي" (Reset to Default)
2. Confirm - this will restore the original menu from `lib/menu-default.ts`

### Image Guidelines

- **Recommended size**: 600px width (auto-compressed)
- **Format**: JPG preferred for smaller file size
- **Aspect ratio**: Square or 4:3 works best
- **Storage**: Images stored as base64 in localStorage OR as file paths in `/public/images/`

⚠️ **localStorage Limit**: If you get "المساحة ممتلئة" (Storage Full), use file paths instead of uploading images.

## 🌐 Internationalization (i18n)

### Adding Translations

Edit `messages/ar.json` and `messages/en.json`:

```json
{
  "key": "Arabic text",
  "another_key": "More text"
}
```

Use in components:

```typescript
import { t } from "@/lib/i18n";

const text = t(lang, "key");
```

### Adding Menu Items

Edit `lib/menu-default.ts`:

```typescript
{
  id: "item-1",
  cat: "beef",           // Category ID
  ar: "برجر كلاسيك",    // Arabic name
  en: "Classic Burger",  // English name
  p1: 80,                // Single price
  p2: 110,               // Double price (null if not applicable)
  img: "/images/burger.jpg" // Image path or empty string
}
```

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms

This is a standard Next.js app and can be deployed to:
- Netlify
- AWS Amplify
- Railway
- Render
- Any Node.js hosting

See [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)

## 📊 Menu Data Structure

### Categories

```typescript
interface MenuCategory {
  id: string;        // Unique identifier
  ar: string;        // Arabic name
  en: string;        // English name
  sized: boolean;    // true for single/double pricing (burgers)
  emoji: string;     // Category emoji
}
```

### Items

```typescript
interface MenuItem {
  id: string;        // Unique identifier
  cat: string;       // Category ID
  ar: string;        // Arabic name
  en: string;        // English name
  p1: number;        // Single/regular price
  p2: number | null; // Double price (null if not sized)
  img: string;       // Image path or base64 data URL
}
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) + Custom CSS
- **State Management**: React Context API
- **Storage**: localStorage for cart & admin changes
- **Deployment**: Vercel-ready

## 📝 License

All rights reserved © Burger Station - Kafr El Dawar

## 📞 Contact

**Burger Station**  
Kafr El Dawar, Al Hadaiq St., El Halawany Towers  
In front of the church

📱 WhatsApp: [01276570279](https://wa.me/201276570279)  
⭐ Rating: 4.8/5  
🕐 Hours: 11:00 AM - 6:00 AM (Daily)

---

Built with ❤️ for the best burgers in Kafr El Dawar 🍔
