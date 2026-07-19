// js/reviews.js
if (typeof PRODUCTS === 'undefined') { console.error('products.js must load before reviews.js'); }

const REVIEWER_NAMES = ["Rahul S.", "Priya M.", "Amit K.", "Neha P.", "Sunita R.", "Vikram T.", "Deepa G.", "Arjun B.", "Meera J.", "Kiran D.", "Pooja L.", "Ravi N.", "Anita W.", "Suresh C.", "Kavita H."];
const REVIEW_COMMENTS = [
  "Bahut fresh aur tasty! Next time bhi yehi order karunga.",
  "Quality achhi thi, packaging bhi solid tha.",
  "Price thoda zyada hai but quality worth it hai.",
  "JPs Mart ki delivery bahut fast hai, 10 min mein aa gaya!",
  "Mast product hai, family ko bahut pasand aaya.",
  "Pehli baar try kiya, disappointed nahi hua.",
  "Regular customer hoon, kabhi quality mein compromise nahi.",
  "Thoda chota size tha expected se, par taste badhiya.",
  "Best deal mila hai yahan pe, recommend karunga.",
  "Bachche bahut khush hue, thanks JPs Mart!",
  "Har week order karta hoon, consistent quality.",
  "Expiry date door thi, fresh stock mila."
];

let BASE_REVIEWS = {};
let userReviews = JSON.parse(localStorage.getItem('sm_userReviews')) || {};
let revCounter = 1;

// Reviews are now generated lazily when requested

function initReviews() {
  userReviews = JSON.parse(localStorage.getItem('sm_userReviews')) || {};
}

function getProductReviews(pid) {
  // Lazy generate fake reviews if they don't exist for this product yet
  if (!BASE_REVIEWS[pid]) {
    BASE_REVIEWS[pid] = [];
    const numReviews = Math.floor(Math.random() * 2) + 3; // 3 or 4
    for(let i=0; i<numReviews; i++) {
      const name = REVIEWER_NAMES[Math.floor(Math.random() * REVIEWER_NAMES.length)];
      const text = REVIEW_COMMENTS[Math.floor(Math.random() * REVIEW_COMMENTS.length)];
      const stars = Math.floor(Math.random() * 2) + 4; // 4 or 5 stars
      const helpful = Math.floor(Math.random() * 30) + 1;
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      BASE_REVIEWS[pid].push({
        id: 'br' + revCounter++,
        name: name,
        stars: stars,
        text: text,
        verified: true,
        helpful: helpful,
        date: date.toLocaleDateString()
      });
    }
  }

  let base = BASE_REVIEWS[pid] || [];
  let userR = userReviews[pid] || [];
  return [...userR, ...base];
}

function getProductRating(pid) {
  const revs = getProductReviews(pid);
  if (revs.length === 0) return { avg: 0, count: 0, bars: [0,0,0,0,0] };
  
  let sum = 0;
  let bars = [0, 0, 0, 0, 0]; // index 0 is 5star, index 4 is 1star
  
  revs.forEach(r => {
    sum += r.stars;
    bars[5 - r.stars]++;
  });
  
  return {
    avg: (sum / revs.length).toFixed(1),
    count: revs.length,
    bars: bars
  };
}

function submitReview(pid, name, text, stars) {
  if(!userReviews[pid]) userReviews[pid] = [];
  
  userReviews[pid].unshift({
    id: 'ur' + Date.now(),
    name: name || 'Guest User',
    stars: stars,
    text: text,
    verified: true, // Assuming true for now
    helpful: 0,
    date: new Date().toLocaleDateString()
  });
  
  localStorage.setItem('sm_userReviews', JSON.stringify(userReviews));
  return true;
}

function toggleHelpful(pid, reviewId) {
  let updated = false;
  
  // Update in userReviews if it exists
  if(userReviews[pid]) {
    let r = userReviews[pid].find(x => x.id === reviewId);
    if(r) {
      r.helpful++;
      localStorage.setItem('sm_userReviews', JSON.stringify(userReviews));
      updated = true;
    }
  }
  
  // Note: we don't save base reviews helpful increments to localstorage to keep it simple,
  // but we can increment them in memory.
  if(!updated && BASE_REVIEWS[pid]) {
    let r = BASE_REVIEWS[pid].find(x => x.id === reviewId);
    if(r) {
      r.helpful++;
      updated = true;
    }
  }
  
  return updated;
}

