// js/gamification.js

var loyaltyPoints = parseInt(localStorage.getItem('sm_points')) || 0;
var lastSpinDate = localStorage.getItem('sm_spinDate') || '';
var checkinData = JSON.parse(localStorage.getItem('sm_checkins')) || { streak: 0, lastDate: '', history: [] };

const SPIN_PRIZES = [
  { label: '5% OFF', value: 5, type: 'percent', color: '#FFD700' },
  { label: 'Try Again', value: 0, type: 'none', color: '#E0E0E0' },
  { label: '10% OFF', value: 10, type: 'percent', color: '#4CAF50' },
  { label: 'Free Delivery', value: 0, type: 'freeShip', color: '#2196F3' },
  { label: 'Try Again', value: 0, type: 'none', color: '#E0E0E0' },
  { label: '20% OFF', value: 20, type: 'percent', color: '#FF9800' },
  { label: '₹50 OFF', value: 50, type: 'flat', color: '#9C27B0' },
  { label: 'Try Again', value: 0, type: 'none', color: '#E0E0E0' }
];

function initGamification() {
  loyaltyPoints = parseInt(localStorage.getItem('sm_points')) || 0;
  lastSpinDate = localStorage.getItem('sm_spinDate') || '';
  checkinData = JSON.parse(localStorage.getItem('sm_checkins')) || { streak: 0, lastDate: '', history: [] };
}

// ----------------- SPIN WHEEL -----------------
function canSpin() {
  const today = new Date().toISOString().split('T')[0];
  return lastSpinDate !== today;
}

function openSpinWheel() {
  const modal = document.getElementById('spin-modal');
  if(modal) {
    modal.classList.add('active');
    renderWheel();
  }
}

function closeSpinWheel() {
  const modal = document.getElementById('spin-modal');
  if(modal) {
    modal.classList.remove('active');
  }
}

function renderWheel() {
  const wheel = document.getElementById('spin-wheel');
  if(!wheel || wheel.dataset.rendered) return;
  
  const angle = 360 / SPIN_PRIZES.length;
  let gradientStr = [];
  
  SPIN_PRIZES.forEach((prize, i) => {
    const startAngle = i * angle;
    const endAngle = (i + 1) * angle;
    gradientStr.push(`${prize.color} ${startAngle}deg ${endAngle}deg`);
  });
  
  wheel.style.background = `conic-gradient(${gradientStr.join(', ')})`;
  
  // Add labels
  wheel.innerHTML = '';
  SPIN_PRIZES.forEach((prize, i) => {
    const label = document.createElement('div');
    label.innerText = prize.label;
    label.style.position = 'absolute';
    label.style.left = '50%';
    label.style.top = '50%';
    label.style.transformOrigin = '0 0';
    // Position label in the middle of the segment, offset slightly for better reading
    label.style.transform = `rotate(${i * angle + (angle/2)}deg) translate(40px, -10px)`;
    label.style.fontWeight = '700';
    label.style.fontSize = '0.75rem';
    label.style.color = prize.type === 'none' ? '#757575' : 'white';
    if(prize.color === '#FFD700') label.style.color = '#333'; // exception for yellow
    wheel.appendChild(label);
  });
  
  wheel.dataset.rendered = "true";
  
  if(!canSpin()) {
    document.getElementById('spin-btn').innerText = "Already Spun Today";
    document.getElementById('spin-btn').disabled = true;
    document.getElementById('spin-btn').style.opacity = "0.5";
  }
}

function doSpin() {
  if (!canSpin()) {
    showToast('Come back tomorrow!');
    return;
  }
  
  const btn = document.getElementById('spin-btn');
  btn.disabled = true;
  
  const today = new Date().toISOString().split('T')[0];
  const wheel = document.getElementById('spin-wheel');
  const resultDiv = document.getElementById('spin-result');
  
  resultDiv.innerHTML = 'Spinning...';
  
  // Pick random prize
  const prizeIndex = Math.floor(Math.random() * SPIN_PRIZES.length);
  const prize = SPIN_PRIZES[prizeIndex];
  
  // Calculate rotation (e.g. 5 full turns + exact angle to stop at pointer)
  // Pointer is at top (270 degrees in CSS conic-gradient coords, actually 0 degrees is top).
  const anglePerSegment = 360 / SPIN_PRIZES.length;
  // We want the center of the segment to be at the top (0 degrees).
  // The segment starts at prizeIndex * anglePerSegment.
  // To bring it to top, we rotate by 360 - (prizeIndex * anglePerSegment + anglePerSegment/2)
  const baseRotation = 360 - (prizeIndex * anglePerSegment + anglePerSegment/2);
  const totalTurns = 5;
  const finalRotation = (totalTurns * 360) + baseRotation;
  
  // Reset transition to 0 to prepare for spin, then apply spin
  wheel.style.transition = 'none';
  wheel.style.transform = `rotate(0deg)`;
  
  // Force reflow
  void wheel.offsetWidth;
  
  wheel.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
  wheel.style.transform = `rotate(${finalRotation}deg)`;
  
  setTimeout(() => {
    lastSpinDate = today;
    localStorage.setItem('sm_spinDate', today);
    
    if (prize.type !== 'none') {
      resultDiv.innerHTML = `<span style="color:var(--secondary); font-size:1.2rem; font-weight:800;">You won ${prize.label}!</span><br><span style="font-size:0.8rem; color:var(--text-muted);">Applied to your next order</span>`;
      localStorage.setItem('sm_spinPrize', JSON.stringify(prize));
      showToast(`Won ${prize.label}!`);
      // Also throw some confetti
      if(typeof throwConfetti === 'function') throwConfetti();
    } else {
      resultDiv.innerHTML = `<span style="color:var(--text-muted); font-weight:600;">Oops, ${prize.label}. Better luck tomorrow!</span>`;
    }
    
    btn.innerText = "Come back tomorrow";
  }, 4000);
}


