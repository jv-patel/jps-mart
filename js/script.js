// js/script.js

// --- RENDERING ---
function renderCategories() {
  const scrollContainer = document.getElementById('home-cat-scroll');
  const gridContainer = document.getElementById('all-cat-grid');
  
  let html = '';
  CATEGORIES.forEach(c => {
    html += `
      <div class="cat-item" onclick="filterCategory('${c.id}')">
        <div class="cat-icon">${c.emoji}</div>
        <div class="cat-label">${c.name}</div>
      </div>
    `;
  });
  
  if(scrollContainer) scrollContainer.innerHTML = html;
  
  let gridHtml = '';
  CATEGORIES.forEach(c => {
    gridHtml += `
      <div class="cat-item" style="margin-bottom:15px;" onclick="filterCategory('${c.id}')">
        <div class="cat-icon" style="width:75px; height:75px; font-size:2.2rem; border-radius:20px;">${c.emoji}</div>
        <div class="cat-label" style="font-size:0.8rem; margin-top:8px;">${c.name}</div>
      </div>
    `;
  });
  if(gridContainer) gridContainer.innerHTML = gridHtml;
}

function filterCategory(catId) {
  currentCategory = catId;
  renderProducts();
  navigate('home');
  // Scroll to products
  const pTitle = document.getElementById('products-title');
  if(pTitle) pTitle.scrollIntoView({behavior: 'smooth', block: 'start'});
}

function renderProducts(searchQ = '') {
  const container = document.getElementById('product-grid');
  if(!container) return;
  
  let filtered = PRODUCTS;
  
  if(currentCategory !== 'all') {
    filtered = filtered.filter(p => p.category === currentCategory);
    const catName = CATEGORIES.find(c => c.id === currentCategory)?.name || 'Products';
    const titleEl = document.getElementById('products-title');
    if(titleEl) titleEl.innerHTML = `${catName} <span style="font-size:0.8rem; color:var(--secondary); font-weight:700; cursor:pointer;" onclick="filterCategory('all')">View All</span>`;
  } else {
    const titleEl = document.getElementById('products-title');
    if(titleEl) titleEl.innerText = "All Products";
  }
  
  if(searchQ) {
    searchQ = searchQ.toLowerCase();
    // Find category IDs matching search query
    const matchingCategories = CATEGORIES.filter(c => 
      c.name.toLowerCase().includes(searchQ) || 
      c.id.toLowerCase().includes(searchQ)
    ).map(c => c.id);

    filtered = PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(searchQ) || 
      matchingCategories.includes(p.category)
    );
    
    const titleEl = document.getElementById('products-title');
    if(titleEl) titleEl.innerText = `Search: "${searchQ}"`;
  }

  // Price Filter
  if (typeof filterPriceMin !== 'undefined') {
    filtered = filtered.filter(p => p.price >= filterPriceMin && p.price <= filterPriceMax);
  }

  // In-Stock Filter
  if (typeof filterInStockOnly !== 'undefined' && filterInStockOnly) {
    filtered = filtered.filter(p => p.stock > 0);
  }

  // Sorting
  if (typeof sortBy !== 'undefined') {
    if (sortBy === 'price-low-high') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high-low') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-a-z') {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }
  }
  
  if(filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding:40px 20px;">
        <i class="fa-solid fa-magnifying-glass empty-icon"></i>
        <h4 class="baloo">No products found</h4>
        <p style="color:var(--text-muted); font-size:0.85rem;">Try adjusting your filters</p>
      </div>`;
    return;
  }
  
  let html = filtered.map(p => {
    let badgeHtml = '';
    if(p.badge) {
      let bClass = 'badge-new';
      if(p.badge==='HOT') bClass='badge-hot';
      if(p.badge==='SALE') bClass='badge-sale';
      if(p.stock===0) bClass='badge-oos';
      badgeHtml = `<div class="p-badge ${bClass}">${p.stock===0 ? 'OUT OF STOCK' : p.badge}</div>`;
    }
    
    // Check if in cart
    let qty = cart[p.id] ? cart[p.id].qty : 0;
    let btnHtml = '';
    if(p.stock === 0) {
      btnHtml = `<button class="p-add-btn" style="opacity:0.5; cursor:not-allowed;" disabled>OOS</button>`;
    } else if(qty > 0) {
      btnHtml = `
        <div class="p-qty-ctrl">
          <button onclick="event.stopPropagation(); updateQty(${p.id}, -1)">-</button>
          <span>${qty}</span>
          <button onclick="event.stopPropagation(); updateQty(${p.id}, 1)">+</button>
        </div>
      `;
    } else {
      btnHtml = `<button class="p-add-btn" onclick="event.stopPropagation(); addToCart(${p.id})">ADD</button>`;
    }
    
    // Rating
    const rt = getProductRating(p.id);
    let rHtml = '';
    if(rt.count > 0) {
      rHtml = `<div class="p-rating"><span>${rt.avg}</span> <i class="fa-solid fa-star"></i> (${rt.count})</div>`;
    } else {
      rHtml = `<div class="p-rating" style="color:var(--text-muted);"><i class="fa-regular fa-star" style="color:var(--text-muted);"></i> No reviews</div>`;
    }

    const isWishlisted = (typeof wishlist !== 'undefined' && wishlist.isInWishlist && wishlist.isInWishlist(p.id));

    return `
      <div class="p-card" onclick="openProductModal(${p.id})">
        ${badgeHtml}
        <i class="fa-solid fa-heart p-fav ${isWishlisted ? 'active' : ''}" onclick="event.stopPropagation(); if(typeof wishlist !== 'undefined' && wishlist.toggleWishlist) wishlist.toggleWishlist(${p.id}); else { this.classList.toggle('active'); showToast('Wishlist updated'); }"></i>
        <div class="p-img-wrapper skeleton" style="width:100%; height:120px; border-radius:10px; margin-bottom:10px; position:relative; overflow:hidden;">
          <img src="${getUnsplashUrl(p)}" loading="lazy" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; opacity:0; transition:opacity 0.3s;" onload="this.style.opacity=1; this.parentElement.classList.remove('skeleton');" onerror="if(this.parentElement) this.parentElement.classList.remove('skeleton'); if(this.src!=='/images/placeholder.png'){this.src='/images/placeholder.png';}else{this.onerror=null; this.outerHTML='<div class=\\'p-emoji\\' style=\\'font-size:3.8rem; text-align:center; line-height:120px; margin:0;\\'>${p.emoji}</div>';}">
        </div>
        <div class="p-viewers"><i class="fa-solid fa-eye"></i> ${p.viewers} viewing</div>
        <div class="p-name">${p.name}</div>
        <div class="p-weight">${p.weight}</div>
        ${rHtml}
        <div class="p-price-row">
          <div>
            <div class="p-old-price">₹${p.originalPrice}</div>
            <div class="p-price">₹${p.price}</div>
          </div>
          <div>${btnHtml}</div>
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = html;
}

