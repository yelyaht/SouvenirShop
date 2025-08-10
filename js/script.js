// --- Add to cart: always +1 ---
window.addToCart = function(itemName) {
  alert(`Added 1 × ${itemName} to your cart! Functionality coming soon...`);
};

// --- Image Modal ---
(() => {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const modalCaption = document.getElementById('modalCaption');
  const closeBtn = modal ? modal.querySelector('.modal-close') : null;

  if (!modal || !modalImg || !closeBtn) return;

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

    // Focus the modal container (not the button)
    modal.setAttribute('tabindex', '-1');
    modal.focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
    modalImg.src = '';
    modalImg.alt = '';
  }

  // Open on any product image click
  document.addEventListener('click', (e) => {
    const img = e.target.closest('.card-image img');
    if (!img) return;

    const fullSrc = img.getAttribute('data-full') || img.src;
    const alt = img.getAttribute('alt') || '';
    const card = img.closest('.creature-card');
    const captionText = card ? (card.querySelector('h3')?.innerText || '') : '';

    openModal(fullSrc, alt, captionText);
  });

  // Close actions
  closeBtn.addEventListener('click', closeModal);                 // <= you were missing this
  closeBtn.addEventListener('mousedown', (e) => e.preventDefault()); // stop mouse/tap from focusing the button
  closeBtn.addEventListener('click', () => closeBtn.blur());         // if it somehow gets focus, blur it

  // Click outside inner to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // ESC to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
})();
