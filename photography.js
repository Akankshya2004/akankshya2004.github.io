const galleryGrid = document.getElementById('galleryGrid');
const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

function renderGallery(images) {
  if (!galleryGrid) return;
  galleryGrid.innerHTML = '';

  images.forEach((src, index) => {
    const tile = document.createElement('figure');
    tile.className = 'gallery-item';

    const img = document.createElement('img');
    img.src = src;
    img.alt = `Photography ${index + 1}`;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.draggable = false;

    const watermark = document.createElement('span');
    watermark.className = 'gallery-watermark';
    watermark.textContent = '© Akankshya Ingale';

    tile.appendChild(img);
    tile.appendChild(watermark);
    galleryGrid.appendChild(tile);
  });
}

function renderEmptyState() {
  if (!galleryGrid) return;
  galleryGrid.innerHTML = '';
  for (let i = 0; i < 8; i += 1) {
    const tile = document.createElement('div');
    tile.className = 'gallery-item gallery-placeholder';
    tile.textContent = 'Add a JPG/PNG to Assets/gallery';
    galleryGrid.appendChild(tile);
  }
}

function loadFromEndpoint(endpoint) {
  return fetch(endpoint, { credentials: 'omit' })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
    .then((data) => Array.isArray(data) ? data : [])
    .catch(() => []);
}

function loadManifest(manifestPath) {
  return fetch(manifestPath, { cache: 'no-store' })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
    .then((data) => Array.isArray(data) ? data : [])
    .catch(() => []);
}

function filterImages(paths) {
  return paths.filter((path) => {
    const lower = path.toLowerCase();
    return supportedExtensions.some((ext) => lower.endsWith(ext));
  });
}

function disableImageCopyShortcuts() {
  document.addEventListener('contextmenu', (event) => {
    if (event.target.closest('.gallery-grid')) {
      event.preventDefault();
    }
  });

  document.addEventListener('dragstart', (event) => {
    if (event.target.closest('.gallery-grid')) {
      event.preventDefault();
    }
  });
}

const endpoint = document.body ? document.body.dataset.galleryEndpoint : '';
const manifestPath = document.body ? document.body.dataset.galleryManifest : '';

if (endpoint) {
  loadFromEndpoint(endpoint).then((images) => {
    const filtered = filterImages(images);
    if (filtered.length) {
      renderGallery(filtered);
    } else {
      renderEmptyState();
    }
  });
} else if (manifestPath) {
  loadManifest(manifestPath).then((images) => {
    const filtered = filterImages(images);
    if (filtered.length) {
      renderGallery(filtered);
    } else {
      renderEmptyState();
    }
  });
} else {
  renderEmptyState();
}

disableImageCopyShortcuts();
