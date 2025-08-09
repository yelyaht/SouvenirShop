window.addToCart = function(itemName) {
  alert(`Added 1 × ${itemName} to your cart!`);
};

// ===== Image Modal =====
(function () {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const modalCaption = document.getElementById('modalCaption');
  const closeBtn = modal?.querySelector('.modal-close');

  if (!modal || !modalImg || !closeBtn) return;

  // Open modal with given src/alt
  function openModal(src, alt, captionText) {
    modalImg.src = src;
    modalImg.alt = alt || '';
    if (captionText) {
      modalCaption.textContent = captionText;
      modalCaption.removeAttribute('aria-hidden');
    } else {
      modalCaption.textContent = '';
      modalCaption.setAttribute('aria-hidden', 'true');
    }
    modal.classList.add('open');
    document.body.classList.add('modal-open');
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
    // unload image to free memory (optional)
    modalImg.src = '';
    modalImg.alt = '';
  }

  // Click any product image to open
  document.addEventListener('click', (e) => {
    const img = e.target.closest('.card-image img');
    if (!img) return;

    // Prefer higher-res image if provided via data-full
    const fullSrc = img.getAttribute('data-full') || img.src;
    const alt = img.getAttribute('alt') || '';

    // Optional caption from the card title (h3 text)