// ----------------- DAILY CHECK-IN -----------------
function doDailyCheckin() {
  const today = new Date().toISOString().split('T')[0];
  
  if (checkinData.lastDate === today) {
    showToast('Already checked in today!');
    return;
  }
  
  // Check if streak is broken (difference > 1 day)
  if (checkinData.lastDate) {
    const last = new Date(checkinData.lastDate);
    const curr = new Date(today);
    const diffTime = Math.abs(curr - last);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) {
      checkinData.streak = 0; // Reset streak
    }
  }
  
  checkinData.streak++;
  checkinData.lastDate = today;
  
  // keep last 7 dates
  checkinData.history.push(today);
  if (checkinData.history.length > 7) {
    checkinData.history.shift();
  }
  
  localStorage.setItem('sm_checkins', JSON.stringify(checkinData));
  
  addPoints(5);
  showToast('Daily check-in: +5 points!');
  
  if (checkinData.streak === 7) {
    setTimeout(() => {
      addPoints(50);
      showToast('7-day streak! ₹50 bonus!');
      if(typeof throwConfetti === 'function') throwConfetti();
      // Reset streak after bonus
      checkinData.streak = 0;
      localStorage.setItem('sm_checkins', JSON.stringify(checkinData));
    }, 1500);
  }
  
  // Re-render if calendar is visible
  const cal = document.getElementById('checkin-cal-container');
  if(cal) cal.innerHTML = renderCheckinCalendar();
}

function renderCheckinCalendar() {
  const today = new Date().toISOString().split('T')[0];
  let html = `<div class="checkin-calendar">`;
  
  // Generate last 7 days array
  let daysArray = [];
  for(let i=6; i>=0; i--) {
    let d = new Date();
    d.setDate(d.getDate() - i);
    daysArray.push(d.toISOString().split('T')[0]);
  }
  
  daysArray.forEach(dstr => {
    let dateObj = new Date(dstr);
    let dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    let isDone = checkinData.history.includes(dstr);
    let isToday = dstr === today;
    
    let classes = 'checkin-day';
    if(isDone) classes += ' done';
    if(isToday && !isDone) classes += ' today';
    
    html += `
      <div style="display:flex; flex-direction:column; align-items:center; gap:5px;">
        <div style="font-size:0.65rem; color:var(--text-muted);">${dayName}</div>
        <div class="${classes}">${isDone ? '✓' : dateObj.getDate()}</div>
      </div>
    `;
  });
  
  html += `</div>
    <div style="text-align:center; margin-top:10px;">
      <div style="font-weight:700; color:var(--secondary);">Current Streak: ${checkinData.streak} 🔥</div>
      <div style="font-size:0.8rem; color:var(--text-muted);">Reach 7 days for 50 bonus points!</div>
    </div>
    <button class="btn" style="margin-top:15px;" onclick="doDailyCheckin()" ${checkinData.lastDate === today ? 'disabled style="opacity:0.6"' : ''}>
      ${checkinData.lastDate === today ? 'Checked In' : 'Claim Daily Check-in'}
    </button>
  `;
  
  return html;
}

function getStreakCount() {
  return checkinData.streak;
}

// ----------------- LOYALTY POINTS -----------------
function getPoints() {
  return loyaltyPoints;
}

function addPoints(amount) {
  loyaltyPoints += amount;
  localStorage.setItem('sm_points', loyaltyPoints);
  updatePointsUI();
}

function redeemPoints(amount) {
  if (amount <= loyaltyPoints) {
    loyaltyPoints -= amount;
    localStorage.setItem('sm_points', loyaltyPoints);
    updatePointsUI();
    return true;
  }
  return false;
}

