// js/auth.js — Username + Password authentication system

let currentUser = JSON.parse(localStorage.getItem('sm_user')) || null;
let pendingUsername = '';
let pendingPhone = '';

function initAuth() {
  currentUser = JSON.parse(localStorage.getItem('sm_user')) || null;

  // Keep an anonymous Firebase session running in the background so that
  // Firestore writes (orders, cart, wishlist) keep working exactly as before,
  // regardless of whether the shopper has created a username/password account.
  if (window.auth) {
    ensureAnonymousLogin();
  } else {
    window.addEventListener('firebaseReady', ensureAnonymousLogin);
  }

  if (typeof updateProfileUI === 'function') {
    updateProfileUI();
  }
}

async function ensureAnonymousLogin() {
  if (window.auth && !window.auth.currentUser) {
    try {
      await window.fbAuth.signInAnonymously(window.auth);
    } catch (error) {
      console.error("Anonymous auth error:", error);
    }
  }
}

function isLoggedIn() {
  return currentUser !== null && (!!currentUser.username || !!currentUser.phone);
}

function getUser() {
  return currentUser;
}

async function hashPasswordAuth(msg) {
  const encoder = new TextEncoder();
  const data = encoder.encode(msg);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ───────────────────────── Phone OTP login ─────────────────────────

function initRecaptcha() {
  if (window.recaptchaVerifier) return;
  try {
    window.recaptchaVerifier = new window.fbAuth.RecaptchaVerifier(window.auth, 'recaptcha-container', {
      size: 'invisible'
    });
  } catch (error) {
    console.error("Recaptcha init error:", error);
  }
}

function resetRecaptchaVerifier() {
  if (window.recaptchaVerifier) {
    try { window.recaptchaVerifier.clear(); } catch (e) {}
    window.recaptchaVerifier = null;
  }
  const container = document.getElementById('recaptcha-container');
  if (container) container.innerHTML = '';
}

async function sendOTP(isResend = false) {
  const phoneInput = document.getElementById('login-phone');
  let phone = phoneInput.value.trim();

  if (phone.length < 10) {
    showToast('Please enter a valid 10-digit mobile number', 'warning');
    return;
  }
  if (!phone.startsWith('+91')) {
    phone = '+91' + phone;
  }

  const btn = document.getElementById('send-otp-btn');
  const originalText = btn.innerText;
  btn.innerText = 'Sending...';
  btn.style.pointerEvents = 'none';

  try {
    resetRecaptchaVerifier();
    initRecaptcha();

    const confirmationResult = await window.fbAuth.signInWithPhoneNumber(window.auth, phone, window.recaptchaVerifier);
    window.confirmationResult = confirmationResult;
    pendingPhone = phone;

    document.getElementById('auth-step1').classList.add('hidden');
    document.getElementById('auth-step-otp').classList.remove('hidden');
    document.getElementById('otp-phone-label').innerText = phone;
    document.getElementById('login-otp').value = '';

    if (!isResend) {
      startOTPTimer();
    }

    showToast('OTP bheja gaya hai! 📩', 'success');
  } catch (error) {
    console.error("SMS Error:", error);

    if (error.code === 'auth/invalid-phone-number') {
      showToast('Invalid phone number format.', 'error');
    } else if (error.code === 'auth/too-many-requests') {
      showToast('Too many requests. Please try again later.', 'error');
    } else {
      showToast('Failed to send OTP. Dobara try karein.', 'error');
    }

    resetRecaptchaVerifier();
  } finally {
    btn.innerText = originalText;
    btn.style.pointerEvents = 'auto';
  }
}

function startOTPTimer() {
  let seconds = 60;
  const timerEl = document.getElementById('otp-timer');
  const countEl = document.getElementById('timer-count');
  const resendBtn = document.getElementById('resend-otp-btn');

  if (resendBtn) resendBtn.classList.add('hidden');
  if (timerEl) timerEl.classList.remove('hidden');

  if (window._otpTimerInterval) clearInterval(window._otpTimerInterval);

  window._otpTimerInterval = setInterval(() => {
    seconds--;
    if (countEl) countEl.innerText = seconds;
    if (seconds <= 0) {
      clearInterval(window._otpTimerInterval);
      if (timerEl) timerEl.classList.add('hidden');
      if (resendBtn) resendBtn.classList.remove('hidden');
    }
  }, 1000);
}

async function verifyOTP() {
  const otp = document.getElementById('login-otp').value.trim();

  if (otp.length !== 6) {
    showToast('Please enter the 6-digit OTP', 'warning');
    return;
  }

  const btn = document.getElementById('verify-otp-btn');
  const originalText = btn.innerText;
  btn.innerText = 'Verifying...';
  btn.style.pointerEvents = 'none';

  try {
    const result = await window.confirmationResult.confirm(otp);
    const user = result.user;

    currentUser = {
      uid: user.uid,
      username: '',
      name: currentUser?.name || 'JPs Member',
      phone: user.phoneNumber || pendingPhone,
      email: '',
      photoURL: '',
      addresses: [],
      isAnonymous: false
    };
    localStorage.setItem('sm_user', JSON.stringify(currentUser));

    closeLoginModal();
    showToast('Login successful! 🎉', 'success');

    if (window.analytics && window.logEvent) {
      window.logEvent(window.analytics, 'login', { method: 'phone' });
    }

    if (typeof updateProfileUI === 'function') updateProfileUI();
    const paymentSection = document.getElementById('payment-section');
    if (typeof proceedToCheckout === 'function' && paymentSection && !paymentSection.classList.contains('hidden')) {
      proceedToCheckout();
    }

    if (window._authCallback) {
      window._authCallback();
      window._authCallback = null;
    }
  } catch (error) {
    console.error("OTP verify error:", error);
    if (error.code === 'auth/invalid-verification-code') {
      showToast('Galat OTP. Dobara try karein.', 'error');
    } else {
      showToast('Verification fail hua. Dobara try karein.', 'error');
    }
  } finally {
    btn.innerText = originalText;
    btn.style.pointerEvents = 'auto';
  }
}

function backToLoginOptions() {
  if (window._otpTimerInterval) clearInterval(window._otpTimerInterval);
  document.getElementById('auth-step-otp').classList.add('hidden');
  document.getElementById('auth-step1').classList.remove('hidden');
  resetRecaptchaVerifier();
}

function openLoginModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.classList.add('active');
    document.getElementById('auth-step1').classList.remove('hidden');
    document.getElementById('auth-step-login').classList.add('hidden');
    document.getElementById('auth-step-signup').classList.add('hidden');
    document.getElementById('auth-step-otp').classList.add('hidden');
    document.getElementById('login-username').value = '';
    document.getElementById('login-phone').value = '';
    pendingUsername = '';
    pendingPhone = '';
  }
}

function closeLoginModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function backToUsernameStep() {
  document.getElementById('auth-step-login').classList.add('hidden');
  document.getElementById('auth-step-signup').classList.add('hidden');
  document.getElementById('auth-step1').classList.remove('hidden');
  document.getElementById('login-username').value = '';
  pendingUsername = '';
}

async function checkUsername() {
  const usernameInput = document.getElementById('login-username');
  const username = usernameInput.value.trim().toLowerCase();

  if (username.length < 3) {
    showToast('Username kam se kam 3 characters ka hona chahiye', 'warning');
    return;
  }
  if (!/^[a-z0-9_]+$/.test(username)) {
    showToast('Sirf letters, numbers aur underscore (_) allowed hain', 'warning');
    return;
  }

  if (!window.db || !window.fs) {
    showToast('Loading, please wait aur dobara try karein...', 'warning');
    return;
  }

  const btn = document.getElementById('continue-username-btn');
  const originalText = btn.innerText;
  btn.innerText = 'Checking...';
  btn.style.pointerEvents = 'none';

  try {
    const userRef = window.fs.doc(window.db, "usernameAuth", username);
    const userSnap = await window.fs.getDoc(userRef);

    pendingUsername = username;
    document.getElementById('auth-step1').classList.add('hidden');

    if (userSnap.exists()) {
      document.getElementById('login-username-label').innerText = username;
      document.getElementById('login-password').value = '';
      document.getElementById('auth-step-login').classList.remove('hidden');
      setTimeout(() => document.getElementById('login-password').focus(), 100);
    } else {
      document.getElementById('signup-username-label').innerText = username;
      document.getElementById('signup-password').value = '';
      document.getElementById('signup-password-confirm').value = '';
      document.getElementById('auth-step-signup').classList.remove('hidden');
      setTimeout(() => document.getElementById('signup-password').focus(), 100);
    }
  } catch (err) {
    console.error("Username check error:", err);
    showToast('Kuch galat ho gaya, dobara try karein', 'error');
  } finally {
    btn.innerText = originalText;
    btn.style.pointerEvents = 'auto';
  }
}

async function loginWithPassword() {
  const password = document.getElementById('login-password').value;
  if (!password) {
    showToast('Password daalein', 'warning');
    return;
  }

  const btn = document.getElementById('login-password-btn');
  const originalText = btn.innerText;
  btn.innerText = 'Logging in...';
  btn.style.pointerEvents = 'none';

  try {
    const userRef = window.fs.doc(window.db, "usernameAuth", pendingUsername);
    const userSnap = await window.fs.getDoc(userRef);

    if (!userSnap.exists()) {
      showToast('User nahi mila. Dobara try karein.', 'error');
      backToUsernameStep();
      return;
    }

    const data = userSnap.data();
    const passwordHash = await hashPasswordAuth(password);

    if (passwordHash !== data.passwordHash) {
      showToast('Galat password. Dobara try karein.', 'error');
      return;
    }

    currentUser = {
      uid: data.uid,
      username: data.username,
      name: data.name || data.username,
      phone: data.phone || '',
      email: data.email || '',
      photoURL: data.photoURL || '',
      addresses: data.addresses || [],
      isAnonymous: false
    };
    localStorage.setItem('sm_user', JSON.stringify(currentUser));

    closeLoginModal();
    showToast('Login successful! Welcome back 🎉', 'success');

    if (window.analytics && window.logEvent) {
      window.logEvent(window.analytics, 'login', { method: 'username_password' });
    }

    if (typeof updateProfileUI === 'function') updateProfileUI();
    const paymentSection = document.getElementById('payment-section');
    if (typeof proceedToCheckout === 'function' && paymentSection && !paymentSection.classList.contains('hidden')) {
      proceedToCheckout();
    }

    if (window._authCallback) {
      window._authCallback();
      window._authCallback = null;
    }
  } catch (err) {
    console.error("Login error:", err);
    showToast('Login fail hua, dobara try karein', 'error');
  } finally {
    btn.innerText = originalText;
    btn.style.pointerEvents = 'auto';
  }
}

