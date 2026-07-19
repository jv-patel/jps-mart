// js/cart.js

var cart = JSON.parse(localStorage.getItem('sm_cart')) || {}; // {productId: {qty, weight}}
let appliedCoupon = null;
let appliedPoints = 0;
let selectedDeliverySlot = 'express';

// Guard for COMBOS undefined
if (typeof COMBOS === 'undefined') window.COMBOS = [];

const COUPONS = {
  'FIRST50': { type: 'percent', value: 50, max: 100, desc: '50% off up to ₹100' },
  'SHEIKH20': { type: 'percent', value: 20, max: 200, desc: '20% off up to ₹200' },
  'FREESHIP': { type: 'freeShip', value: 0, max: 0, desc: 'Free delivery on any order' }
};
const GST_RATE = 0.05;
const DELIVERY_FEE = 29;
const FREE_DELIVERY_MIN = 299;
const EXPRESS_FEE = 49;

function initCart() {
  cart = JSON.parse(localStorage.getItem('sm_cart')) || {};
  updateCartUI();
}

function addToCart(id, qty = 1) {
  const p = getProduct(id);
  if (!p) return false;
  
  if (!cart[id]) {
    cart[id] = { qty: 0, weight: p.weight };
  }
  cart[id].qty += qty;
  
  localStorage.setItem('sm_cart', JSON.stringify(cart));
  updateCartUI();
  
  // Shake cart icons
  document.querySelectorAll('.nav-item').forEach(item => {
    if(item.querySelector('.fa-basket-shopping')) {
      item.classList.add('cart-shake');
      setTimeout(() => item.classList.remove('cart-shake'), 400);
    }
  });
  
  if(typeof showToast === 'function') showToast('Added to cart');
  return true;
}

function removeFromCart(id) {
  delete cart[id];
  localStorage.setItem('sm_cart', JSON.stringify(cart));
  updateCartUI();
}

function updateQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) {
    removeFromCart(id);
  } else {
    localStorage.setItem('sm_cart', JSON.stringify(cart));
    updateCartUI();
  }
}

function getCartItems() {
  return Object.keys(cart).map(id => {
    const p = getProduct(id);
    if (!p) return null;
    return { product: p, qty: cart[id].qty, weight: cart[id].weight };
  }).filter(Boolean);
}