function renderCombos() {
  const container = document.getElementById('combos-container');
  if(!container) return;
  
  let html = '';
  COMBOS.forEach(c => {
    html += `
      <div class="combo-card">
        <div style="font-size:2rem; margin-bottom:10px;">${c.emoji}</div>
        <h4 class="baloo" style="margin-bottom:5px;">${c.name}</h4>
        <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:10px;">${c.items.length} items included</div>
        <div style="display:flex; justify-content:space-between; align-items:flex-end;">
          <div>
            <span class="combo-old">₹${c.originalPrice}</span><br>
            <span class="combo-price">₹${c.totalPrice}</span>
          </div>
          <button class="btn btn-sm" style="width:auto;" onclick="addComboToCart('${c.id}')">Add Combo</button>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

let currentCategory = 'all';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Data
  if(typeof initAuth === 'function') initAuth();
  if(typeof initCart === 'function') initCart();
  if(typeof initGamification === 'function') initGamification();
  if(typeof initAdmin === 'function') initAdmin();
  if(typeof initReviews === 'function') initReviews();
  if(typeof initWishlist === 'function') initWishlist();

  // Instant render using INITIAL_PRODUCTS (optimistic UI)
  if(typeof renderCategories === 'function') renderCategories();
  if(typeof renderProducts === 'function') renderProducts();
  if(typeof renderCombos === 'function') renderCombos();

  // Render Checkin Calendar if available
  const calendarContainer = document.getElementById('daily-checkin-calendar');
  if(calendarContainer && typeof renderCheckinCalendar === 'function') {
    calendarContainer.innerHTML = renderCheckinCalendar();
  }

  // Render Saved Addresses
  if(typeof renderSavedAddresses === 'function') renderSavedAddresses();

  // Dark Mode Init
  const isDark = localStorage.getItem('sm_darkmode') === '1';
  if(isDark) document.body.classList.add('dark-mode');
  
  // Splash Screen
  setTimeout(() => {
    const splash = document.getElementById('splash');
    if(splash) {
      splash.style.opacity = '0';
      splash.style.pointerEvents = 'none';
      setTimeout(() => splash.classList.add('hidden'), 500);
      
      // Show onboarding if first time
      const obDone = localStorage.getItem('sm_ob_done');
      if(!obDone) {
        document.getElementById('onboarding').classList.remove('hidden');
      }
    }
  }, 2200);


  
  // Back to top button logic
  const mainContent = document.getElementById('main-content');
  const backTop = document.getElementById('back-top-btn');
  if(mainContent && backTop) {
    mainContent.addEventListener('scroll', () => {
      if(mainContent.scrollTop > 300) {
        backTop.classList.add('show');
      } else {
        backTop.classList.remove('show');
      }
    });
  }
});

// --- NAVIGATION ---
function navigate(page) {
  // Hide all sections
  document.getElementById('home-section')?.classList.add('hidden');
  document.getElementById('categories-section')?.classList.add('hidden');
  document.getElementById('cart-section')?.classList.add('hidden');
  document.getElementById('profile-section')?.classList.add('hidden');
  document.getElementById('admin-section')?.classList.add('hidden');
  document.getElementById('payment-section')?.classList.add('hidden');
  document.getElementById('order-placed-section')?.classList.add('hidden');
  document.getElementById('tracking-section')?.classList.add('hidden');
  
  // Update nav icons
  document.querySelectorAll('.nav-item, .sidebar-btn').forEach(btn => btn.classList.remove('active'));
  
  // Show target page
  switch(page) {
    case 'home':
      document.getElementById('home-section')?.classList.remove('hidden');
      activateNav('nav-home');
      break;
    case 'categories':
      document.getElementById('categories-section')?.classList.remove('hidden');
      activateNav('nav-cats');
      break;
    case 'cart':
      document.getElementById('cart-section')?.classList.remove('hidden');
      activateNav('nav-cart');
      if(typeof updateCartUI === 'function') updateCartUI();
      break;
    case 'profile':
      requireAuth(() => {
        document.getElementById('profile-section')?.classList.remove('hidden');
        activateNav('nav-profile');
        if(typeof updateProfileUI === 'function') updateProfileUI();
        renderOrderHistory();
      });
      break;
    case 'admin':
      if (typeof window.checkAdminRoute === 'function' && !window.checkAdminRoute()) {
        navigate('home');
        break;
      }
      document.getElementById('admin-section')?.classList.remove('hidden');
      break;
    case 'payment':
      document.getElementById('payment-section')?.classList.remove('hidden');
      break;
    case 'order-placed':
      document.getElementById('order-placed-section')?.classList.remove('hidden');
      break;
    case 'tracking':
      document.getElementById('tracking-section')?.classList.remove('hidden');
      break;
  }
  
  // Scroll to top
  const mainContent = document.getElementById('main-content');
  if(mainContent) mainContent.scrollTop = 0;
}

function activateNav(id) {
  document.querySelectorAll('.'+id).forEach(el => el.classList.add('active'));
}

function scrollToTop() {
  const mainContent = document.getElementById('main-content');
  if(mainContent) {
    mainContent.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// --- ONBOARDING ---
let obSlide = 1;
function nextSlide() {
  document.getElementById(`slide${obSlide}`).classList.remove('active');
  document.getElementById(`dot${obSlide}`).classList.remove('active');
  
  obSlide++;
  if(obSlide > 3) {
    finishOnboarding();
    return;
  }
  
  document.getElementById(`slide${obSlide}`).classList.add('active');
  document.getElementById(`dot${obSlide}`).classList.add('active');
}

function finishOnboarding() {
  document.getElementById('onboarding').classList.add('hidden');
  localStorage.setItem('sm_ob_done', '1');
}

// --- DARK MODE ---
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('sm_darkmode', isDark ? '1' : '0');
  
  // Update UI components showing theme status
  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  themeToggles.forEach(el => {
    if (isDark) {
      el.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
      el.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
  });
  
  showToast(isDark ? 'Sleek Dark Mode Active 🌙' : 'Fresh Light Mode Active ☀️', 'success');
}



// --- SEARCH ---
let searchTimeout = null;
function handleSearch(e) {
  const val = e.target.value;
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    renderProducts(val);
    if(val) {
      if(document.getElementById('home-section') && document.getElementById('home-section').classList.contains('hidden')) {
        navigate('home');
      }
    }
  }, 250);
}

// --- VOICE SEARCH ---
function startVoiceSearch() {
  if('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.start();
    showToast('Listening... Speak now');
    
    recognition.onresult = function(event) {
      const text = event.results[0][0].transcript;
      const inp = document.getElementById('main-search');
      if(inp) {
        inp.value = text;
        handleSearch({target: inp});
        showToast(`Searching for: ${text}`);
      }
    };
    
    recognition.onerror = function(event) {
      showToast('Voice recognition failed. Please type.');
    };
  } else {
    showToast('Voice search not supported in this browser');
  }
}

// --- MODALS ---
function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
}

function openProductModal(id, filter='latest') {
  const p = getProduct(id);
  if(!p) return;
  
  const m = document.getElementById('product-modal');
  const c = document.getElementById('pm-content');
  
  if(m && c) {
    let qty = cart[p.id] ? cart[p.id].qty : 0;
    let btnHtml = '';
    if(p.stock === 0) {
      btnHtml = `<button class="btn btn-secondary" disabled>Out of Stock</button>`;
    } else if(qty > 0) {
      btnHtml = `
        <div class="p-qty-ctrl" style="height:45px; width:100%; font-size:1.2rem;">
          <button style="width:40px;" onclick="updateQty(${p.id}, -1); setTimeout(()=>openProductModal(${p.id}), 50)">-</button>
          <span style="flex:1;">${qty} in Cart</span>
          <button style="width:40px;" onclick="updateQty(${p.id}, 1); setTimeout(()=>openProductModal(${p.id}), 50)">+</button>
        </div>
      `;
    } else {
      btnHtml = `<button class="btn" onclick="addToCart(${p.id}); openProductModal(${p.id})">Add to Cart - ₹${p.price}</button>`;
    }

    let pHtml = `
      <div class="p-img-wrapper skeleton" style="width:200px; height:200px; margin:20px auto; border-radius:20px; position:relative; overflow:hidden;">
        <img src="${getUnsplashUrl(p)}" loading="lazy" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; opacity:0; transition:opacity 0.3s;" onload="this.style.opacity=1; this.parentElement.classList.remove('skeleton');" onerror="if(this.parentElement) this.parentElement.classList.remove('skeleton'); if(this.src!=='/images/placeholder.png'){this.src='/images/placeholder.png';}else{this.onerror=null; this.outerHTML='<div style=\\'font-size:8rem; text-align:center; line-height:200px; margin:0; animation:float 3s infinite;\\'>${p.emoji}</div>';}">
      </div>
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
        <div>
          <h2 class="baloo" style="line-height:1.2;">${p.name}</h2>
          <div style="color:var(--text-muted); font-size:0.9rem; margin-top:5px;">${p.weight}</div>
        </div>
        <div style="text-align:right;">
          <div style="text-decoration:line-through; color:var(--text-muted); font-size:0.9rem;">₹${p.originalPrice}</div>
          <div style="font-size:1.6rem; font-weight:800; color:var(--secondary);">₹${p.price}</div>
        </div>
      </div>
      
      <div style="background:var(--secondary-light); padding:10px; border-radius:8px; display:flex; align-items:center; gap:10px; margin-bottom:20px; color:var(--secondary); font-size:0.85rem; font-weight:600;">
        <i class="fa-solid fa-bolt"></i> Delivery in 10 minutes
      </div>
      
      <div style="margin-bottom:20px;">
        ${btnHtml}
      </div>
      
      <div style="height:8px; background:var(--bg); margin:0 -20px;"></div>
      
      ${renderReviewsHTML(p.id, filter)}
    `;
    
    c.innerHTML = pHtml;
    m.classList.add('active');
  }
}

// --- CHECKOUT & PAYMENT ---
let currentOrderDetails = null;

function proceedToCheckout() {
  requireAuth(() => {
    if(getCartCount() === 0) {
      showToast("Cart is empty!");
      return;
    }
    
    // Prepare checkout details
    const totals = getCartTotals();
    const payContent = document.getElementById('payment-details-container');
    
    let html = `
      <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-weight:600;">
        <span>Amount to Pay</span>
        <span style="font-size:1.2rem; color:var(--secondary);" id="checkout-grand-total">₹${totals.grandTotal}</span>
      </div>
      <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:20px;">
        Includes ${getCartCount()} items
      </div>
    `;
    
    const userObj = JSON.parse(localStorage.getItem('sm_user'));
    if (userObj && userObj.isAnonymous) {
      html += `
        <div style="background:rgba(255,152,0,0.1); border:1px solid #FF9800; border-radius:12px; padding:12px; margin-bottom:20px; display:flex; align-items:center; justify-content:space-between; gap:10px;">
          <div style="flex:1; text-align:left;">
            <div style="font-weight:700; font-size:0.8rem; color:#E65100;">🔐 Login to Save History</div>
            <div style="font-size:0.7rem; color:var(--text-muted);">Save this order to your permanent profile!</div>
          </div>
          <button class="btn btn-sm" style="width:auto; padding:6px 12px; font-size:0.75rem; background:#FF9800; color:white; border:none;" onclick="openLoginModal()">Login</button>
        </div>
      `;
    }
    
    if(payContent) payContent.innerHTML = html;
    
    // Generate UPI QR
    const qrImg = document.querySelector('#upi-qr-box img');
    if (qrImg) {
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=9723415082@ptaxis&pn=JPsMart&am=${totals.grandTotal}&cu=INR`;
    }
    
    // Add WhatsApp Payment Confirm Button
    const qrBox = document.getElementById('upi-qr-box');
    if(qrBox && !document.getElementById('wa-pay-btn')) {
      const waBtn = document.createElement('div');
      waBtn.id = 'wa-pay-btn';
      waBtn.innerHTML = `<button class="btn" style="margin-top:15px; background:#25D366; color:white;" onclick="confirmUPIPaymentOnWA('${totals.grandTotal}')"><i class="fa-brands fa-whatsapp"></i> Confirm Payment on WA</button>`;
      qrBox.appendChild(waBtn);
    }
    
    currentOrderDetails = {
      id: 'SM' + Date.now().toString().slice(-6),
      date: new Date().toLocaleDateString(),
      itemsCount: getCartCount(),
      amount: totals.grandTotal,
      status: 'Processing',
      items: getCartItems().map(i => ({id: i.product.id, qty: i.qty, price: i.product.price}))
    };

    // Render slots and address
    if (typeof renderDeliverySlots === 'function') renderDeliverySlots();
    if (typeof autofillAddress === 'function') autofillAddress();
    
    navigate('payment');
  });
}

