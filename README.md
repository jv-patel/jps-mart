# 🛒 JPs Mart

**Anand's fastest 10-minute grocery delivery app**

A full-stack Progressive Web App (PWA) built with vanilla HTML, CSS, and JavaScript, powered by Firebase for authentication, real-time data, and analytics.

[![Live](https://img.shields.io/badge/live-jps--mart.vercel.app-1d9e75?style=flat-square)](https://jps-mart.vercel.app)
[![PWA](https://img.shields.io/badge/PWA-installable-378add?style=flat-square)](#)
[![License](https://img.shields.io/badge/license-MIT-lightgrey?style=flat-square)](#license)

---

## 📖 Overview

JPs Mart is a lightweight, installable web app that lets customers in Anand order groceries, electronics, clothing, and medicine with a promised 10-minute delivery window. It includes phone-based OTP login, a live product catalog, UPI checkout, WhatsApp order confirmations, and a lightweight admin panel — all without a heavy frontend framework.

## 🔗 Live Demo

**[jps-mart.vercel.app](https://jps-mart.vercel.app)**

## ✨ Features

- ⚡ 10-minute delivery promise
- 🔐 Firebase Phone Authentication (OTP-based login)
- 🗄️ Real-time Firestore database for products and orders
- 🛍️ Multi-category catalog — Grocery, Electronics 🔌, Clothes 👕, Medicine 💊, and more
- 💳 UPI payments with a dynamically generated QR code
- 📱 WhatsApp order confirmations
- 📊 Google Analytics 4 tracking
- 🛡️ Admin panel secured with SHA-256 hashed passwords and login rate-limiting
- 📍 Delivery zone restricted to Anand (pincode 388001)
- 📲 Full PWA support — installable on mobile, works offline
- ⭐ Loyalty points, daily check-in, and spin-the-wheel rewards
- 🎯 Coupon and discount system
- ❤️ Wishlist and product reviews

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| Backend / Auth | Firebase Authentication, Firestore |
| Analytics | Google Analytics 4 |
| Offline support | Service Worker (PWA) |
| Hosting | Vercel |

## 📁 Project Structure

```
jps-mart/
├── index.html          # Landing page
├── app.html             # Main application shell
├── style.css / styles.css
├── manifest.json         # PWA manifest
├── sw.js                 # Service worker (offline caching)
├── js/
│   ├── firebase.js       # Firebase config & initialization
│   ├── auth.js            # Phone OTP authentication
│   ├── products.js        # Product catalog & categories
│   ├── cart.js             # Cart logic
│   ├── script.js           # Core app logic, checkout, delivery zone
│   ├── admin.js             # Admin panel & access control
│   ├── wishlist.js          # Wishlist feature
│   ├── reviews.js            # Product reviews
│   └── gamification.js       # Loyalty points, spin wheel, check-in
├── images/               # Icons, logo, placeholders
├── privacy.html / terms.html / refund.html
└── vercel.json           # Deployment config
```

## 🚀 Getting Started

### Prerequisites
- A [Firebase](https://console.firebase.google.com) project with **Authentication (Phone)** and **Firestore Database** enabled
- [Node.js](https://nodejs.org) (for local preview and deployment tooling)

### 1. Clone the repository
```bash
git clone https://github.com/jv-patel/jps-mart.git
cd jps-mart
```

### 2. Configure Firebase
Open `js/firebase.js` and replace the `firebaseConfig` object with your own project's credentials from the Firebase Console (**Project settings → General → Your apps**):

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

### 3. Run locally
```bash
npx http-server .
```
Then open the printed local URL (e.g. `http://127.0.0.1:8080`) in your browser.

### 4. Deploy to Vercel
```bash
npx vercel --prod
```
Or connect this repository directly in the [Vercel dashboard](https://vercel.com/new) for automatic deployments on every push.

## 🔐 Admin Panel

The admin panel is protected by a hashed password with automatic lockout after repeated failed attempts. Credentials are **not stored in this repository** — configure them directly in `js/admin.js` before deploying to production.

## 🗺️ Roadmap

- [ ] Order tracking with live status updates
- [ ] Multi-language support
- [ ] Push notifications for order updates
- [ ] Delivery partner app

## 📄 License

This project is licensed under the MIT License.

## 📬 Contact

For support or business inquiries, reach out via WhatsApp through the in-app support link.
