// ===== Shop-side cart plumbing =====
const LS_CART = 'mcm_cart_items';

// Keys must exactly match the strings passed in your onclick attributes
const CATALOG_BY_NAME = {
  'Ventral Rib Fossil – Draconis Altiventris': { id: 'dragon_rib',  price: 90.00, image: '../../images/souvenir/dragart.jpg' },
  'Laryngeal Crest of Siren Pelagis Nocturna': { id: 'siren_crest', price: 75.00, image: '../../images/souvenir/siart.jpg' },
  'Bloodbound Cradle Stone':                   { id: 'vampire_stone', price: 64.00, image: '../../images/souvenir/vamart.jpg' },
  'Moon-Clasp Ritual Harness':                 { id: 'wolf_harness',  price: 80.00, image: '../../images/souvenir/werart.jpg' },
  'Sylvan Memory Circlet':                     { id: 'elf_circlet',   price: 65.00, image: '../../images/souvenir/elfart.jpg' },
  'Calcified Paw Core – Cerberus Infernicus': { id: 'cerb_paw',     price: 45.00, image: '../../images/souvenir/cerbart.jpg' }
};

function getCart() { try { return JSON.parse(localStorage.getItem(LS_CART)) || []; } catch { return []; } }
function saveCart(items) { localStorage.setItem(LS_CART, JSON.stringify(items)); }

// Optional: live count in header
function updateHeaderCount() {
  const count = getCart().reduce((s, it) => s + (it.qty || 0), 0);
  const el = document.getElementById('cartCount');
  if (el) el.textContent = String(count);
}

// --- Add to cart: always +1 (with alert) ---
window.addToCart = function(itemName) {
  const meta = CATALOG_BY_NAME[itemName];
  if (!meta) { alert('Item not found.'); return; }

  const cart = getCart();
  const idx = cart.findIndex(x => x.id === meta.id);
  if (idx > -1) cart[idx].qty += 1;
  else cart.push({ id: meta.id, name: itemName, unitPrice: meta.price, qty: 1, image: meta.image });

  saveCart(cart);
  alert(`Added 1 × ${itemName} to your cart!`);
  updateHeaderCount();
};

document.addEventListener('DOMContentLoaded', updateHeaderCount);
