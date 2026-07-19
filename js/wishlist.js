// js/wishlist.js

let wishlistItems = JSON.parse(localStorage.getItem('jpsmart_wishlist')) || [];

function initWishlist() {
  wishlistItems = JSON.parse(localStorage.getItem('jpsmart_wishlist')) || [];
}

function getWishlist() {
  return wishlistItems;
}

function isInWishlist(productId) {
  return wishlistItems.includes(productId);
}

function addToWishlist(productId) {
  if (!wishlistItems.includes(productId)) {
    wishlistItems.push(productId);
    localStorage.setItem('jpsmart_wishlist', JSON.stringify(wishlistItems));
    showToast('Added to Wishlist');
    if (typeof renderProducts === 'function') renderProducts();
    if (typeof openProductModal === 'function' && document.getElementById('product-modal').classList.contains('active')) {
      // Refresh modal
      openProductModal(productId);
    }
  }
}

function removeFromWishlist(productId) {
  const index = wishlistItems.indexOf(productId);
  if (index > -1) {
    wishlistItems.splice(index, 1);
    localStorage.setItem('jpsmart_wishlist', JSON.stringify(wishlistItems));
    showToast('Removed from Wishlist');
    if (typeof renderProducts === 'function') renderProducts();
    if (typeof openProductModal === 'function' && document.getElementById('product-modal').classList.contains('active')) {
      // Refresh modal
      openProductModal(productId);
    }
  }
}

function toggleWishlist(productId) {
  if (isInWishlist(productId)) {
    removeFromWishlist(productId);
  } else {
    addToWishlist(productId);
  }
}

// Global exports
if (typeof window !== 'undefined') {
  window.wishlist = {
    initWishlist,
    getWishlist,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist
  };
}