function getCartCount() {
  return Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotals() {
  const items = getCartItems();
  let subtotal = 0;
  let originalSum = 0;
  
  items.forEach(item => {
    subtotal += item.product.price * item.qty;
    originalSum += item.product.originalPrice * item.qty;
  });
  
  // Buy More Save More
  const uniqueItemsCount = items.length;
  let buyMoreDiscount = 0;
  if (uniqueItemsCount >= 4) buyMoreDiscount = subtotal * 0.30;
  else if (uniqueItemsCount >= 3) buyMoreDiscount = subtotal * 0.20;
  else if (uniqueItemsCount >= 2) buyMoreDiscount = subtotal * 0.10;
  
  let afterBuyMore = subtotal - buyMoreDiscount;
  
  // Coupon
  let couponDiscount = 0;
  let isFreeShip = false;
  
  if (appliedCoupon) {
    if (typeof validateCoupon === 'function') {
      const validation = validateCoupon(appliedCoupon);
      if (validation.valid) {
        const coup = validation.coupon;
        if (coup.type === 'percent') {
          const maxLimit = coup.maxDiscount || coup.max || 0;
          couponDiscount = afterBuyMore * (coup.value / 100);
          if (maxLimit > 0 && couponDiscount > maxLimit) {
            couponDiscount = maxLimit;
          }
        } else if (coup.type === 'flat') {
          couponDiscount = coup.value;
        } else if (coup.type === 'freeShip') {
          isFreeShip = true;
        }
      }
    } else if (COUPONS[appliedCoupon]) {
      const coup = COUPONS[appliedCoupon];
      if (coup.type === 'percent') {
        couponDiscount = Math.min(afterBuyMore * (coup.value / 100), coup.max);
      } else if (coup.type === 'freeShip') {
        isFreeShip = true;
      }
    }
  }
  
  let afterCoupon = afterBuyMore - couponDiscount;
  if (afterCoupon < 0) afterCoupon = 0;
  
  // GST
  let gst = afterCoupon * GST_RATE;
  
  // Delivery
  let deliveryFee = (subtotal >= FREE_DELIVERY_MIN || isFreeShip || subtotal === 0) ? 0 : DELIVERY_FEE;
  
  // Express slot fee addition
  if (selectedDeliverySlot === 'express' && subtotal > 0) {
    deliveryFee += EXPRESS_FEE;
  }
  
  // Points
  let pointsDiscount = appliedPoints;
  
  let grandTotal = afterCoupon + gst + deliveryFee - pointsDiscount;
  if (grandTotal < 0) grandTotal = 0;
  
  let savings = originalSum - grandTotal;
  
  return {
    subtotal: Math.round(subtotal),
    buyMoreDiscount: Math.round(buyMoreDiscount),
    couponDiscount: Math.round(couponDiscount),
    gst: Math.round(gst),
    deliveryFee: Math.round(deliveryFee),
    pointsDiscount: Math.round(pointsDiscount),
    grandTotal: Math.round(grandTotal),
    savings: Math.round(savings),
    freeGift: subtotal >= 500
  };
}

function applyCoupon() {
  const code = document.getElementById('coupon-input').value.toUpperCase().trim();
  let isValid = false;
  let successMsg = 'Coupon Applied!';
  
  if (typeof validateCoupon === 'function') {
    const valResult = validateCoupon(code);
    if (valResult.valid) {
      isValid = true;
    } else {
      successMsg = valResult.message;
    }
  } else if (COUPONS[code]) {
    isValid = true;
  }
  
  if (isValid) {
    appliedCoupon = code;
    updateCartUI();
    if(typeof showToast === 'function') showToast(successMsg, 'success');
    return true;
  } else {
    if(typeof showToast === 'function') showToast(successMsg, 'error');
    return false;
  }
}

function removeCoupon() {
  appliedCoupon = null;
  updateCartUI();
}

// Renamed function
function applyPointsToCart(pts) {
  if (typeof getPoints !== 'function') return;
  const userPoints = getPoints();
  if (pts <= userPoints) {
    appliedPoints = pts;
    updateCartUI();
  }
}
// Alias for backward compatibility (30 days) removed to avoid global naming conflict with gamification.js

function clearCart() {
  cart = {};
  appliedCoupon = null;
  appliedPoints = 0;
  localStorage.removeItem('sm_cart');
  updateCartUI();
}

function addComboToCart(comboId) {
  const combo = COMBOS.find(c => c.id === comboId);
  if (combo) {
    combo.items.forEach(itemId => addToCart(itemId, 1));
    if(typeof showToast === 'function') showToast('Combo added to cart!');
  }
}

function updateCartUI() {
  const count = getCartCount();
  const badges = [document.getElementById('cart-badge'), document.getElementById('desk-cart-badge')];
  
  badges.forEach(b => {
    if (b) {
      b.innerText = count;
      if (count > 0) b.classList.remove('hidden');
      else b.classList.add('hidden');
    }
  });
  
  const items = getCartItems();
  const mobBody = document.getElementById('mob-cart-body');
  const deskBody = document.getElementById('desk-cart-body');
  
  let html = '';
  if (items.length === 0) {
    html = `<div class="empty-state">
              <i class="fa-solid fa-basket-shopping empty-icon"></i>
              <h3 class="baloo">Your cart is empty</h3>
              <p style="color:var(--text-muted); font-size:0.9rem;">Add items to start building your order</p>
            </div>`;
    [document.getElementById('btn-checkout-mob'), document.getElementById('btn-checkout-desk')].forEach(btn => {
      if(btn) btn.classList.add('hidden');
    });
  } else {
    html = items.map(renderCartItem).join('');
    html += `<div class="coupon-box">
                <input type="text" id="coupon-input" placeholder="Promo Code" value="${appliedCoupon || ''}">
                <button class="btn btn-sm" style="width:auto;" onclick="applyCoupon()">APPLY</button>
              </div>`;
    if(appliedCoupon) {
      html += `<div style="text-align:right; margin-top:-10px; margin-bottom:15px; font-size:0.8rem; color:var(--secondary); cursor:pointer;" onclick="removeCoupon()">Remove Coupon</div>`;
    }
    html += renderBillSummary();
    const totals = getCartTotals();
    [document.getElementById('btn-checkout-mob'), document.getElementById('btn-checkout-desk')].forEach(btn => {
      if(btn) {
        btn.classList.remove('hidden');
        btn.innerText = `Checkout • ₹${totals.grandTotal}`;
      }
    });
  }
  
  if (mobBody) mobBody.innerHTML = html;
  if (deskBody) deskBody.innerHTML = html;
}

function renderCartItem(item) {
  const p = item.product;
  return `
    <div class="cart-item">
      <div class="cart-item-img skeleton" style="width:50px; height:50px; border-radius:10px; margin-right:12px; position:relative; overflow:hidden;">
        <img src="${getUnsplashUrl(p)}" loading="lazy" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; opacity:0; transition:opacity 0.3s;" onload="this.style.opacity=1; this.parentElement.classList.remove('skeleton');" onerror="if(this.parentElement) this.parentElement.classList.remove('skeleton'); if(this.src!=='/images/placeholder.png'){this.src='/images/placeholder.png';}else{this.onerror=null; this.outerHTML='<div class=\\'cart-item-emoji\\' style=\\'font-size:2.2rem; width:100%; height:100%; display:flex; justify-content:center; align-items:center; margin:0;\\'>${p.emoji}</div>';}">
      </div>
      <div style="flex:1;">
        <div style="font-weight:600; font-size:0.9rem; margin-bottom:2px;">${p.name}</div>
        <div style="font-size:0.75rem; color:var(--text-muted);">${item.weight}</div>
        <div style="font-weight:800; margin-top:6px;">₹${p.price} <span style="font-size:0.7rem; color:var(--text-muted); text-decoration:line-through; font-weight:normal;">₹${p.originalPrice}</span></div>
      </div>
      <div class="p-qty-ctrl" style="background:transparent; border:1px solid var(--secondary);">
        <button style="color:var(--text);" onclick="updateQty(${p.id}, -1)">-</button>
        <span style="color:var(--text);">${item.qty}</span>
        <button style="color:var(--text);" onclick="updateQty(${p.id}, 1)">+</button>
      </div>
    </div>
  `;
}

function renderBillSummary() {
  const totals = getCartTotals();
  let html = `<div class="bill-card">
    <h3 class="baloo" style="margin-bottom:15px; font-size:1.1rem;">Bill Summary</h3>
    <div class="bill-row"><span>Item Total</span><span>₹${totals.subtotal}</span></div>`;
  if (totals.buyMoreDiscount > 0) {
    html += `<div class="bill-row" style="color:var(--secondary);"><span>Combo Discount</span><span>-₹${totals.buyMoreDiscount}</span></div>`;
  }
  if (totals.couponDiscount > 0) {
    html += `<div class="bill-row" style="color:var(--secondary);"><span>Coupon (${appliedCoupon})</span><span>-₹${totals.couponDiscount}</span></div>`;
  }
  html += `<div class="bill-row"><span>GST (5%)</span><span>₹${totals.gst}</span></div>`;
  const delText = totals.deliveryFee === 0 ? '<span style="color:var(--secondary); font-weight:700;">FREE</span>' : `₹${totals.deliveryFee}`;
  html += `<div class="bill-row"><span>Delivery Fee</span><span>${delText}</span></div>`;
  if (totals.pointsDiscount > 0) {
    html += `<div class="bill-row" style="color:var(--secondary);"><span>Points Redeemed</span><span>-₹${totals.pointsDiscount}</span></div>`;
  }
  html += `<div class="bill-row bill-total"><span>Grand Total</span><span style="color:var(--secondary);">₹${totals.grandTotal}</span></div>`;
  if (totals.savings > 0) {
    html += `<div style="background-color:rgba(46,125,50,0.1); color:var(--secondary); padding:8px; border-radius:6px; font-size:0.8rem; font-weight:700; text-align:center; margin-top:10px;">You are saving ₹${totals.savings} on this order!</div>`;
  }
  if (totals.freeGift) {
    html += `<div style="margin-top:10px; display:flex; align-items:center; gap:10px; border:1px solid #FF9800; padding:10px; border-radius:8px; background:rgba(255,152,0,0.05);">
        <div style="font-size:1.5rem;">🎁</div>
        <div>
          <div style="font-weight:700; font-size:0.85rem; color:#F57C00;">Free Gift Unlocked!</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">Added to your order</div>
        </div>
      </div>`;
  }
  html += `</div>`;
  return html;
}

// Export functions if needed
if (typeof window !== 'undefined') {
  window.cart = {
    initCart,
    addToCart,
    removeFromCart,
    updateQty,
    getCartItems,
    getCartCount,
    getCartTotals,
    applyCoupon,
    removeCoupon,
    applyPointsToCart,
    redeemPoints: applyPointsToCart,
    clearCart,
    addComboToCart,
    updateCartUI
  };
}
