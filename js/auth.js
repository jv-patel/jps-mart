// js/auth.js

let currentUser = JSON.parse(localStorage.getItem('sm_user')) || null;
let isGuest = sessionStorage.getItem('sm_guest') === '1';

function initAuth() {
  currentUser = JSON.parse(localStorage.getItem('sm_user')) || null;
  isGuest = sessionStorage.getItem('sm_guest') === '1';
  
  if (!currentUser) {
    if (window.auth) {
      ensureAnonymousLogin();
    } else {
      window.addEventListener('firebaseReady', ensureAnonymousLogin);
    }
  }
  
  if (typeof updateProfileUI === 'function') {
    updateProfileUI();
  }
}

async function ensureAnonymousLogin() {
  if (window.auth && !window.auth.currentUser) {
    try {
      const userCredential = await window.fbAuth.signInAnonymously(window.auth);
      const user = userCredential.user;
      console.log("Signed in anonymously as:", user.uid);
      if (!localStorage.getItem('sm_user')) {
        currentUser = { 
          uid: user.uid, 
          name: 'Guest User', 
          phone: '', 
          email: '', 
          addresses: [], 
          isAnonymous: true 
        };
        localStorage.setItem('sm_user', JSON.stringify(currentUser));
        isGuest = true;
        sessionStorage.setItem('sm_guest', '1');
        updateProfileUI();
      }
    } catch (error) {
      console.error("Anonymous auth error:", error);
    }
  }
}

function isLoggedIn() {
  return currentUser !== null && !currentUser.isAnonymous;
}

function getUser() {
  return currentUser;
}

function openLoginModal() {
  const modal = document.getElementById('auth-modal');
  if(modal) {
    modal.classList.add('active');
    document.getElementById('auth-step1').classList.remove('hidden');
    document.getElementById('auth-step2').classList.add('hidden');
    document.getElementById('login-phone').value = '';
    document.getElementById('login-otp').value = '';
  }
}

function closeLoginModal() {
  const modal = document.getElementById('auth-modal');
  if(modal) {
    modal.classList.remove('active');
  }
}

function initRecaptcha() {
  if (window.recaptchaVerifier) {
    try { window.recaptchaVerifier.clear(); } catch(e) {}
    window.recaptchaVerifier = null;
  }

  if (window.fbAuth && window.auth) {
    try {
      let rcDiv = document.getElementById('recaptcha-container');
      if (!rcDiv) {
        rcDiv = document.createElement('div');
        rcDiv.id = 'recaptcha-container';
        document.body.appendChild(rcDiv);
      }

      window.recaptchaVerifier = new window.fbAuth.RecaptchaVerifier(
        window.auth,
        'recaptcha-container',
        { 'size': 'invisible' }
      );
    } catch(e) {
      console.error("Recaptcha init error:", e);
    }
  }
}

function resetRecaptchaVerifier() {
  if (window.recaptchaVerifier) {
    try { window.recaptchaVerifier.clear(); } catch(e) {}
    window.recaptchaVerifier = null;
  }
}

let otpTimerInterval;
let otpTimeLeft = 60;
let failedAttempts = 0;

async function sendOTP(isResend = false) {
  let phone = document.getElementById('login-phone').value;
  if(phone.length < 10) {
    showToast('Enter a valid 10-digit phone number', 'error');
    return;
  }
  if (!phone.startsWith('+91')) {
    phone = '+91' + phone;
  }
  
  if(!window.fbAuth || !window.auth) {
    showToast('Firebase not initialized yet', 'error');
    return;
  }

  const sendBtn = isResend ? document.getElementById('resend-otp-btn') : document.getElementById('send-otp-btn');
  const originalText = sendBtn.innerText;
  sendBtn.innerText = 'OTP bheja ja raha hai...';
  sendBtn.style.pointerEvents = 'none';
  
  initRecaptcha();
  
  try {
    const confirmationResult = await window.fbAuth.signInWithPhoneNumber(window.auth, phone, window.recaptchaVerifier);
    window.confirmationResult = confirmationResult;
    document.getElementById('otp-phone-label').innerText = phone;
    document.getElementById('auth-step1').classList.add('hidden');
    document.getElementById('auth-step2').classList.remove('hidden');
    showToast('OTP sent securely via SMS', 'success');
    
    failedAttempts = 0;
    startOTPTimer();
    
    sendBtn.innerText = originalText;
    sendBtn.style.pointerEvents = 'auto';
  } catch (error) {
    console.error("SMS Error:", error);
    sendBtn.innerText = originalText;
    sendBtn.style.pointerEvents = 'auto';
    
    if (error.code === 'auth/invalid-phone-number') {
      showToast('Invalid phone number format.', 'error');
    } else if (error.code === 'auth/too-many-requests') {
      showToast('Too many requests. Please try again later.', 'error');
    } else {
      showToast('DEBUG: ' + (error.code || 'no-code') + ' | ' + (error.message || 'no-message'), 'error');
    }

    if (window.recaptchaVerifier) {
      try { window.recaptchaVerifier.clear(); } catch(e) {}
      window.recaptchaVerifier = null;
    }
  }
}

