// js/admin.js

let isAdmin = false;
let adminOrders = JSON.parse(localStorage.getItem('sm_adminOrders')) || [];
let customProducts = JSON.parse(localStorage.getItem('sm_customProducts')) || [];

function initAdmin() {
  isAdmin = sessionStorage.getItem('sm_isAdmin') === 'true';
  customProducts = JSON.parse(localStorage.getItem('sm_customProducts')) || [];
  
  if (!window.db || !window.fs) {
    window.addEventListener('firebaseReady', initAdmin);
    return;
  }
  
  // Real-time admin orders
  if(isAdmin) {
    const { collection, onSnapshot, query, orderBy } = window.fs;
    const q = query(collection(window.db, "orders"), orderBy("timestamp", "desc"));
    onSnapshot(q, (snapshot) => {
      adminOrders = snapshot.docs.map(doc => doc.data());
      if(document.getElementById('admin-section') && !document.getElementById('admin-section').classList.contains('hidden')) {
        renderAdminDashboard();
      }
    });

    const usersQ = query(collection(window.db, "users"));
    onSnapshot(usersQ, (snapshot) => {
      window.adminUsers = snapshot.docs.map(doc => doc.data());
      if(document.getElementById('admin-section') && !document.getElementById('admin-section').classList.contains('hidden')) {
        renderAdminDashboard();
      }
    });

    const couponsQ = query(collection(window.db, "coupons"));
    onSnapshot(couponsQ, (snapshot) => {
      window.adminCoupons = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if(document.getElementById('admin-section') && !document.getElementById('admin-section').classList.contains('hidden')) {
        renderAdminDashboard();
      }
    });
  }
  
  // Merge custom products into main PRODUCTS array
  if(customProducts.length > 0 && typeof PRODUCTS !== 'undefined') {
    customProducts.forEach(cp => {
      if(!PRODUCTS.find(p => p.id === cp.id)) {
        PRODUCTS.unshift(cp);
      }
    });
  }
}

