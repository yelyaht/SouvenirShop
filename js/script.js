// --- Add to cart: always +1 ---
window.addToCart = function(itemName) {
  alert(`Added 1 × ${itemName} to your cart! Functionality coming soon...`);
};

// --- Image Modal ---
(function () {
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
    modal.focus?.();
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
    modalImg.src = '';
    modalImg.alt = '';
  }

  // Click any product image to open
  document.addEventListener('click', (e) => {
    const img = e.target.closest('.card-image img');
    if (!img) return;

    const fullSrc = img.getAttribute('data-full') || img.src;
    const alt = img.getAttribute('alt') || '';

    // caption = the card's H3 text
    const card = img.closest('.creature-card');
    const captionText = card ? (card.querySelector('h3')?.innerText || '') : '';

    openModal(fullSrc, alt, captionText);
  });
}

/* Close button focus styling */
.modal-close {
  outline: none;              /* remove default ring */
  box-shadow: none;           /* Safari sometimes uses box-shadow */
  -webkit-tap-highlight-color: transparent; /* mobile tap flash */
}

/* If any browser still shows a ring on non-keyboard focus, nuke it */
.modal-close:focus:not(:focus-visible) {
  outline: none;
  box-shadow: none;
}

  // Close actions
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(); // click outside inner
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
})();