function startOTPTimer() {
  clearInterval(otpTimerInterval);
  otpTimeLeft = 60;
  
  document.getElementById('resend-otp-btn').classList.add('hidden');
  document.getElementById('otp-timer').classList.remove('hidden');
  document.getElementById('timer-count').innerText = otpTimeLeft;
  
  otpTimerInterval = setInterval(() => {
    otpTimeLeft--;
    document.getElementById('timer-count').innerText = otpTimeLeft;
    
    if (otpTimeLeft <= 0) {
      clearInterval(otpTimerInterval);
      document.getElementById('otp-timer').classList.add('hidden');
      document.getElementById('resend-otp-btn').classList.remove('hidden');
    }
  }, 1000);
}

async function verifyOTP() {
  if (failedAttempts >= 3) {
    showToast('Account locked for security. Please request a new OTP.', 'error');
    return;
  }

  const otp = document.getElementById('login-otp').value;
  if(otp.length !== 6) {
    showToast('Enter a valid 6-digit OTP', 'warning');
    return;
  }
  
  if (otpTimeLeft <= 0 && document.getElementById('otp-timer').classList.contains('hidden')) {
    showToast('OTP has expired. Please resend.', 'error');
    return;
  }

  const verifyBtn = document.getElementById('verify-otp-btn');
  const originalText = verifyBtn.innerText;
  verifyBtn.innerText = 'Verifying...';
  verifyBtn.style.pointerEvents = 'none';
  
  try {
    const result = await window.confirmationResult.confirm(otp);
    const user = result.user;
    
    const oldAnonUid = currentUser ? currentUser.uid : null;
    
    currentUser = { 
      uid: user.uid, 
      phone: user.phoneNumber, 
      name: currentUser && currentUser.name !== 'Guest User' ? currentUser.name : '', 
      email: currentUser ? (currentUser.email || '') : '', 
      photoURL: currentUser ? (currentUser.photoURL || '') : '',
      addresses: currentUser ? (currentUser.addresses || []) : [],
      isAnonymous: false 
    };
    localStorage.setItem('sm_user', JSON.stringify(currentUser));
    
    // Save/update user profile in Firestore
    if (window.db && window.fs) {
      try {
        const userRef = window.fs.doc(window.db, "users", currentUser.uid);
        await window.fs.setDoc(userRef, {
          uid: currentUser.uid,
          name: currentUser.name,
          phone: currentUser.phone,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          addresses: currentUser.addresses
        }, { merge: true });
        console.log("User details successfully saved to Firestore");
      } catch (dbErr) {
        console.error("Error saving user to Firestore:", dbErr);
      }
    }

    isGuest = false;
    sessionStorage.removeItem('sm_guest');
    
    if (oldAnonUid && user.uid && oldAnonUid !== user.uid) {
      await migrateAnonymousOrders(oldAnonUid, user.uid);
    }
    
    closeLoginModal();
    showToast('Login successful!', 'success');
    
    if (window.analytics && window.logEvent) {
      window.logEvent(window.analytics, 'login', { method: 'phone' });
    }
    
    if (typeof updateProfileUI === 'function') updateProfileUI();
    if (typeof proceedToCheckout === 'function' && !document.getElementById('payment-section').classList.contains('hidden')) {
      proceedToCheckout(); // Refresh checkout
    }
    
    if (window._authCallback) {
      window._authCallback();
      window._authCallback = null;
    }
    
    verifyBtn.innerText = originalText;
    verifyBtn.style.pointerEvents = 'auto';
    clearInterval(otpTimerInterval);
  } catch (error) {
    console.error("Verify Error:", error);
    failedAttempts++;
    verifyBtn.innerText = originalText;
    verifyBtn.style.pointerEvents = 'auto';
    
    if (error.code === 'auth/invalid-verification-code') {
      showToast(`Invalid OTP. Attempts left: ${3 - failedAttempts}`, 'error');
    } else if (error.code === 'auth/code-expired') {
      showToast('OTP expired. Please click Resend.', 'error');
    } else {
      showToast('Verification failed. Try again.', 'error');
    }
  }
}