function earnFromOrder(orderTotal) {
  const earned = Math.floor(orderTotal / 10);
  if (earned > 0) {
    addPoints(earned);
    showToast(`Earned ${earned} loyalty points!`);
  }
}

function updatePointsUI() {
  const ptsEl = document.getElementById('prof-points');
  if(ptsEl) ptsEl.innerText = loyaltyPoints;
  
  // Trigger re-render of cart to update redeemable points UI if needed
  if(typeof updateCartUI === 'function') updateCartUI();
}

// --- DYNAMIC COUPON SYSTEM ---
window.dynamicCoupons = [];

function loadCouponsFromFirestore() {
  if (!window.db || !window.fs) {
    window.addEventListener('firebaseReady', loadCouponsFromFirestore);
    return;
  }
  const { collection, onSnapshot } = window.fs;
  const couponsRef = collection(window.db, "coupons");
  
  onSnapshot(couponsRef, (snapshot) => {
    window.dynamicCoupons = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log("Loaded dynamic coupons from Firestore:", window.dynamicCoupons);
  }, (err) => {
    console.error("Error loading coupons from Firestore:", err);
  });
}

function validateCoupon(code) {
  if (!code) return { valid: false, message: 'Please enter a coupon code' };
  const couponCode = code.toUpperCase().trim();
  
  // Check Firestore dynamic coupons
  const dynamicCoupon = window.dynamicCoupons.find(c => c.code.toUpperCase() === couponCode);
  if (dynamicCoupon) {
    if (dynamicCoupon.enabled === false) {
      return { valid: false, message: 'Coupon is currently disabled' };
    }
    
    // Check expiry
    if (dynamicCoupon.expiryDate) {
      const expiry = new Date(dynamicCoupon.expiryDate);
      const today = new Date();
      // Set to end of day for expiry comparison
      expiry.setHours(23, 59, 59, 999);
      if (today > expiry) {
        return { valid: false, message: 'This coupon has expired' };
      }
    }
    
    // Check usage limits
    if (dynamicCoupon.maxUses && dynamicCoupon.uses >= dynamicCoupon.maxUses) {
      return { valid: false, message: 'Coupon usage limit reached' };
    }
    
    return { valid: true, coupon: dynamicCoupon };
  }
  
  // Check static hardcoded coupons (defined in cart.js)
  if (typeof COUPONS !== 'undefined' && COUPONS[couponCode]) {
    return { valid: true, coupon: { code: couponCode, ...COUPONS[couponCode] } };
  }
  
  return { valid: false, message: 'Invalid coupon code' };
}

function getCouponDiscount(code, subtotal) {
  const validation = validateCoupon(code);
  if (!validation.valid) return 0;
  
  const c = validation.coupon;
  let discount = 0;
  
  if (c.type === 'percent') {
    discount = (subtotal * c.value) / 100;
    const maxLimit = c.maxDiscount || c.max || 0;
    if (maxLimit > 0 && discount > maxLimit) {
      discount = maxLimit;
    }
  } else if (c.type === 'flat') {
    discount = c.value;
  } else if (c.type === 'freeShip') {
    discount = 0; // Free shipping doesn't reduce subtotal
  }
  
  return Math.min(discount, subtotal);
}

// Auto-initialize coupon loading
loadCouponsFromFirestore();

// ==========================================
// ========= REFER & EARN SYSTEM ===========
// ==========================================

let currentReferralCode = localStorage.getItem('sm_referral_code') || '';