function renderReviewsHTML(pid, filter = 'latest') {
  let revs = [...getProductReviews(pid)];
  let rt = getProductRating(pid);
  
  if(filter === 'helpful') {
    revs.sort((a,b) => b.helpful - a.helpful);
  } else if (filter === '5star') {
    revs = revs.filter(r => r.stars === 5);
  }
  // 'latest' relies on the order they were generated/prepended

  let html = `
    <!-- Ratings Summary -->
    <div class="rating-summary">
      <div style="text-align:center;">
        <div class="rating-big">${rt.avg}</div>
        <div style="color:var(--primary); font-size:0.9rem;">${'★'.repeat(Math.round(rt.avg))}${'☆'.repeat(5-Math.round(rt.avg))}</div>
        <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">${rt.count} ratings</div>
      </div>
      <div class="rating-bars">
        ${rt.bars.map((c, i) => `
          <div class="rbar-row">
            <span>${5-i}</span> <i class="fa-solid fa-star" style="color:var(--primary); font-size:0.6rem;"></i>
            <div class="rbar-track"><div class="rbar-fill" style="width:${rt.count ? (c/rt.count)*100 : 0}%"></div></div>
            <span style="width:20px; text-align:right;">${c}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Write a Review -->
    <div style="padding:20px; border-bottom:1px solid var(--border);">
      <h4 style="margin-bottom:10px;">Write a Review</h4>
      <div style="display:flex; gap:10px; margin-bottom:15px;" id="star-picker-${pid}">
        ${[1,2,3,4,5].map(i => `<i class="fa-solid fa-star star-pick ${i<=5?'on':''}" data-val="${i}" onclick="selectStar(${pid}, ${i})"></i>`).join('')}
      </div>
      <input type="hidden" id="rev-stars-${pid}" value="5">
      <input type="text" id="rev-name-${pid}" placeholder="Your Name" style="width:100%; padding:10px; margin-bottom:10px; border-radius:8px; border:1px solid var(--border); background:var(--bg-card); color:var(--text);" value="${(typeof getUser === 'function' && getUser()) ? getUser().name : ''}">
      <textarea id="rev-text-${pid}" rows="2" placeholder="Tell us about the product..." style="width:100%; padding:10px; margin-bottom:10px; border-radius:8px; border:1px solid var(--border); background:var(--bg-card); color:var(--text); font-family:'Poppins', sans-serif; resize:none;"></textarea>
      <button class="btn btn-outline" style="padding:10px;" onclick="handleAddReview(${pid})">Submit Review</button>
    </div>

    <!-- Review List Header -->
    <div style="padding:20px 20px 5px; display:flex; justify-content:space-between; align-items:center;">
      <div style="font-weight:600;">Reviews</div>
      <select onchange="changeReviewFilter(${pid}, this.value)" style="padding:6px 10px; border-radius:6px; background:var(--bg-card); color:var(--text); border:1px solid var(--border); outline:none;">
        <option value="latest" ${filter==='latest'?'selected':''}>Latest</option>
        <option value="helpful" ${filter==='helpful'?'selected':''}>Most Helpful</option>
        <option value="5star" ${filter==='5star'?'selected':''}>5 Stars Only</option>
      </select>
    </div>
    
    <!-- Review List -->
    <div id="rev-list-container-${pid}">
  `;

  if(revs.length === 0) {
    html += `<div style="padding:20px; text-align:center; color:var(--text-muted);">No reviews yet.</div>`;
  } else {
    html += revs.map(r => `
      <div class="rev-card">
        <div class="rev-header">
          <div>
            <span class="rev-name">${r.name}</span>
            ${r.verified ? `<span class="rev-verified">Verified Purchase ✅</span>` : ''}
          </div>
          <div style="font-size:0.7rem; color:var(--text-muted);">${r.date}</div>
        </div>
        <div class="rev-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</div>
        <div class="rev-text" style="margin-top:6px;">${r.text}</div>
        <div class="rev-helpful" onclick="handleHelpful(${pid}, '${r.id}', this)"><i class="fa-regular fa-thumbs-up"></i> Helpful (${r.helpful})</div>
      </div>
    `).join('');
  }

  html += `</div>`;
  return html;
}

// These are global helpers called by the injected HTML
window.selectStar = function(pid, val) {
  document.getElementById(`rev-stars-${pid}`).value = val;
  const stars = document.querySelectorAll(`#star-picker-${pid} .star-pick`);
  stars.forEach((s, idx) => {
    s.classList.toggle('on', idx < val);
  });
};

window.handleAddReview = function(pid) {
  const name = document.getElementById(`rev-name-${pid}`).value.trim();
  const text = document.getElementById(`rev-text-${pid}`).value.trim();
  const stars = parseInt(document.getElementById(`rev-stars-${pid}`).value);
  
  if(!text) {
    showToast('Please write a review comment');
    return;
  }
  
  submitReview(pid, name, text, stars);
  showToast('Review submitted!');
  
  // Re-render product modal content
  openProductModal(pid);
};

window.changeReviewFilter = function(pid, val) {
  // We need to re-render the modal
  openProductModal(pid, val);
};

window.handleHelpful = function(pid, rid, btnEl) {
  if(btnEl.classList.contains('liked')) return; // already liked
  
  toggleHelpful(pid, rid);
  btnEl.classList.add('liked');
  let currentCount = parseInt(btnEl.innerText.match(/\\d+/)[0]);
  btnEl.innerHTML = `<i class="fa-solid fa-thumbs-up"></i> Helpful (${currentCount + 1})`;
};