async function loginWithGoogle() {
  if (!window.fbAuth || !window.auth) {
    showToast('Firebase not initialized yet');
    return;
  }
  const provider = new window.fbAuth.GoogleAuthProvider();
  try {
    let user;
    const currentAnonUser = window.auth.currentUser;
    
    if (currentAnonUser && currentAnonUser.isAnonymous) {
      try {
        console.log("Linking anonymous user to Google account...");
        const result = await window.fbAuth.linkWithPopup(currentAnonUser, provider);
        user = result.user;
        showToast('Guest account successfully upgraded!');
      } catch (linkError) {
        console.warn("Account linking failed. Signing in directly...", linkError);
        if (linkError.code === 'auth/credential-already-in-use') {
          const result = await window.fbAuth.signInWithPopup(window.auth, provider);
          user = result.user;
          if (currentAnonUser.uid && user.uid) {
            await migrateAnonymousOrders(currentAnonUser.uid, user.uid);
          }
          showToast('Welcome back!');
        } else {
          throw linkError;
        }
      }
    } else {
      const result = await window.fbAuth.signInWithPopup(window.auth, provider);
      user = result.user;
      showToast('Login successful!');
    }
    
    currentUser = { 
      uid: user.uid, 
      name: user.displayName || 'JPs Member', 
      email: user.email || '', 
      phone: user.phoneNumber || '', 
      photoURL: user.photoURL || '',
      addresses: currentUser ? (currentUser.addresses || []) : [],
      isAnonymous: false
    };
    localStorage.setItem('sm_user', JSON.stringify(currentUser));

    // Save/update user profile in Firestore
    if (window.db && window.fs) {
      try {
        const userRef = window.fs.doc(window.db, "users", currentUser.uid);
        await window.fs.setDoc(userRef, {
          uid: currentUser.uid,
          name: currentUser.name,
          phone: currentUser.phone,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          addresses: currentUser.addresses
        }, { merge: true });
        console.log("User details successfully saved to Firestore");
      } catch (dbErr) {
        console.error("Error saving Google user to Firestore:", dbErr);
      }
    }
    
    isGuest = false;
    sessionStorage.removeItem('sm_guest');
    
    closeLoginModal();
    updateProfileUI();
    if (typeof proceedToCheckout === 'function' && !document.getElementById('payment-section').classList.contains('hidden')) {
      proceedToCheckout(); // Refresh checkout to update/hide conversion banner
    }
    
    if (window.analytics && window.logEvent) {
      window.logEvent(window.analytics, 'login', { method: 'google' });
    }
    
    if (window._authCallback) {
      window._authCallback();
      window._authCallback = null;
    }
  } catch (error) {
    console.error("Google Login Error:", error);
    showToast('Google Login failed: ' + error.message);
  }
}

function guestLogin() {
  isGuest = true;
  sessionStorage.setItem('sm_guest', '1');
  closeLoginModal();
  if (window._authCallback) {
    window._authCallback();
    window._authCallback = null;
  }
}

async function logout() {
  const confirmLogout = confirm("Kya aap logout karna chahte hain? Haan / Nahi");
  if (!confirmLogout) return;
  
  if (window.auth && window.fbAuth) {
    try {
      await window.fbAuth.signOut(window.auth);
    } catch (error) {
      console.error("SignOut error:", error);
    }
  }
  
  // Clear cart and session completely on logout
  if (typeof clearCart === 'function') {
    clearCart();
  }
  
  localStorage.removeItem('sm_user');
  sessionStorage.removeItem('sm_guest');
  currentUser = null;
  isGuest = false;
  
  if (typeof initAuth === 'function') initAuth();
  
  showToast('Logged out successfully');
  if (typeof navigate === 'function') {
    navigate('home');
  } else {
    window.location.reload();
  }
}