function generateReferralCode(orderId) {
  // Only generate if user doesn't already have one from this session
  if (currentReferralCode) return currentReferralCode;
  
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let random = '';
  for (let i = 0; i < 6; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const code = 'SHEIKH-' + random;
  currentReferralCode = code;
  localStorage.setItem('sm_referral_code', code);
  
  // Save to Firestore as a valid coupon
  saveReferralCouponToFirestore(code, orderId);
  
  return code;
}

async function saveReferralCouponToFirestore(code, orderId) {
  if (!window.db || !window.fs) {
    console.warn('Firestore not ready, will retry referral save on firebaseReady');
    window.addEventListener('firebaseReady', () => saveReferralCouponToFirestore(code, orderId));
    return;
  }
  
  const userId = (window.auth && window.auth.currentUser) ? window.auth.currentUser.uid : 'guest';
  
  const couponData = {
    code: code,
    type: 'flat',
    value: 50,
    minOrder: 200,
    maxUses: 1,
    uses: 0,
    active: true,
    enabled: true,
    isReferral: true,
    referrerUserId: userId,
    sourceOrderId: orderId,
    expiryDate: getExpiryDate(30), // 30 days validity
    createdAt: window.fs.serverTimestamp()
  };
  
  try {
    await window.fs.setDoc(window.fs.doc(window.db, "coupons", code), couponData);
    console.log('Referral coupon saved to Firestore:', code);
  } catch (err) {
    console.error('Error saving referral coupon:', err);
  }
}

function getExpiryDate(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
}

function renderReferralCard() {
  const container = document.getElementById('referral-card-container');
  if (!container) return;
  
  const code = currentReferralCode || localStorage.getItem('sm_referral_code') || '';
  if (!code) {
    container.innerHTML = '';
    return;
  }
  
  container.innerHTML = `
    <div class="referral-card">
      <div class="referral-icon">🎁</div>
      <div class="referral-title">Refer & Earn ₹50!</div>
      <div class="referral-desc">Apna code share karo — aapke dost ko ₹50 off milega aur jab wo order karega, aapko bhi ₹50 milenge!</div>
      <div class="referral-code-box">
        <span id="referral-code-text">${code}</span>
        <button class="referral-copy-btn" onclick="copyReferralCode()"><i class="fa-regular fa-copy"></i></button>
      </div>
      <div class="referral-actions">
        <button class="btn" style="flex:2;" onclick="shareReferralOnWhatsApp()">
          <i class="fa-brands fa-whatsapp"></i> WhatsApp pe Share
        </button>
        <button class="btn btn-outline" style="flex:1;" onclick="shareReferralGeneric()">
          <i class="fa-solid fa-share-nodes"></i> Share
        </button>
      </div>
    </div>
  `;
}

function copyReferralCode() {
  const code = currentReferralCode || localStorage.getItem('sm_referral_code') || '';
  if (!code) return;
  
  navigator.clipboard.writeText(code).then(() => {
    showToast('Referral code copied!', 'success');
  }).catch(() => {
    // Fallback for older browsers
    const tempInput = document.createElement('input');
    tempInput.value = code;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast('Referral code copied!', 'success');
  });
}

function shareReferralOnWhatsApp() {
  const code = currentReferralCode || localStorage.getItem('sm_referral_code') || '';
  if (!code) return;
  
  const msg = `🛒 *JPsMart pe ₹50 OFF paao!*

Main JPsMart se grocery order karta hoon — 10 min delivery! 🚀

Mera referral code use karo aur apne pehle order pe *₹50 ki chhutt* paao:

🎟️ Code: *${code}*

👉 Abhi order karo: jps-mart.vercel.app

Minimum order ₹200. Jaldi karo — code ek baar hi use hoga!`;

  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
}

function shareReferralGeneric() {
  const code = currentReferralCode || localStorage.getItem('sm_referral_code') || '';
  if (!code) return;
  
  const shareData = {
    title: 'JPsMart Referral — ₹50 OFF!',
    text: `Use my JPsMart referral code ${code} and get ₹50 off your first order (min ₹200). Order now: jps-mart.vercel.app`,
    url: 'https://jps-mart.vercel.app'
  };
  
  if (navigator.share) {
    navigator.share(shareData).catch(() => {
      copyReferralCode();
    });
  } else {
    copyReferralCode();
  }
}

// Reward referrer when their code is used by someone
async function rewardReferrer(couponCode) {
  if (!window.db || !window.fs) return;
  
  try {
    const couponRef = window.fs.doc(window.db, "coupons", couponCode);
    const { getDoc } = window.fs;
    
    // We need getDoc — check if available
    if (typeof getDoc !== 'function') return;
    
    const couponSnap = await getDoc(couponRef);
    if (!couponSnap.exists()) return;
    
    const couponData = couponSnap.data();
    if (!couponData.isReferral || !couponData.referrerUserId) return;
    
    // Mark coupon as used
    await window.fs.updateDoc(couponRef, { 
      uses: (couponData.uses || 0) + 1, 
      active: false,
      enabled: false,
      usedAt: window.fs.serverTimestamp()
    });
    
    // Generate a reward coupon for the referrer
    const rewardCode = 'REWARD-' + couponCode.split('-')[1];
    const rewardCouponData = {
      code: rewardCode,
      type: 'flat',
      value: 50,
      minOrder: 200,
      maxUses: 1,
      uses: 0,
      active: true,
      enabled: true,
      isReferralReward: true,
      rewardForUserId: couponData.referrerUserId,
      sourceReferralCode: couponCode,
      expiryDate: getExpiryDate(30),
      createdAt: window.fs.serverTimestamp()
    };
    
    await window.fs.setDoc(window.fs.doc(window.db, "coupons", rewardCode), rewardCouponData);
    console.log('Referrer rewarded with coupon:', rewardCode);
  } catch (err) {
    console.error('Error rewarding referrer:', err);
  }
}
