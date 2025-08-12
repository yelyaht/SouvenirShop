/* ====== Constants (UPPER_SNAKE_CASE) ====== */
const TAX_RATE = 0.10;               // 10% as requested
const MEMBER_DISCOUNT_RATE = 0.15;    // 15%
const SHIPPING_RATE = 25.00;          // flat
const VOLUME_DISCOUNT_TIERS = [
  { min:   0, max:  49.99, rate: 0.00 },
  { min:  50, max:  99.99, rate: 0.05 },
  { min: 100, max: 199.99, rate: 0.10 },
  { min: 200, max: Infinity, rate: 0.15 }
];

/* ====== Storage Keys ====== */
const LS_CART = 'mcm_cart_items';
const LS_MEMBER = 'mcm_member_flag';
const LS_DISCOUNT_MODE = 'mcm_discount_mode'; // 'member' | 'volume' | 'none'

/* ====== Cart storage helpers ====== */
function getCart() {
  try {
    const raw = localStorage.getItem(LS_CART);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter(x => x && x.qty > 0 && x.unitPrice >= 0) : [];
  } catch { return []; }
}
function saveCart(items) { localStorage.setItem(LS_CART, JSON.stringify(items)); }

function setMemberFlag(isMember) { localStorage.setItem(LS_MEMBER, isMember ? '1' : '0'); }
function getMemberFlag() { return localStorage.getItem(LS_MEMBER) === '1'; }

function setDiscountMode(mode) { localStorage.setItem(LS_DISCOUNT_MODE, mode); }
function getDiscountMode() { return localStorage.getItem(LS_DISCOUNT_MODE) || 'none'; }