function updateProfileUI() {
  const nameEl = document.getElementById('prof-name');
  const phoneEl = document.getElementById('prof-phone');
  const emailEl = document.getElementById('prof-email');
  const avatarEl = document.getElementById('prof-avatar');
  const logoutBtn = document.getElementById('logout-btn');
  
  if(currentUser && !currentUser.isAnonymous) {
    const name = currentUser.name || 'JPs Member';
    if(nameEl) nameEl.innerText = name;
    if(phoneEl) phoneEl.innerText = currentUser.phone || 'No phone number';
    if(emailEl) emailEl.innerText = currentUser.email || 'No email address';
    
    if(avatarEl) {
      if(currentUser.photoURL) {
        avatarEl.innerHTML = `<img src="${currentUser.photoURL}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
      } else {
        avatarEl.innerHTML = '';
        avatarEl.innerText = name.charAt(0).toUpperCase();
      }
    }
    if(logoutBtn) logoutBtn.classList.remove('hidden');
  } else {
    if(nameEl) nameEl.innerText = 'Guest User';
    if(phoneEl) phoneEl.innerText = 'Login to view profile';
    if(emailEl) emailEl.innerText = '';
    if(avatarEl) {
      avatarEl.innerHTML = '';
      avatarEl.innerText = 'G';
    }
    if(logoutBtn) logoutBtn.classList.add('hidden');
  }
}

function requireAuth(callback) {
  if(isLoggedIn() || isGuest) {
    callback();
  } else {
    window._authCallback = callback;
    openLoginModal();
  }
}

function openProfileEditModal() {
  if (!currentUser || currentUser.isAnonymous) {
    showToast("Please login first to edit profile!");
    openLoginModal();
    return;
  }
  
  const modal = document.getElementById('profile-edit-modal');
  if (modal) {
    modal.classList.add('active');
    
    document.getElementById('edit-name').value = currentUser.name || '';
    document.getElementById('edit-email').value = currentUser.email || '';
    
    const editAvatar = document.getElementById('edit-prof-avatar');
    if (editAvatar) {
      if (currentUser.photoURL) {
        editAvatar.innerHTML = `<img src="${currentUser.photoURL}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
      } else {
        editAvatar.innerHTML = '';
        editAvatar.innerText = (currentUser.name || 'S').charAt(0).toUpperCase();
      }
    }
  }
}

function closeProfileEditModal() {
  const modal = document.getElementById('profile-edit-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function handleProfilePicChange(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  if (file.size > 1024 * 1024) {
    showToast("Please upload a photo smaller than 1MB");
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const base64String = e.target.result;
    
    const editAvatar = document.getElementById('edit-prof-avatar');
    if (editAvatar) {
      editAvatar.innerHTML = `<img src="${base64String}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
    }
    
    if (currentUser) {
      currentUser.photoURL = base64String;
    }
  };
  reader.readAsDataURL(file);
}

async function saveUserProfile() {
  const name = document.getElementById('edit-name').value.trim();
  const email = document.getElementById('edit-email').value.trim();
  
  if (!name) {
    showToast("Name cannot be empty");
    return;
  }
  
  if (currentUser) {
    currentUser.name = name;
    currentUser.email = email;
    
    if (window.auth && window.auth.currentUser) {
      try {
        await window.fbAuth.updateProfile(window.auth.currentUser, {
          displayName: name,
          photoURL: currentUser.photoURL || ''
        });
      } catch (err) {
        console.error("Firebase updateProfile error:", err);
      }
    }
    
    localStorage.setItem('sm_user', JSON.stringify(currentUser));
    showToast("Profile updated successfully!");
    closeProfileEditModal();
    updateProfileUI();
  }
}

async function migrateAnonymousOrders(anonUid, permUid) {
  if (!window.db || !window.fs) return;
  const { collection, getDocs, query, where, updateDoc, doc } = window.fs;
  try {
    const ordersRef = collection(window.db, "orders");
    const q = query(ordersRef, where("userId", "==", anonUid));
    const snapshot = await getDocs(q);
    const promises = snapshot.docs.map(docSnapshot => {
      const orderDocRef = doc(window.db, "orders", docSnapshot.id);
      return updateDoc(orderDocRef, { userId: permUid });
    });
    await Promise.all(promises);
    console.log(`Migrated ${promises.length} orders from anonymous ${anonUid} to permanent ${permUid}`);
  } catch (err) {
    console.error("Error migrating anonymous orders:", err);
  }
}

function showToast(msg, type = 'info') {
  if (typeof window.showToast === 'function' && window.showToast !== showToast) {
    window.showToast(msg, type);
    return;
  }
  const div = document.createElement('div');
  div.className = `toast toast-${type}`;
  div.innerText = msg;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 2500);
}

async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn("Notifications not supported in this browser");
    return false;
  }
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      showToast('Notification permission granted! 🔔', 'success');
      return true;
    } else {
      showToast('Notification permission denied', 'warning');
      return false;
    }
  } catch (err) {
    console.error("Error requesting notifications:", err);
    return false;
  }
}