async function signupWithPassword() {
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('signup-password-confirm').value;

  if (password.length < 6) {
    showToast('Password kam se kam 6 characters ka hona chahiye', 'warning');
    return;
  }
  if (password !== confirmPassword) {
    showToast('Dono password match nahi kar rahe', 'warning');
    return;
  }

  const btn = document.getElementById('signup-btn');
  const originalText = btn.innerText;
  btn.innerText = 'Account ban raha hai...';
  btn.style.pointerEvents = 'none';

  try {
    const passwordHash = await hashPasswordAuth(password);
    const uid = 'u_' + pendingUsername + '_' + Date.now().toString(36);

    const userRef = window.fs.doc(window.db, "usernameAuth", pendingUsername);
    await window.fs.setDoc(userRef, {
      username: pendingUsername,
      uid: uid,
      passwordHash: passwordHash,
      name: pendingUsername,
      phone: '',
      email: '',
      photoURL: '',
      addresses: [],
      createdAt: new Date().toISOString()
    });

    currentUser = {
      uid: uid,
      username: pendingUsername,
      name: pendingUsername,
      phone: '',
      email: '',
      photoURL: '',
      addresses: [],
      isAnonymous: false
    };
    localStorage.setItem('sm_user', JSON.stringify(currentUser));

    closeLoginModal();
    showToast('Account ban gaya! JPs Mart mein Swagat hai 🎉', 'success');

    if (window.analytics && window.logEvent) {
      window.logEvent(window.analytics, 'sign_up', { method: 'username_password' });
    }

    if (typeof updateProfileUI === 'function') updateProfileUI();
    const paymentSection = document.getElementById('payment-section');
    if (typeof proceedToCheckout === 'function' && paymentSection && !paymentSection.classList.contains('hidden')) {
      proceedToCheckout();
    }

    if (window._authCallback) {
      window._authCallback();
      window._authCallback = null;
    }
  } catch (err) {
    console.error("Signup error:", err);
    showToast('Account banane me error aaya, dobara try karein', 'error');
  } finally {
    btn.innerText = originalText;
    btn.style.pointerEvents = 'auto';
  }
}

async function logout() {
  const confirmLogout = confirm("Kya aap logout karna chahte hain? Haan / Nahi");
  if (!confirmLogout) return;

  if (typeof clearCart === 'function') {
    clearCart();
  }

  localStorage.removeItem('sm_user');
  currentUser = null;

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

  if (currentUser && (currentUser.username || currentUser.phone)) {
    const name = currentUser.name || currentUser.username || 'JPs Member';
    if (nameEl) nameEl.innerText = name;
    if (phoneEl) phoneEl.innerText = currentUser.phone || 'No phone number';
    if (emailEl) emailEl.innerText = currentUser.email || 'No email address';

    if (avatarEl) {
      if (currentUser.photoURL) {
        avatarEl.innerHTML = `<img src="${currentUser.photoURL}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
      } else {
        avatarEl.innerHTML = '';
        avatarEl.innerText = name.charAt(0).toUpperCase();
      }
    }
    if (logoutBtn) logoutBtn.classList.remove('hidden');
  } else {
    if (nameEl) nameEl.innerText = 'Guest User';
    if (phoneEl) phoneEl.innerText = 'Login to view profile';
    if (emailEl) emailEl.innerText = '';
    if (avatarEl) {
      avatarEl.innerHTML = '';
      avatarEl.innerText = 'G';
    }
    if (logoutBtn) logoutBtn.classList.add('hidden');
  }
}

function requireAuth(callback) {
  if (isLoggedIn()) {
    callback();
  } else {
    window._authCallback = callback;
    openLoginModal();
  }
}

function openProfileEditModal() {
  if (!isLoggedIn()) {
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

    if (window.db && window.fs && currentUser.username) {
      try {
        const userRef = window.fs.doc(window.db, "usernameAuth", currentUser.username);
        await window.fs.setDoc(userRef, {
          name: name,
          email: email,
          photoURL: currentUser.photoURL || ''
        }, { merge: true });
      } catch (err) {
        console.error("Error updating profile in Firestore:", err);
      }
    }

    localStorage.setItem('sm_user', JSON.stringify(currentUser));
    showToast("Profile updated successfully!");
    closeProfileEditModal();
    updateProfileUI();
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