/* ====== Single render() ====== */
function render() {
  const root = document.getElementById('cartRoot');
  const memberCheckbox = document.getElementById('memberCheckbox');

  // Load state
  let cart = getCart().filter(i => i.unitPrice > 0);
  let isMember = getMemberFlag();
  let discountMode = getDiscountMode(); // 'member' | 'volume' | 'none'

  if (memberCheckbox) memberCheckbox.checked = isMember;

  // Math (compute on unrounded sums)
  let itemTotal = 0;
  for (let i = 0; i < cart.length; i++) itemTotal += cart[i].unitPrice * cart[i].qty;

  let volumeRate = 0;
  for (let i = 0; i < VOLUME_DISCOUNT_TIERS.length; i++) {
    const t = VOLUME_DISCOUNT_TIERS[i];
    if (itemTotal >= t.min && itemTotal <= t.max) { volumeRate = t.rate; break; }
  }

  if (isMember && volumeRate > 0 && discountMode === 'none' && itemTotal > 0) {
    const answer = window.prompt(
      `Both discounts are available. Type "member" for 15% member discount, or "volume" for ${Math.round(volumeRate*100)}% volume discount. Only one may be applied.`
    );
    const choice = (answer || '').trim().toLowerCase();
    discountMode = (choice === 'member' || choice === 'volume') ? choice : 'member';
    setDiscountMode(discountMode);
  }
  if (!isMember && volumeRate > 0 && discountMode === 'none') setDiscountMode(discountMode = 'volume');
  if (isMember && volumeRate === 0 && discountMode === 'none') setDiscountMode(discountMode = 'member');
  if (!isMember && volumeRate === 0) setDiscountMode(discountMode = 'none');

  let memberDiscount = 0, volumeDiscount = 0;
  if (discountMode === 'member' && isMember) memberDiscount = itemTotal * MEMBER_DISCOUNT_RATE;
  if (discountMode === 'volume') volumeDiscount = itemTotal * volumeRate;

  const shipping = cart.length > 0 ? SHIPPING_RATE : 0;
  const taxableSubTotal = itemTotal - memberDiscount - volumeDiscount + shipping;
  const taxAmount = taxableSubTotal * TAX_RATE;
  const invoiceTotal = taxableSubTotal + taxAmount;

  const fmt = (n) => {
    const s = Math.abs(n).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return n < 0 ? `(${s})` : s;
  };

  // Render
  let html = '';
  if (cart.length === 0) {
    html += `
      <section class="about-box" aria-label="Empty cart information">
        <h2>Your cart is empty.</h2>
        <p>Browse the Souvenir Shop to add mythic relics to your collection.</p>
      </section>
    `;
  } else {
    html += `
      <table class="cart-table" aria-label="Cart items">
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Qty</th>
            <th scope="col">Unit</th>
            <th scope="col">Line Total</th>
            <th scope="col"><span class="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
    `;
    for (let i = 0; i < cart.length; i++) {
      const it = cart[i];
      const lineTotal = it.unitPrice * it.qty;
      html += `
        <tr data-id="${it.id}">
          <td>
            <div style="display:flex; align-items:center; gap:10px;">
              <img src="${it.image}" alt="" class="cart-thumb" />
              <div><div style="font-family:'Cinzel',serif;">${it.name}</div></div>
            </div>
          </td>
          <td>
            <div class="qty-controls">
              <button data-action="dec" aria-label="Decrease quantity">–</button>
              <span aria-live="polite">${it.qty}</span>
              <button data-action="inc" aria-label="Increase quantity">+</button>
            </div>
          </td>
          <td class="amount">${fmt(it.unitPrice)}</td>
          <td class="amount">${fmt(lineTotal)}</td>
          <td><button class="remove-btn" data-action="remove">Remove</button></td>
        </tr>
      `;
    }
    html += `
        </tbody>
      </table>

      <div class="summary" aria-label="Cart summary">
        <div class="summary-row label"><div>Subtotal of ItemTotals</div><div class="amount">${fmt(itemTotal)}</div></div>
        <div class="summary-row"><div>Volume Discount</div><div class="amount">${fmt(0 - volumeDiscount)}</div></div>
        <div class="summary-row"><div>Member Discount</div><div class="amount">${fmt(0 - memberDiscount)}</div></div>
        <div class="summary-row"><div>Shipping</div><div class="amount">${fmt(shipping)}</div></div>
        <div class="summary-row label"><div>Subtotal (Taxable amount)</div><div class="amount">${fmt(taxableSubTotal)}</div></div>
        <div class="summary-row"><div>Tax Rate %</div><div class="amount">${(TAX_RATE*100).toFixed(0)}%</div></div>
        <div class="summary-row"><div>Tax Amount $</div><div class="amount">${fmt(taxAmount)}</div></div>
        <div class="summary-row label"><div><strong>Invoice Total</strong></div><div class="amount"><strong>${fmt(invoiceTotal)}</strong></div></div>

        <div class="checkout-cta">
          <button aria-label="Proceed to checkout (demo)">Proceed to Checkout</button>
        </div>
      </div>
    `;
  }

  root.innerHTML = html;

  // Interactions
  const table = root.querySelector('.cart-table');
  if (table) {
    table.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const tr = e.target.closest('tr[data-id]');
      if (!tr) return;
      const id = tr.getAttribute('data-id');
      const idx = cart.findIndex(x => x.id === id);
      if (idx === -1) return;

      const action = btn.getAttribute('data-action');
      if (action === 'inc') cart[idx].qty += 1;
      else if (action === 'dec') cart[idx].qty = Math.max(0, cart[idx].qty - 1);
      else if (action === 'remove') cart.splice(idx, 1);

      cart = cart.filter(x => x.qty > 0 && x.unitPrice > 0);
      saveCart(cart);
      render();
    });
  }

  if (memberCheckbox) {
    memberCheckbox.onchange = () => {
      isMember = !!memberCheckbox.checked;
      setMemberFlag(isMember);
      setDiscountMode('none');
      render();
    };
  }

  const keep = document.getElementById('keepShoppingBtn');
  if (keep) keep.onclick = () => { location.href = 'shop.html'; };

  const clearBtn = document.getElementById('clearCartBtn');
  if (clearBtn) clearBtn.onclick = () => {
    saveCart([]);
    setDiscountMode('none');
    render();
  };
}

document.addEventListener('DOMContentLoaded', render);