async function hashPassword(msg) {
  const encoder = new TextEncoder();
  const data = encoder.encode(msg);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function openAdminLogin() {
  // Check timeout
  const lastLogin = parseInt(sessionStorage.getItem('sm_adminTime') || '0');
  if (isAdmin && (Date.now() - lastLogin > 2 * 60 * 60 * 1000)) {
    isAdmin = false;
    sessionStorage.removeItem('sm_isAdmin');
    showToast('Admin session expired');
  }

  if(isAdmin) {
    renderAdminDashboard();
    navigate('admin');
    return;
  }
  
  // Rate limiting
  let attempts = parseInt(localStorage.getItem('sm_adminAttempts') || '0');
  let lockTime = parseInt(localStorage.getItem('sm_adminLock') || '0');
  
  if (Date.now() < lockTime) {
    const minsLeft = Math.ceil((lockTime - Date.now()) / 60000);
    showToast(`Too many attempts. Try again in ${minsLeft} mins.`);
    return;
  }
  
  const u = prompt("Enter Admin Username:");
  if(u === 'Jeel') {
    const p = prompt("Enter Password:");
    
    // Hash check
    const pHash = await hashPassword(p);
    const targetHash = await hashPassword('Jeel_Patel@2536');
    
    if(pHash === targetHash) {
      isAdmin = true;
      sessionStorage.setItem('sm_isAdmin', 'true');
      sessionStorage.setItem('sm_adminTime', Date.now().toString());
      localStorage.setItem('sm_adminAttempts', '0'); // Reset
      showToast('Admin access granted');
      renderAdminDashboard();
      navigate('admin');
    } else {
      attempts++;
      if (attempts >= 3) {
        localStorage.setItem('sm_adminLock', (Date.now() + 30 * 60 * 1000).toString());
        localStorage.setItem('sm_adminAttempts', '0');
        showToast('Locked out for 30 minutes.');
      } else {
        localStorage.setItem('sm_adminAttempts', attempts.toString());
        showToast(`Invalid password. ${3 - attempts} attempts left.`);
      }
    }
  } else if (u !== null) {
    attempts++;
    if (attempts >= 3) {
      localStorage.setItem('sm_adminLock', (Date.now() + 30 * 60 * 1000).toString());
      localStorage.setItem('sm_adminAttempts', '0');
      showToast('Locked out for 30 minutes.');
    } else {
      localStorage.setItem('sm_adminAttempts', attempts.toString());
      showToast('Access denied');
    }
  }
}

function renderAdminDashboard() {
  const content = document.getElementById('admin-content');
  if(!content) return;
  
  const rev = getRevenue();
  const ordersCount = adminOrders.length;
  const prodCount = PRODUCTS.length;
  const users = window.adminUsers || [];
  const coupons = window.adminCoupons || [];
  const lowStockProducts = PRODUCTS.filter(p => p.stock > 0 && p.stock < 10);
  const outOfStockProducts = PRODUCTS.filter(p => p.stock === 0);
  
  let html = `
    <div class="page-header">
      <div class="back-btn" onclick="navigate('home')"><i class="fa-solid fa-arrow-left"></i></div>
      <h2 class="baloo">Admin Dashboard</h2>
    </div>
    
    <div style="padding:20px;">
      <!-- Stats Row -->
      <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:14px; margin-bottom:20px;">
        <div style="background:var(--bg-card); padding:20px; border-radius:var(--radius-md); box-shadow:var(--shadow-sm); border:1px solid var(--border);">
          <div style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">Total Revenue</div>
          <div style="font-size:1.6rem; font-weight:800; color:var(--secondary); margin-top:5px;">₹${rev}</div>
        </div>
        <div style="background:var(--bg-card); padding:20px; border-radius:var(--radius-md); box-shadow:var(--shadow-sm); border:1px solid var(--border);">
          <div style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">Total Orders</div>
          <div style="font-size:1.6rem; font-weight:800; color:var(--text); margin-top:5px;">${ordersCount}</div>
        </div>
        <div style="background:var(--bg-card); padding:20px; border-radius:var(--radius-md); box-shadow:var(--shadow-sm); border:1px solid var(--border);">
          <div style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">Total Products</div>
          <div style="font-size:1.6rem; font-weight:800; color:var(--text); margin-top:5px;">${prodCount}</div>
        </div>
      </div>
      
      <!-- Add Product Form -->
      <div style="background:var(--bg-card); padding:20px; border-radius:var(--radius-md); box-shadow:var(--shadow-sm); border:1px solid var(--border); margin-bottom:20px;">
        <h3 class="baloo" style="margin-bottom:15px;">Add New Product</h3>
        <div style="display:grid; grid-template-columns:1fr; gap:10px;">
          <input type="text" id="adm-p-name" placeholder="Product Name" style="padding:10px; border-radius:8px; border:1px solid var(--border); background:var(--bg); color:var(--text);">
          <div style="display:flex; gap:10px;">
            <input type="text" id="adm-p-emoji" placeholder="Emoji (e.g. 🍎)" style="padding:10px; border-radius:8px; border:1px solid var(--border); background:var(--bg); color:var(--text); flex:1;">
            <select id="adm-p-cat" style="padding:10px; border-radius:8px; border:1px solid var(--border); background:var(--bg); color:var(--text); flex:2;">
              ${CATEGORIES.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </select>
          </div>
          <div style="display:flex; gap:10px;">
            <input type="number" id="adm-p-price" placeholder="Price (₹)" style="padding:10px; border-radius:8px; border:1px solid var(--border); background:var(--bg); color:var(--text); flex:1;">
            <input type="number" id="adm-p-orig" placeholder="Orig Price" style="padding:10px; border-radius:8px; border:1px solid var(--border); background:var(--bg); color:var(--text); flex:1;">
          </div>
          <div style="display:flex; gap:10px;">
            <input type="text" id="adm-p-wt" placeholder="Weight (e.g. 500g)" style="padding:10px; border-radius:8px; border:1px solid var(--border); background:var(--bg); color:var(--text); flex:1;">
            <input type="number" id="adm-p-stock" placeholder="Stock" style="padding:10px; border-radius:8px; border:1px solid var(--border); background:var(--bg); color:var(--text); flex:1;">
          </div>
          <button class="btn" style="margin-top:5px;" onclick="handleAddProduct()">Add Product</button>
        </div>
      </div>
      
      <!-- Coupon Manager -->
      <div style="background:var(--bg-card); padding:20px; border-radius:var(--radius-md); box-shadow:var(--shadow-sm); border:1px solid var(--border); margin-bottom:20px;">
        <h3 class="baloo" style="margin-bottom:15px;">Coupon Manager</h3>
        <div style="display:grid; grid-template-columns:1fr; gap:10px; margin-bottom:15px;">
          <input type="text" id="adm-c-code" placeholder="Coupon Code (e.g. SUMMER50)" style="padding:10px; border-radius:8px; border:1px solid var(--border); background:var(--bg); color:var(--text);">
          <div style="display:flex; gap:10px;">
            <select id="adm-c-type" style="padding:10px; border-radius:8px; border:1px solid var(--border); background:var(--bg); color:var(--text); flex:1;">
              <option value="percent">Percentage %</option>
              <option value="flat">Flat ₹</option>
              <option value="freeShip">Free Shipping</option>
            </select>
            <input type="number" id="adm-c-val" placeholder="Value" style="padding:10px; border-radius:8px; border:1px solid var(--border); background:var(--bg); color:var(--text); flex:1;">
          </div>
          <div style="display:flex; gap:10px;">
            <input type="number" id="adm-c-max" placeholder="Max Discount (₹)" style="padding:10px; border-radius:8px; border:1px solid var(--border); background:var(--bg); color:var(--text); flex:1;">
            <input type="date" id="adm-c-exp" style="padding:10px; border-radius:8px; border:1px solid var(--border); background:var(--bg); color:var(--text); flex:1;">
          </div>
          <button class="btn" style="margin-top:5px;" onclick="handleAddCoupon()">Add Coupon</button>
        </div>
        <div style="max-height:150px; overflow-y:auto; border-top:1px solid var(--border); padding-top:10px;">
          ${coupons.length === 0 ? '<div style="color:var(--text-muted); font-size:0.85rem;">No coupons found</div>' : coupons.map(c => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px dashed var(--border);">
              <div>
                <span style="font-weight:700; color:var(--secondary);">${c.code}</span>
                <span style="font-size:0.75rem; color:var(--text-muted); margin-left:5px;">${c.type} (${c.value})</span>
              </div>
              <button onclick="deleteCoupon('${c.id}')" style="background:none; border:none; color:#D32F2F; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Low Stock Alerts -->
      <h3 class="baloo" style="margin-bottom:10px;">Low Stock Alerts</h3>
      <div style="background:var(--bg-card); border-radius:var(--radius-md); box-shadow:var(--shadow-sm); border:1px solid var(--border); overflow:hidden; margin-bottom:20px; padding:10px;">
        ${outOfStockProducts.length === 0 && lowStockProducts.length === 0 ? '<div style="color:var(--text-muted); padding:10px;">Stock levels look good!</div>' : ''}
        ${outOfStockProducts.map(p => `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 5px; color:#D32F2F; font-weight:600; font-size:0.85rem; border-bottom:1px dashed var(--border);">
            <span>🚨 Out of Stock: ${p.name}</span>
            <button onclick="toggleStock(${p.id})" style="padding:4px 8px; border-radius:4px; font-size:0.7rem; background:var(--bg); border:1px solid var(--border); cursor:pointer;">Restock</button>
          </div>
        `).join('')}
        ${lowStockProducts.map(p => `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 5px; color:#F57C00; font-weight:600; font-size:0.85rem; border-bottom:1px dashed var(--border);">
            <span>⚠️ Low Stock: ${p.name} (${p.stock} left)</span>
            <button onclick="toggleStock(${p.id})" style="padding:4px 8px; border-radius:4px; font-size:0.7rem; background:var(--bg); border:1px solid var(--border); cursor:pointer;">Restock</button>
          </div>
        `).join('')}
      </div>
      
      <!-- Products Table -->
      <h3 class="baloo" style="margin-bottom:10px;">Products List</h3>
      <div style="background:var(--bg-card); border-radius:var(--radius-md); box-shadow:var(--shadow-sm); border:1px solid var(--border); overflow:hidden; margin-bottom:20px;">
        <div style="max-height:300px; overflow-y:auto;">
          ${PRODUCTS.map(p => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 15px; border-bottom:1px solid var(--border);">
              <div style="display:flex; align-items:center; gap:10px;">
                <span style="font-size:1.5rem;">${p.emoji}</span>
                <div>
                  <div style="font-weight:600; font-size:0.85rem;">${p.name}</div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">₹${p.price} | Stock: <span style="${p.stock===0?'color:red':''}">${p.stock}</span></div>
                </div>
              </div>
              <div style="display:flex; gap:8px;">
                <button onclick="toggleStock(${p.id})" style="padding:6px 10px; border-radius:6px; background:var(--bg); border:1px solid var(--border); color:var(--text); cursor:pointer;">${p.stock===0?'Restock':'OOS'}</button>
                <button onclick="deleteProduct(${p.id})" style="padding:6px 10px; border-radius:6px; background:#ffebee; border:1px solid #ffcdd2; color:#D32F2F; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- Orders List -->
      <h3 class="baloo" style="margin-bottom:10px;">Recent Orders</h3>
      <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
        ${adminOrders.length === 0 ? '<div style="padding:20px; text-align:center; color:var(--text-muted); background:var(--bg-card); border-radius:10px;">No orders yet</div>' : 
          adminOrders.map(o => {
            let dateStr = "Just now";
            if (o.timestamp && o.timestamp.toDate) {
              dateStr = o.timestamp.toDate().toLocaleDateString() + ' ' + o.timestamp.toDate().toLocaleTimeString();
            }
            return `
          <div style="background:var(--bg-card); padding:15px; border-radius:var(--radius-md); border:1px solid var(--border);">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <span style="font-weight:700;">#${o.orderId}</span>
              <span style="font-size:0.8rem; color:var(--text-muted);">${dateStr}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
              <span style="font-size:0.85rem;">${o.items.length} items</span>
              <span style="font-weight:800; color:var(--secondary);">₹${o.grandTotal}</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <select onchange="updateOrderStatus('${o.orderId}', this.value)" style="padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:700; border:1px solid var(--border); background:var(--bg); color:var(--text);">
                <option value="placed" ${o.orderStatus==='placed'?'selected':''}>Placed</option>
                <option value="packed" ${o.orderStatus==='packed'?'selected':''}>Packed</option>
                <option value="dispatched" ${o.orderStatus==='dispatched'?'selected':''}>Dispatched</option>
                <option value="delivered" ${o.orderStatus==='delivered'?'selected':''}>Delivered</option>
              </select>
            </div>
          </div>
        `}).join('')}
      </div>

      <!-- Customer List -->
      <h3 class="baloo" style="margin-bottom:10px;">Customers</h3>
      <div style="background:var(--bg-card); border-radius:var(--radius-md); box-shadow:var(--shadow-sm); border:1px solid var(--border); overflow:hidden; margin-bottom:20px;">
        <div style="max-height:300px; overflow-y:auto;">
          ${users.length === 0 ? '<div style="padding:15px; color:var(--text-muted); text-align:center;">No users found</div>' : users.map(u => `
            <div style="padding:12px 15px; border-bottom:1px solid var(--border); display:flex; align-items:center; gap:10px;">
              <div class="avatar-circle" style="width:40px; height:40px; font-size:1.2rem; min-width:40px;">${(u.name || 'G').charAt(0).toUpperCase()}</div>
              <div>
                <div style="font-weight:700; font-size:0.9rem;">${u.name || 'Guest User'}</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${u.phone || u.email || 'No contact'}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  
  content.innerHTML = html;
}

async function handleAddProduct() {
  const name = document.getElementById('adm-p-name').value.trim();
  const emoji = document.getElementById('adm-p-emoji').value.trim();
  const cat = document.getElementById('adm-p-cat').value;
  const price = parseInt(document.getElementById('adm-p-price').value);
  const orig = parseInt(document.getElementById('adm-p-orig').value) || price;
  const wt = document.getElementById('adm-p-wt').value.trim();
  const stock = parseInt(document.getElementById('adm-p-stock').value) || 100;
  
  if(!name || !emoji || !price || !wt) {
    showToast('Please fill all required fields');
    return;
  }
  
  const newP = {
    id: Date.now(),
    name: name,
    emoji: emoji,
    category: cat,
    price: price,
    originalPrice: orig,
    weight: wt,
    stock: stock,
    badge: 'NEW',
    viewers: 5
  };
  
  if (window.db && window.fs) {
    try {
      await window.fs.setDoc(window.fs.doc(window.db, "products", newP.id.toString()), newP);
      showToast('Product added successfully!');
    } catch (e) {
      console.error(e);
      showToast('Error adding product');
    }
  }
}

async function handleAddCoupon() {
  const code = document.getElementById('adm-c-code').value.trim().toUpperCase();
  const type = document.getElementById('adm-c-type').value;
  const val = parseFloat(document.getElementById('adm-c-val').value) || 0;
  const max = parseFloat(document.getElementById('adm-c-max').value) || 0;
  const exp = document.getElementById('adm-c-exp').value;
  
  if(!code) {
    showToast('Please enter coupon code');
    return;
  }
  
  const newC = {
    code: code,
    type: type,
    value: val,
    maxDiscount: max,
    expiryDate: exp,
    enabled: true,
    uses: 0
  };
  
  if (window.db && window.fs) {
    try {
      await window.fs.setDoc(window.fs.doc(window.db, "coupons", code), newC);
      showToast('Coupon added successfully!');
    } catch (e) {
      console.error(e);
      showToast('Error adding coupon');
    }
  }
}

async function deleteCoupon(id) {
  if(!confirm("Delete this coupon?")) return;
  if (window.db && window.fs) {
    try {
      await window.fs.deleteDoc(window.fs.doc(window.db, "coupons", id));
      showToast('Coupon deleted');
    } catch(e) {
      console.error(e);
      showToast('Error deleting coupon');
    }
  }
}

async function deleteProduct(id) {
  if(!confirm("Delete this product?")) return;
  if (window.db && window.fs) {
    try {
      await window.fs.deleteDoc(window.fs.doc(window.db, "products", id.toString()));
      showToast('Product deleted');
    } catch(e) {
      console.error(e);
      showToast('Error deleting product');
    }
  }
}

async function toggleStock(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if(p && window.db && window.fs) {
    try {
      const newStock = p.stock === 0 ? 100 : 0;
      await window.fs.updateDoc(window.fs.doc(window.db, "products", id.toString()), { stock: newStock });
      showToast('Stock updated');
    } catch(e) {
      console.error(e);
      showToast('Error updating stock');
    }
  }
}

async function updateOrderStatus(id, status) {
  if(window.db && window.fs) {
    try {
      await window.fs.updateDoc(window.fs.doc(window.db, "orders", id.toString()), { orderStatus: status });
      showToast('Order status updated');
    } catch(e) {
      console.error(e);
      showToast('Error updating status');
    }
  }
}

function getRevenue() {
  return adminOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
}

// Security Guard for admin routing
window.checkAdminRoute = function() {
  const isFirebaseAdmin = window.auth && window.auth.currentUser && window.auth.currentUser.admin === true;
  const user = typeof getUser === 'function' ? getUser() : null;
  const isAuthAdmin = user && user.admin === true;
  if (!isAdmin && !isAuthAdmin && !isFirebaseAdmin) {
    console.warn("Unauthorized navigation attempt to admin panel");
    showToast("Access Denied: Admin only.");
    return false;
  }
  return true;
};
