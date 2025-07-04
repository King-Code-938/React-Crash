// CRA-compatible service worker registration
export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(reg => console.log('✅ ServiceWorker registered:', reg.scope))
        .catch(err => console.error('❌ ServiceWorker registration failed:', err));
    });
  }
}