function selectPayment(id) {
  document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('selected'));
  const el = document.getElementById('pay-opt-' + id);
  if(el) el.classList.add('selected');
  
  const qrBox = document.getElementById('upi-qr-box');
  if(id === 'upi') {
    qrBox.classList.remove('hidden');
  } else {
    qrBox.classList.add('hidden');
  }
}

// Anand pincode ranges (380001 - 382481)
const AHMEDABAD_PINCODES = {
  min: 388001,
  max: 388001
};

function validatePincode(val) {
  const statusEl = document.getElementById('pincode-status');
  const msgEl = document.getElementById('pincode-msg');
  if (!statusEl || !msgEl) return true;
  
  const pin = parseInt(val);
  if (val.length < 6) {
    statusEl.style.background = '';
    statusEl.style.color = '';
    statusEl.innerText = '';
    msgEl.innerText = '';
    return false;
  }
  
  if (pin >= AHMEDABAD_PINCODES.min && pin <= AHMEDABAD_PINCODES.max) {
    statusEl.style.background = 'rgba(46,125,50,0.12)';
    statusEl.style.color = 'var(--secondary)';
    statusEl.innerText = '✓ Anand';
    msgEl.innerText = 'We deliver to your area!';
    msgEl.style.color = 'var(--secondary)';
    return true;
  } else {
    statusEl.style.background = 'rgba(211,47,47,0.12)';
    statusEl.style.color = '#D32F2F';
    statusEl.innerText = '✗ Outside Zone';
    msgEl.innerText = '⚠️ We only deliver within Anand (388001)';
    msgEl.style.color = '#D32F2F';
    return false;
  }
}

