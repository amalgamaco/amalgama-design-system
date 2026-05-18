/* ═══════════════════════════════════════
   Amalgama DS — Documentation JS
═══════════════════════════════════════ */

// Copy to clipboard
document.addEventListener('click', function(e) {
  const btn = e.target.closest('.docs-copy-btn');
  if (!btn) return;
  const wrapper = btn.closest('.docs-code-wrapper');
  const code = wrapper.querySelector('code');
  if (!code) return;
  navigator.clipboard.writeText(code.textContent).then(function() {
    btn.textContent = 'Copiado!';
    btn.classList.add('copied');
    setTimeout(function() {
      btn.textContent = 'Copiar';
      btn.classList.remove('copied');
    }, 1500);
  });
});

// Tab toggling (for tabs demo)
document.addEventListener('click', function(e) {
  const tab = e.target.closest('.docs-demo-tab');
  if (!tab) return;
  const container = tab.closest('.docs-demo-tabs');
  if (!container) return;
  container.querySelectorAll('.docs-demo-tab').forEach(function(t) { t.classList.remove('active'); });
  container.querySelectorAll('.docs-demo-panel').forEach(function(p) { p.classList.remove('active'); });
  tab.classList.add('active');
  const panel = container.querySelector('[data-panel="' + tab.dataset.tab + '"]');
  if (panel) panel.classList.add('active');
});

// Modal demo
document.addEventListener('click', function(e) {
  if (e.target.closest('.docs-modal-trigger')) {
    var overlay = document.querySelector('.docs-modal-demo-overlay');
    if (overlay) overlay.style.display = 'flex';
  }
  if (e.target.closest('.docs-modal-demo-close') || e.target.classList.contains('docs-modal-demo-overlay')) {
    var overlay = document.querySelector('.docs-modal-demo-overlay');
    if (overlay) overlay.style.display = 'none';
  }
});

// Toast demo
document.addEventListener('click', function(e) {
  if (!e.target.closest('.docs-toast-trigger')) return;
  var type = e.target.dataset.type || 'success';
  var container = document.querySelector('.docs-toast-demo-container');
  if (!container) return;
  var icons = {
    success: '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>',
    error: '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>',
    info: '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>'
  };
  var messages = {
    success: 'Operacion completada con exito',
    error: 'Ha ocurrido un error inesperado',
    info: 'Informacion actualizada correctamente'
  };
  var toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.innerHTML = '<span class="toast-icon" style="color:var(--' + (type === 'info' ? 'accent' : type === 'success' ? 'green' : 'red') + ')">' + icons[type] + '</span><span class="toast-message">' + messages[type] + '</span>';
  container.appendChild(toast);
  setTimeout(function() { toast.remove(); }, 3000);
});
