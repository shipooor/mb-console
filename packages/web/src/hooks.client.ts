// Handle stale chunk loading errors after redeployment.
// When Cloudflare Pages serves a new build, old cached HTML may reference
// chunk hashes that no longer exist. The server returns 200.html (HTML)
// instead of JS, causing a MIME type error. Auto-reload fixes this.
window.addEventListener('vite:preloadError', () => {
	window.location.reload();
});