function copyUPI() {
  const upi = "9723415082@ptaxis";
  navigator.clipboard.writeText(upi).then(() => {
    showToast("UPI ID Copied!");
  });
}

let userOrders = [];

function initUserOrders() {
  if (!window.db || !window.fs) {
    window.addEventListener('firebaseReady', initUserOrders);
    return;
  }
  
  // Try to listen when auth state changes
  if(window.auth) {
    window.auth.onAuthStateChanged(user => {
      const { collection, onSnapshot, query, where, orderBy } = window.fs;
      const ordersRef = collection(window.db, "orders");
      const uid = user ? user.uid : "guest";
      
      const q = query(ordersRef, where("userId", "==", uid), orderBy("timestamp", "desc"));
      onSnapshot(q, (snapshot) => {
        userOrders = snapshot.docs.map(doc => doc.data());
        if(document.getElementById('profile-section') && !document.getElementById('profile-section').classList.contains('hidden')) {
          renderOrderHistory();
        }
      });
    });
  }
}
initUserOrders();

async function placeOrder() {
  // Collect address
  const addrName = document.getElementById('addr-name')?.value.trim();
  const addrStreet = document.getElementById('addr-street')?.value.trim();
  const addrPincode = document.getElementById('addr-pincode')?.value.trim();

  if (!addrName || !addrStreet || !addrPincode) {
    showToast('Please fill your delivery address');
    return;
  }

  if (!validatePincode(addrPincode)) {
    showToast('⚠️ We only deliver in Anand!');
    return;
  }

  const totals = getCartTotals();
  const paymentMethod = document.querySelector('.payment-option.selected')?.id === 'pay-opt-cod' ? 'COD' : 'UPI';
  
  const slotMapping = {
    'express': '⚡ Express (10 mins)',
    'morning': '🌅 Morning (8 AM - 12 PM)',
    'afternoon': '☀️ Afternoon (12 PM - 4 PM)',
    'evening': '🌇 Evening (4 PM - 8 PM)'
  };
  const selectedSlotId = (window.cartModule && window.cartModule.getDeliverySlot) ? window.cartModule.getDeliverySlot() : 'express';
  const deliverySlotText = slotMapping[selectedSlotId] || '⚡ Express (10 mins)';

  const orderData = {
    orderId: currentOrderDetails.id,
    userId: window.auth && window.auth.currentUser ? window.auth.currentUser.uid : "guest",
    customerName: addrName,
    customerPhone: window.auth && window.auth.currentUser ? window.auth.currentUser.phoneNumber : "guest",
    address: addrStreet + ', Anand - ' + addrPincode,
    pincode: addrPincode,
    deliverySlot: deliverySlotText,
    items: currentOrderDetails.items,
    subtotal: totals.subtotal,
    gst: totals.gst,
    deliveryCharge: totals.deliveryFee,
    discount: totals.couponDiscount + totals.buyMoreDiscount + totals.pointsDiscount,
    grandTotal: totals.grandTotal,
    paymentMethod: paymentMethod,
    paymentStatus: paymentMethod === 'UPI' ? "paid" : "pending",
    orderStatus: "placed",
    timestamp: window.fs ? window.fs.serverTimestamp() : new Date(),
    zone: "Anand"
  };

  if(window.db && window.fs) {
    await window.fs.setDoc(window.fs.doc(window.db, "orders", orderData.orderId), orderData);
  }
  
  if (window.analytics && window.logEvent) {
    window.logEvent(window.analytics, 'purchase', {
      transaction_id: orderData.orderId,
      value: orderData.grandTotal,
      currency: "INR",
      items: orderData.items.map(i => ({ item_id: i.id, quantity: i.qty }))
    });
  }

  
  // Earn points
  if(typeof earnFromOrder === 'function') earnFromOrder(currentOrderDetails.amount);
  
  // Generate Referral Code
  if(typeof generateReferralCode === 'function') {
    generateReferralCode(orderData.orderId);
  }
  
  // Clear Cart
  if(typeof clearCart === 'function') clearCart();
  
  // Show confirmation
  navigate('order-placed');
  
  // Render referral card on confirmation page
  if(typeof renderReferralCard === 'function') renderReferralCard();
  
  if(typeof throwConfetti === 'function') throwConfetti();
  
  // Send WhatsApp Order Confirmation
  const itemsList = orderData.items.map(i => {
    const p = getProduct(i.id);
    return `${i.qty}x ${p ? p.name : 'Product'}`;
  }).join(', ');
  
  const msg = `🛒 *JPs Mart - Order Confirmed!*

Order ID: ${orderData.orderId}
Items: ${itemsList}
Total: ₹${orderData.grandTotal}
Delivery: ${orderData.deliverySlot}
Address: ${orderData.address}

⚡ Delivering in 10 minutes!
Track: jps-mart.vercel.app`;

  const phone = orderData.customerPhone !== 'guest' ? orderData.customerPhone.replace('+91', '') : '9723415082';
  window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  
  // Start countdown
  let mins = 10;
  let secs = 0;
  const timerEl = document.getElementById('delivery-timer');
  
  const int = setInterval(() => {
    if(secs === 0) {
      if(mins === 0) {
        clearInterval(int);
        if(timerEl) timerEl.innerText = "00:00";
        showToast("Order Delivered!");
        return;
      }
      mins--;
      secs = 59;
    } else {
      secs--;
    }
    
    if(timerEl) {
      timerEl.innerText = `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
    }
  }, 1000);
}

function confirmUPIPaymentOnWA(amount) {
  const orderId = currentOrderDetails ? currentOrderDetails.id : 'SM' + Date.now().toString().slice(-6);
  const payMsg = `💳 *JPs Mart - Payment Done!*
Order ID: ${orderId}
Amount Paid: ₹${amount}
UPI ID: 9723415082@ptaxis`;

  window.open(`https://wa.me/919723415082?text=${encodeURIComponent(payMsg)}`, '_blank');
}

function trackOrder() {
  navigate('tracking');
  
  // Animate truck
  const truck = document.getElementById('track-truck');
  if(truck) {
    truck.style.transition = 'left 10s linear';
    setTimeout(() => {
      truck.style.left = '80%';
    }, 100);
  }
}

function renderOrderHistory() {
  const container = document.getElementById('order-history-list');
  if(!container) return;
  
  if(userOrders.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-muted);">No past orders</div>`;
    return;
  }
  
  let html = userOrders.map(o => {
    let dateStr = "Just now";
    if (o.timestamp && o.timestamp.toDate) {
      dateStr = o.timestamp.toDate().toLocaleDateString() + ' ' + o.timestamp.toDate().toLocaleTimeString();
    }
    return `
    <div class="order-item">
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <span style="font-weight:700;">Order #${o.orderId}</span>
        <span style="font-size:0.8rem; color:var(--text-muted);">${dateStr}</span>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
        <span style="font-size:0.85rem;">${o.items.length} items</span>
        <span style="font-weight:800;">₹${o.grandTotal}</span>
      </div>
      <div>
        <div class="status-dot"></div><span style="font-size:0.8rem; font-weight:600;">${o.orderStatus}</span>
      </div>
    </div>
  `}).join('');
  
  container.innerHTML = html;
}

// --- UTILS ---
function throwConfetti() {
  const colors = ['#FFD700', '#2E7D32', '#F57C00', '#D32F2F', '#1976D2'];
  for(let i=0; i<60; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.animationDuration = (Math.random() * 2 + 2) + 's';
    el.style.animationDelay = (Math.random() * 0.5) + 's';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
}

// --- FILTER SYSTEM ---
let filterPriceMin = 0;
let filterPriceMax = 10000;
let filterInStockOnly = false;
let sortBy = 'default';

function openFilterPanel() {
  document.getElementById('filter-panel')?.classList.add('active');
}

function closeFilterPanel() {
  document.getElementById('filter-panel')?.classList.remove('active');
}

function applyFilters() {
  const minVal = document.getElementById('price-min')?.value;
  const maxVal = document.getElementById('price-max')?.value;
  const inStockCheckbox = document.getElementById('filter-instock');
  const sortSelect = document.getElementById('sort-by');
  
  filterPriceMin = minVal ? parseFloat(minVal) : 0;
  filterPriceMax = maxVal ? parseFloat(maxVal) : 10000;
  filterInStockOnly = inStockCheckbox ? inStockCheckbox.checked : false;
  sortBy = sortSelect ? sortSelect.value : 'default';
  
  renderProducts();
  closeFilterPanel();
  showToast('Filters applied!', 'success');
}

function resetFilters() {
  const minEl = document.getElementById('price-min');
  const maxEl = document.getElementById('price-max');
  const inStockEl = document.getElementById('filter-instock');
  const sortEl = document.getElementById('sort-by');
  
  if (minEl) minEl.value = '';
  if (maxEl) maxEl.value = '';
  if (inStockEl) inStockEl.checked = false;
  if (sortEl) sortEl.value = 'default';
  
  filterPriceMin = 0;
  filterPriceMax = 10000;
  filterInStockOnly = false;
  sortBy = 'default';
  
  renderProducts();
  closeFilterPanel();
  showToast('Filters reset', 'info');
}

// --- DELIVERY SLOT PICKER ---
function selectDeliverySlot(slot) {
  if (window.cartModule && window.cartModule.setDeliverySlot) {
    window.cartModule.setDeliverySlot(slot);
  }
  renderDeliverySlots();
  
  // Re-run checkout UI totals update
  const totals = getCartTotals();
  const payTotalEl = document.getElementById('checkout-grand-total');
  if (payTotalEl) payTotalEl.innerText = `₹${totals.grandTotal}`;
  
  // Update bill summary in cart if visible
  if (typeof updateCartUI === 'function') updateCartUI();
}

function renderDeliverySlots() {
  const container = document.getElementById('delivery-slots-container');
  if(!container) return;
  
  const currentSlot = (window.cartModule && window.cartModule.getDeliverySlot) ? window.cartModule.getDeliverySlot() : 'express';
  
  const slots = [
    { id: 'express', name: '⚡ Express', time: '10 mins', fee: '+₹49 fee', active: currentSlot === 'express' },
    { id: 'morning', name: '🌅 Morning', time: '8 AM - 12 PM', fee: 'FREE', active: currentSlot === 'morning' },
    { id: 'afternoon', name: '☀️ Afternoon', time: '12 PM - 4 PM', fee: 'FREE', active: currentSlot === 'afternoon' },
    { id: 'evening', name: '🌇 Evening', time: '4 PM - 8 PM', fee: 'FREE', active: currentSlot === 'evening' }
  ];
  
  container.innerHTML = slots.map(s => `
    <div class="slot-card ${s.active ? 'active' : ''}" onclick="selectDeliverySlot('${s.id}')">
      <div style="font-weight:700; font-size:0.95rem;">${s.name}</div>
      <div style="font-size:0.8rem; color:var(--text-muted); margin:4px 0;">${s.time}</div>
      <div style="font-size:0.75rem; font-weight:600; color:var(--secondary);">${s.fee}</div>
    </div>
  `).join('');
}

// --- ADDRESS BOOK MANAGEMENT ---
function openAddressModal() {
  document.getElementById('address-modal')?.classList.add('active');
}

function closeAddressModal() {
  document.getElementById('address-modal')?.classList.remove('active');
}

function saveAddress() {
  const label = document.getElementById('addr-label-input')?.value.trim() || 'Home';
  const name = document.getElementById('addr-name-input')?.value.trim();
  const phone = document.getElementById('addr-phone-input')?.value.trim();
  const street = document.getElementById('addr-street-input')?.value.trim();
  const pincode = document.getElementById('addr-pincode-input')?.value.trim();

  if (!name || !phone || !street || !pincode) {
    showToast('Please fill all address fields', 'warning');
    return;
  }

  const user = JSON.parse(localStorage.getItem('sm_user'));
  if (!user) {
    showToast('User data missing', 'error');
    return;
  }

  if (!user.addresses) user.addresses = [];

  // Create new address object
  const newAddr = {
    label,
    name,
    phone,
    street,
    pincode,
    isDefault: user.addresses.length === 0 // Make default if first address
  };

  user.addresses.push(newAddr);
  localStorage.setItem('sm_user', JSON.stringify(user));
  
  // Save to Firestore if connected
  if (window.auth && window.auth.currentUser && window.db && window.fs) {
    const userRef = window.fs.doc(window.db, "users", window.auth.currentUser.uid);
    window.fs.setDoc(userRef, { addresses: user.addresses }, { merge: true })
      .then(() => console.log('Address synced with Firestore'))
      .catch(err => console.error('Error syncing address:', err));
  }

  closeAddressModal();
  renderSavedAddresses();
  
  // Clear inputs
  document.getElementById('addr-name-input').value = '';
  document.getElementById('addr-phone-input').value = '';
  document.getElementById('addr-street-input').value = '';
  document.getElementById('addr-pincode-input').value = '';

  showToast('Address saved successfully!', 'success');
}

function deleteAddress(index) {
  const user = JSON.parse(localStorage.getItem('sm_user'));
  if (user && user.addresses && user.addresses[index]) {
    const wasDefault = user.addresses[index].isDefault;
    user.addresses.splice(index, 1);
    
    // Reset default if we deleted default and have remaining addresses
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    localStorage.setItem('sm_user', JSON.stringify(user));

    if (window.auth && window.auth.currentUser && window.db && window.fs) {
      const userRef = window.fs.doc(window.db, "users", window.auth.currentUser.uid);
      window.fs.setDoc(userRef, { addresses: user.addresses }, { merge: true });
    }

    renderSavedAddresses();
    showToast('Address deleted', 'info');
  }
}

function selectAddress(index) {
  const user = JSON.parse(localStorage.getItem('sm_user'));
  if (user && user.addresses) {
    user.addresses.forEach((addr, i) => {
      addr.isDefault = (i === index);
    });
    localStorage.setItem('sm_user', JSON.stringify(user));

    if (window.auth && window.auth.currentUser && window.db && window.fs) {
      const userRef = window.fs.doc(window.db, "users", window.auth.currentUser.uid);
      window.fs.setDoc(userRef, { addresses: user.addresses }, { merge: true });
    }

    renderSavedAddresses();
    autofillAddress();
    showToast('Default address set', 'success');
  }
}

function renderSavedAddresses() {
  const container = document.getElementById('saved-addresses-list');
  if (!container) return;

  const user = JSON.parse(localStorage.getItem('sm_user'));
  if (!user || !user.addresses || user.addresses.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:15px; color:var(--text-muted); font-size:0.85rem;">No saved addresses yet.</div>`;
    return;
  }

  container.innerHTML = user.addresses.map((addr, idx) => `
    <div class="address-card ${addr.isDefault ? 'default' : ''}" style="position:relative; margin-bottom:10px; padding:12px; border-radius:10px; border:1px solid ${addr.isDefault ? 'var(--secondary)' : 'var(--border)'}; background:var(--bg-card);">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span class="address-type" style="font-size:0.75rem; font-weight:700; color:var(--secondary); background:var(--secondary-light); padding:2px 8px; border-radius:12px;">${addr.label}</span>
        <div class="address-actions" style="display:flex; gap:8px;">
          ${!addr.isDefault ? `<button style="background:none; border:none; color:var(--secondary); font-size:0.8rem; cursor:pointer;" onclick="selectAddress(${idx})">Set Default</button>` : '<span style="font-size:0.75rem; font-weight:600; color:var(--secondary);">[Default]</span>'}
          <button style="background:none; border:none; color:#D32F2F; font-size:0.8rem; cursor:pointer;" onclick="deleteAddress(${idx})"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
      <div style="font-weight:600; font-size:0.9rem; margin-top:8px;">${addr.name}</div>
      <div style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">${addr.phone}</div>
      <div style="font-size:0.8rem; margin-top:4px;">${addr.street}</div>
      <div style="font-size:0.8rem; font-weight:600;">Pin: ${addr.pincode}</div>
    </div>
  `).join('');
}

function autofillAddress() {
  const user = JSON.parse(localStorage.getItem('sm_user'));
  if (user && user.addresses && user.addresses.length > 0) {
    const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
    
    const nameInput = document.getElementById('addr-name');
    const streetInput = document.getElementById('addr-street');
    const pincodeInput = document.getElementById('addr-pincode');
    
    if (nameInput) nameInput.value = defaultAddr.name || user.name || '';
    if (streetInput) streetInput.value = defaultAddr.street || '';
    if (pincodeInput) {
      pincodeInput.value = defaultAddr.pincode || '';
      validatePincode(defaultAddr.pincode);
    }
  }
}

// --- IMPROVED TOAST SYSTEM WITH TYPES ---
function showToast(msg, type = 'info') {
  const div = document.createElement('div');
  div.className = `toast toast-${type}`;
  
  let icon = '<i class="fa-solid fa-info-circle" style="color:var(--text-muted);"></i>';
  if (type === 'success') icon = '<i class="fa-solid fa-circle-check" style="color:#2E7D32;"></i>';
  if (type === 'error') icon = '<i class="fa-solid fa-circle-xmark" style="color:#D32F2F;"></i>';
  if (type === 'warning') icon = '<i class="fa-solid fa-triangle-exclamation" style="color:#FF9800;"></i>';

  div.innerHTML = `<div style="display:flex; align-items:center; gap:8px;">${icon} <span>${msg}</span></div>`;
  document.body.appendChild(div);
  
  setTimeout(() => {
    div.style.opacity = '0';
    setTimeout(() => div.remove(), 300);
  }, 2500);
}
