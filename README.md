# Sheikh Mart 🛒

**Ahmedabad's fastest 10-minute grocery delivery app**

A full-stack Progressive Web App (PWA) built with vanilla HTML/CSS/JS and Firebase.

## Live Demo
🔗 [sheikh-mart.vercel.app](https://sheikh-mart.vercel.app)

## Features
- ⚡ 10-minute delivery promise
- 🔐 Firebase Phone Authentication (OTP)
- 🗄️ Real-time Firestore database (products + orders)
- 💳 UPI payment with dynamic QR code
- 📱 WhatsApp order confirmations
- 📊 Google Analytics 4 tracking
- 🛡️ Admin panel with SHA-256 hashed passwords + rate limiting
- 📍 Delivery zone restricted to Ahmedabad (380001–382481)
- 📲 Full PWA — installable, works offline
- ⭐ Loyalty points, spin wheel, daily check-in
- 🎯 Coupon system

## Deploy to Vercel
```bash
npx vercel --prod
```

## Firebase Setup
Enable these in Firebase Console:
- Authentication → Phone
- Firestore Database → Create in production mode
- Analytics → Enable GA4

## Admin Login
- Username: `sheikhmart_admin`
- Password: `SM@2024#Secure!`
- Auto-lock after 3 failed attempts (30 min)

## Tech Stack
- HTML5 / CSS3 / JavaScript (ES6+)
- Firebase 10 (Auth, Firestore, Analytics)
- Service Worker (PWA)
- Vercel (hosting)

## Contact
📱 WhatsApp: +91 90162 40490
