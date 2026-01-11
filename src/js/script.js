// ========================================
// PORTFOLIO INITIALIZATION
// ========================================

/**
 * Update footer year to current year
 */
function updateFooterYear() {
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// ========================================
// DYNAMIC CONTENT LOADING
// ========================================

/**
 * Create an image element
 */
function createImageElement(item, category) {
  const div = document.createElement("div");
  div.className = `category-content ${category}-item`;
  div.setAttribute("data-link", item.link);
  if (item.tags) {
    div.setAttribute("data-tags", JSON.stringify(item.tags));
  }

  div.innerHTML = `
    <img src="${item.src}" alt="${item.alt}" />
    <button class="view-icon" aria-label="View larger">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="6"></circle>
        <path d="M14 14l6 6"></path>
      </svg>
    </button>
    <a
      class="link-icon"
      aria-label="Visit project"
      href="#"
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10 5H8.59C7.711 5 7 5.711 7 6.59V15.41C7 16.289 7.711 17 8.59 17H17.41C18.289 17 19 16.289 19 15.41V14M21 3h-8m8 0l-8 8m8 0V5"
        ></path>
      </svg>
    </a>
  `;

  // Load image to detect its dimensions and apply aspect ratio dynamically
  const img = new Image();
  img.onload = function () {
    const aspectRatio = this.width / this.height;
    div.style.setProperty("--aspect-ratio", aspectRatio);
  };
  img.src = item.src;

  return div;
}

/**
 * Create a video element
 */
function createVideoElement(item, category) {
  const div = document.createElement("div");
  div.className = `category-content ${category}-item`;
  div.setAttribute("data-link", item.link);
  if (item.tags) {
    div.setAttribute("data-tags", JSON.stringify(item.tags));
  }

  // Check if it's a GIF file
  const isGif = item.src.toLowerCase().endsWith(".gif");

  if (isGif) {
    // For GIFs, use an img tag (animated GIFs loop automatically)
    div.innerHTML = `
      <img src="${item.src}" alt="${item.alt}" class="gif-player" />
      <button class="view-icon" aria-label="View larger">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="6"></circle>
          <path d="M14 14l6 6"></path>
        </svg>
      </button>
    `;
  } else {
    // For MP4 videos, use video element with controls
    div.innerHTML = `
      <video class="custom-video-player" playsinline muted autoplay loop>
        <source src="${item.src}" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div class="video-controls">
        <div class="progress-bar">
          <div class="progress"></div>
          <div class="buffered"></div>
        </div>
        <div class="controls-bottom">
          <button class="play-btn" aria-label="Play">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <polygon points="5 3 19 12 5 21"></polygon>
            </svg>
          </button>
          <div class="volume-control">
            <button class="volume-btn" aria-label="Mute">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <polygon points="3 9 7 9 11 5 11 19 7 15 3 15"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
              </svg>
            </button>
            <input type="range" class="volume-slider" min="0" max="100" value="0" aria-label="Volume" />
          </div>
          <div class="time-display">
            <span class="current-time">0:00</span>
            <span class="duration">0:00</span>
          </div>
          <button class="fullscreen-btn" aria-label="Fullscreen">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m16 0V5a2 2 0 0 0-2-2h-3m0 16h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
            </svg>
          </button>
        </div>
      </div>
      <button class="view-icon" aria-label="View larger">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="6"></circle>
          <path d="M14 14l6 6"></path>
        </svg>
      </button>
    `;
  }

  return div;
}

/**
 * Create a 3D model element
 */
function create3DElement(item, category) {
  const div = document.createElement("div");
  div.className = `category-content three-d-item ${category}-item`;
  div.setAttribute("data-orientation", item.orientation || "portrait");
  div.setAttribute("data-link", item.link);
  if (item.tags) {
    div.setAttribute("data-tags", JSON.stringify(item.tags));
  }

  div.innerHTML = `
    <model-viewer src="${item.src}" alt="${item.alt}" auto-rotate camera-controls></model-viewer>
    <button class="view-icon" aria-label="View larger">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="6"></circle>
        <path d="M14 14l6 6"></path>
      </svg>
    </button>
  `;

  return div;
}

/**
 * Load content from config files and dynamically add them to the DOM
 * @param {string} category - The category to load (images, videos, 3d, web, personal)
 * @param {string} type - The type of content (image, video, 3d)
 */
async function loadCategoryFromConfig(category, type) {
  try {
    const response = await fetch(`./config/${category}.json`);
    const data = await response.json();
    const categoryWrapper = document.querySelector(".category-wrapper");

    if (!categoryWrapper) return;

    // Get the key for the category data
    const key = Object.keys(data)[0];
    const items = data[key];

    if (!items || items.length === 0) return;

    // Find and remove existing items for this category
    const existingItems = categoryWrapper.querySelectorAll(`.${category}-item`);
    existingItems.forEach((item) => item.remove());

    // Create and insert new elements
    let createFunc;
    if (type === "image") {
      createFunc = createImageElement;
    } else if (type === "video") {
      createFunc = createVideoElement;
    } else if (type === "3d") {
      createFunc = create3DElement;
    }

    items.forEach((item) => {
      const element = createFunc(item, category);
      const showMoreBtn = categoryWrapper.querySelector(".show-more-btn");
      if (showMoreBtn) {
        categoryWrapper.insertBefore(element, showMoreBtn);
      } else {
        categoryWrapper.appendChild(element);
      }
    });

    // Re-initialize for new elements
    if (type === "image") {
      initIconContrast();
    } else if (type === "video") {
      initVideoPlayer();
    }
  } catch (error) {
    console.error(`Failed to load ${category} config:`, error);
  }
}

/**
 * Load images from config and dynamically add them to the DOM
 */
async function loadImagesFromConfig() {
  await loadCategoryFromConfig("images", "image");
}

// ========================================
// CATEGORY FILTER SYSTEM
// ========================================

const SELECTORS = {
  categoryBtn: ".category-btn",
  categoryContent: ".category-content",
  activeClass: "active",
};

const DEFAULT_CATEGORY = "images";
let currentCategory = DEFAULT_CATEGORY;

let categoryButtons = document.querySelectorAll(SELECTORS.categoryBtn);
let categoryItems = document.querySelectorAll(SELECTORS.categoryContent);

/**
 * Refresh category items reference (call after dynamically adding items)
 */
function refreshCategoryItems() {
  categoryItems = document.querySelectorAll(SELECTORS.categoryContent);
}

/**
 * Filter portfolio items by category
 * @param {string} category - The category to filter by
 */
function filterByCategory(category) {
  // Update current category
  currentCategory = category;

  // Refresh items in case they were dynamically added
  refreshCategoryItems();

  // Hide all items
  categoryItems.forEach((item) => {
    item.style.display = "none";
  });

  // Remove existing skeleton loader
  const existingSkeleton = document.querySelector(".skeleton-item");
  if (existingSkeleton) {
    existingSkeleton.remove();
  }

  // Show only items matching the selected category
  const selectedItems = document.querySelectorAll(`.${category}-item`);
  selectedItems.forEach((item) => {
    item.style.display = "flex";
  });

  // If no items found, show skeleton loader
  if (selectedItems.length === 0) {
    const skeletonLoader = document.createElement("div");
    skeletonLoader.className = "category-content skeleton-item";
    skeletonLoader.innerHTML = `
      <div class="skeleton-loader"></div>
      <p class="skeleton-text">Coming Soon</p>
    `;
    const categoryWrapper = document.querySelector(".category-wrapper");
    categoryWrapper.insertBefore(skeletonLoader, categoryWrapper.firstChild);
  }

  // Update button styling
  categoryButtons.forEach((btn) => {
    btn.classList.remove(SELECTORS.activeClass);
  });

  // Mark the clicked button as active
  const activeButton = document.querySelector(`[data-category="${category}"]`);
  if (activeButton) {
    activeButton.classList.add(SELECTORS.activeClass);
  }

  // Reset tag filters when switching categories
  selectedTags.clear();

  // Reinitialize tag buttons for the new category
  initTagSystem();
}

/**
 * Initialize category button click listeners
 */
function initCategoryFilters() {
  categoryButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const category = this.getAttribute("data-category");
      filterByCategory(category);
    });
  });
}

/**
 * Initialize portfolio on page load
 */
function initPortfolio() {
  updateFooterYear();
  initCategoryFilters();
  initLightbox();
  initIconContrast();

  // Show default category
  filterByCategory(DEFAULT_CATEGORY);
}

/**
 * Initialize everything including loading dynamic images
 */
async function initPortfolioWithDynamicImages() {
  // Load all categories in parallel
  await Promise.all([
    loadCategoryFromConfig("images", "image"),
    loadCategoryFromConfig("videos", "video"),
    loadCategoryFromConfig("3d", "3d"),
    loadCategoryFromConfig("personal", "image"),
    loadCategoryFromConfig("web", "image"),
  ]);

  // Initialize all portfolio functionality
  initPortfolio();
  initTagSystem();
}

// ========================================
// TAG FILTERING SYSTEM
// ========================================

let selectedTags = new Set();

/**
 * Extract all unique tags from the current category's items
 */
function getAllTags() {
  const categoryWrapper = document.querySelector(".category-wrapper");
  if (!categoryWrapper) return [];

  const allTags = new Set();
  // Only get items from the current category that are visible (not hidden by category filter)
  const items = categoryWrapper.querySelectorAll(`.${currentCategory}-item`);

  items.forEach((item) => {
    const tags = item.getAttribute("data-tags");
    if (tags) {
      const itemTags = JSON.parse(tags);
      itemTags.forEach((tag) => allTags.add(tag));
    }
  });

  return Array.from(allTags).sort();
}

/**
 * Initialize tag filtering system
 */
function initTagSystem() {
  const allTags = getAllTags();

  // Create tag filter container if it doesn't exist
  let tagContainer = document.querySelector(".tag-filter-container");
  if (!tagContainer) {
    const categoryDiv = document.querySelector(".category-div");
    tagContainer = document.createElement("div");
    tagContainer.className = "tag-filter-container";
    categoryDiv.parentNode.insertBefore(tagContainer, categoryDiv.nextSibling);
  }

  // Clear and populate tags
  tagContainer.innerHTML = '<div class="tag-label">Filter by Tags:</div>';
  const tagButtonsContainer = document.createElement("div");
  tagButtonsContainer.className = "tag-buttons";

  allTags.forEach((tag) => {
    const btn = document.createElement("button");
    btn.className = "tag-btn";
    btn.textContent = "#" + tag;
    btn.setAttribute("data-tag", tag);

    btn.addEventListener("click", () => {
      toggleTag(tag, btn);
    });

    tagButtonsContainer.appendChild(btn);
  });

  tagContainer.appendChild(tagButtonsContainer);
}

/**
 * Toggle tag selection
 */
function toggleTag(tag, btn) {
  if (selectedTags.has(tag)) {
    selectedTags.delete(tag);
    btn.classList.remove("active");
  } else {
    selectedTags.add(tag);
    btn.classList.add("active");
  }

  filterContentByTags();
}

/**
 * Filter content based on selected tags
 */
function filterContentByTags() {
  const categoryWrapper = document.querySelector(".category-wrapper");
  const items = categoryWrapper.querySelectorAll(".category-content");

  items.forEach((item) => {
    const tags = item.getAttribute("data-tags");
    let shouldShow = true;

    // First check if item belongs to current category
    const belongsToCategory = item.classList.contains(
      `${currentCategory}-item`
    );
    if (!belongsToCategory) {
      shouldShow = false;
    } else if (selectedTags.size === 0) {
      // If no tags are selected, show all items in current category
      shouldShow = true;
    } else if (tags) {
      // If tags are selected, show only if item has at least one matching tag
      const itemTags = JSON.parse(tags);
      shouldShow = itemTags.some((tag) => selectedTags.has(tag));
    } else {
      // If item has no tags and filters are active, hide it
      shouldShow = false;
    }

    item.style.display = shouldShow ? "flex" : "none";
  });
}

// ========================================
// ICON CONTRAST DETECTION
// ========================================

/**
 * Calculate brightness of an image
 * @param {HTMLImageElement} img - The image element
 * @returns {number} Brightness value (0-255)
 */
function getImageBrightness(img) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;

  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  let totalBrightness = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Calculate luminance using standard formula
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    totalBrightness += brightness;
  }

  return totalBrightness / (data.length / 4);
}

/**
 * Initialize contrast-aware icon colors
 */
function initIconContrast() {
  const viewIcons = document.querySelectorAll(".view-icon");
  const linkIcons = document.querySelectorAll(".link-icon");

  // Handle view icons
  viewIcons.forEach((icon) => {
    const parentContent = icon.closest(".category-content");
    const img = parentContent.querySelector("img");

    if (img) {
      // Wait for image to load before analyzing
      if (img.complete) {
        updateIconContrast(icon, img);
      } else {
        img.addEventListener("load", function () {
          updateIconContrast(icon, img);
        });
      }
    }
  });

  // Handle link icons with same brightness detection
  linkIcons.forEach((icon) => {
    const parentContent = icon.closest(".category-content");
    const img = parentContent.querySelector("img");

    if (img) {
      // Wait for image to load before analyzing
      if (img.complete) {
        updateIconContrast(icon, img);
      } else {
        img.addEventListener("load", function () {
          updateIconContrast(icon, img);
        });
      }
    }
  });

  // Initialize link functionality
  initLinkHandlers();
}

/**
 * Update icon color based on image brightness
 * @param {HTMLElement} icon - The view icon element
 * @param {HTMLImageElement} img - The image element
 */
function updateIconContrast(icon, img) {
  try {
    const brightness = getImageBrightness(img);
    // If brightness is high (bright image), use dark icon; if dark, use light icon
    if (brightness > 128) {
      icon.classList.add("icon-dark");
      icon.classList.remove("icon-light");
    } else {
      icon.classList.add("icon-light");
      icon.classList.remove("icon-dark");
    }
  } catch (error) {
    // Fallback to light icon if analysis fails (e.g., CORS issues)
    icon.classList.add("icon-light");
  }
}

// ========================================
// LIGHTBOX FUNCTIONALITY
// ========================================

/**
 * Initialize lightbox modal functionality
 */
function initLightbox() {
  const lightboxModal = document.getElementById("lightbox-modal");
  const lightboxContent = document.getElementById("lightbox-content");
  const lightboxClose = document.querySelector(".lightbox-close");
  const viewIcons = document.querySelectorAll(".view-icon");

  let currentZoom = 1;
  const minZoom = 1;
  const maxZoom = 3;
  const zoomStep = 0.2;

  // Open lightbox when view icon is clicked
  viewIcons.forEach((icon) => {
    icon.addEventListener("click", function (e) {
      e.stopPropagation();
      const parentContent = this.closest(".category-content");
      const img = parentContent.querySelector("img");
      const modelViewer = parentContent.querySelector("model-viewer");
      const video = parentContent.querySelector("video");
      const linkIcon = parentContent.querySelector(".link-icon");

      // Clear previous content
      lightboxContent.innerHTML = "";
      currentZoom = 1;

      if (img && img.src) {
        // Handle image content
        const clonedImg = img.cloneNode();
        clonedImg.id = "lightbox-image";

        // Detect if image is portrait and constrain height
        const imgElement = new Image();
        imgElement.onload = function () {
          const isPortrait = this.height > this.width;
          if (isPortrait) {
            clonedImg.classList.add("lightbox-image-portrait");
          }
        };
        imgElement.src = img.src;

        lightboxContent.appendChild(clonedImg);

        // Add zoom controls for images
        const zoomControls = document.createElement("div");
        zoomControls.className = "lightbox-zoom-controls";
        zoomControls.innerHTML = `
          <button class="zoom-btn zoom-out" title="Zoom Out">−</button>
          <span class="zoom-level">100%</span>
          <button class="zoom-btn zoom-in" title="Zoom In">+</button>
        `;
        lightboxContent.appendChild(zoomControls);

        // Zoom functionality
        const zoomInBtn = zoomControls.querySelector(".zoom-in");
        const zoomOutBtn = zoomControls.querySelector(".zoom-out");
        const zoomLevel = zoomControls.querySelector(".zoom-level");

        zoomInBtn.addEventListener("click", () => {
          if (currentZoom < maxZoom) {
            currentZoom += zoomStep;
            clonedImg.style.transform = `scale(${currentZoom})`;
            zoomLevel.textContent = Math.round(currentZoom * 100) + "%";
          }
        });

        zoomOutBtn.addEventListener("click", () => {
          if (currentZoom > minZoom) {
            currentZoom -= zoomStep;
            clonedImg.style.transform = `scale(${currentZoom})`;
            zoomLevel.textContent = Math.round(currentZoom * 100) + "%";
          }
        });

        // Mouse wheel zoom
        clonedImg.addEventListener("wheel", (e) => {
          e.preventDefault();
          if (e.deltaY < 0) {
            if (currentZoom < maxZoom) {
              currentZoom += zoomStep;
            }
          } else {
            if (currentZoom > minZoom) {
              currentZoom -= zoomStep;
            }
          }
          clonedImg.style.transform = `scale(${currentZoom})`;
          zoomLevel.textContent = Math.round(currentZoom * 100) + "%";
        });

        // Drag to pan functionality
        let isDragging = false;
        let dragStartX = 0;
        let dragStartY = 0;
        let translateX = 0;
        let translateY = 0;

        clonedImg.addEventListener("mousedown", (e) => {
          if (currentZoom > 1) {
            isDragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            clonedImg.style.cursor = "grabbing";
          }
        });

        document.addEventListener("mousemove", (e) => {
          if (isDragging && currentZoom > 1) {
            const deltaX = e.clientX - dragStartX;
            const deltaY = e.clientY - dragStartY;

            translateX += deltaX;
            translateY += deltaY;

            clonedImg.style.transform = `scale(${currentZoom}) translate(${
              translateX / currentZoom
            }px, ${translateY / currentZoom}px)`;

            dragStartX = e.clientX;
            dragStartY = e.clientY;
          }
        });

        document.addEventListener("mouseup", () => {
          isDragging = false;
          clonedImg.style.cursor = currentZoom > 1 ? "grab" : "zoom-in";
        });

        // Change cursor based on zoom level
        clonedImg.addEventListener("mouseenter", () => {
          clonedImg.style.cursor = currentZoom > 1 ? "grab" : "zoom-in";
        });

        // Reset pan when zoom resets
        zoomInBtn.addEventListener("click", () => {
          if (currentZoom < maxZoom) {
            currentZoom += zoomStep;
            clonedImg.style.transform = `scale(${currentZoom}) translate(${
              translateX / currentZoom
            }px, ${translateY / currentZoom}px)`;
            zoomLevel.textContent = Math.round(currentZoom * 100) + "%";
          }
        });

        zoomOutBtn.addEventListener("click", () => {
          if (currentZoom > minZoom) {
            currentZoom -= zoomStep;
            if (currentZoom === minZoom) {
              translateX = 0;
              translateY = 0;
            }
            clonedImg.style.transform = `scale(${currentZoom}) translate(${
              translateX / currentZoom
            }px, ${translateY / currentZoom}px)`;
            zoomLevel.textContent = Math.round(currentZoom * 100) + "%";
          }
        });

        if (linkIcon) {
          const clonedLinkIcon = linkIcon.cloneNode(true);
          clonedLinkIcon.classList.add("lightbox-link-icon");
          lightboxContent.appendChild(clonedLinkIcon);
        }

        lightboxModal.classList.add("active");
        document.body.style.overflow = "hidden";
      } else if (video) {
        // Handle video content
        const clonedVideo = video.cloneNode(true);
        clonedVideo.classList.add("lightbox-video");
        lightboxContent.appendChild(clonedVideo);

        // Add link icon if it exists
        if (linkIcon) {
          const clonedLinkIcon = linkIcon.cloneNode(true);
          clonedLinkIcon.classList.add("lightbox-link-icon");
          lightboxContent.appendChild(clonedLinkIcon);
        }

        lightboxModal.classList.add("active");
        document.body.style.overflow = "hidden";
      } else if (modelViewer) {
        // Handle 3D model content
        const clonedModel = modelViewer.cloneNode(true);
        clonedModel.classList.add("lightbox-model-viewer");
        lightboxContent.appendChild(clonedModel);

        // Add link icon if it exists
        if (linkIcon) {
          const clonedLinkIcon = linkIcon.cloneNode(true);
          clonedLinkIcon.classList.add("lightbox-link-icon");
          lightboxContent.appendChild(clonedLinkIcon);
        }

        lightboxModal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  });

  // Close lightbox when close button is clicked
  if (lightboxClose) {
    lightboxClose.addEventListener("click", function () {
      closeLightbox();
    });
  }

  // Close lightbox when clicking outside the content
  lightboxModal.addEventListener("click", function (e) {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  // Close lightbox with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightboxModal.classList.contains("active")) {
      closeLightbox();
    }
  });
}

/**
 * Close the lightbox modal
 */
function closeLightbox() {
  const lightboxModal = document.getElementById("lightbox-modal");
  lightboxModal.classList.remove("active");
  document.body.style.overflow = "auto";
}

/**
 * Initialize link handlers for category items
 */
function initLinkHandlers() {
  const linkIcons = document.querySelectorAll(".link-icon");

  linkIcons.forEach((linkIcon) => {
    const parentContent = linkIcon.closest(".category-content");
    const linkUrl = parentContent.getAttribute("data-link");

    if (linkUrl && linkUrl !== "#") {
      linkIcon.href = linkUrl;
      linkIcon.style.pointerEvents = "auto";
    } else {
      // If no valid link, hide the link icon
      linkIcon.style.display = "none";
    }
  });
}

/**
 * Initialize show more functionality
 */
function initShowMore() {
  const showMoreBtn = document.getElementById("show-more-btn");
  const categoryWrapper = document.querySelector(".category-wrapper");

  if (!showMoreBtn) return;

  // Check if there are more than 15 items
  const totalItems = document.querySelectorAll(
    ".category-wrapper > .category-content"
  ).length;

  if (totalItems <= 15) {
    showMoreBtn.classList.add("hidden");
    return;
  }

  showMoreBtn.addEventListener("click", function () {
    // Add class to show hidden items
    categoryWrapper.classList.add("show-more-active");

    // Change button text and hide it
    showMoreBtn.classList.add("hidden");
  });
}

/**
 * Initialize custom video player
 */
function initVideoPlayer() {
  const videos = document.querySelectorAll(".custom-video-player");

  videos.forEach((video) => {
    const controls = video.parentElement.querySelector(".video-controls");
    if (!controls) return;

    const playBtn = controls.querySelector(".play-btn");
    const progressBar = controls.querySelector(".progress-bar");
    const progress = controls.querySelector(".progress");
    const volumeBtn = controls.querySelector(".volume-btn");
    const volumeSlider = controls.querySelector(".volume-slider");
    const currentTimeDisplay = controls.querySelector(".current-time");
    const durationDisplay = controls.querySelector(".duration");
    const fullscreenBtn = controls.querySelector(".fullscreen-btn");

    // Initialize video volume from slider
    const initialVolume = volumeSlider.value / 100;
    video.volume = initialVolume;
    updateVolumeSvg(volumeBtn, initialVolume);

    // Check if video has audio track
    const checkAudioTrack = () => {
      const hasAudio = video.audioTracks && video.audioTracks.length > 0;

      if (!hasAudio) {
        // Disable volume controls if no audio
        volumeBtn.disabled = true;
        volumeSlider.disabled = true;
        volumeBtn.style.opacity = "0.5";
        volumeSlider.style.opacity = "0.5";
        volumeBtn.style.cursor = "not-allowed";
        volumeSlider.style.cursor = "not-allowed";

        // Show 'x' icon for no audio
        const noAudioSvg = volumeBtn.querySelector("svg");
        if (noAudioSvg) {
          noAudioSvg.innerHTML =
            '<circle cx="12" cy="12" r="10"></circle><line x1="8" y1="16" x2="16" y2="8"></line><line x1="16" y1="16" x2="8" y2="8"></line>';
        }
      }
    };

    // Check audio on metadata load
    video.addEventListener("loadedmetadata", () => {
      durationDisplay.textContent = formatTime(video.duration);
      checkAudioTrack();
    });

    // Also check when video starts playing
    video.addEventListener(
      "play",
      () => {
        checkAudioTrack();
      },
      { once: true }
    );

    // Update progress bar
    video.addEventListener("timeupdate", () => {
      const percentage = (video.currentTime / video.duration) * 100;
      progress.style.width = percentage + "%";
      currentTimeDisplay.textContent = formatTime(video.currentTime);
    });

    // Play/Pause
    playBtn.addEventListener("click", () => {
      // Remove all existing SVGs first
      playBtn.querySelectorAll("svg").forEach((svg) => svg.remove());

      if (video.paused) {
        video.play();
        // Unmute and set volume to 30% when play is clicked
        video.muted = false;
        video.volume = 0.3;
        volumeSlider.value = 30;
        updateVolumeSvg(volumeBtn, 0.3);

        const pauseSvg = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        pauseSvg.setAttribute("viewBox", "0 0 24 24");
        pauseSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        pauseSvg.innerHTML =
          '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
        pauseSvg.style.fill = "#f4f4f9";
        playBtn.appendChild(pauseSvg);
      } else {
        video.pause();
        const playSvg = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        playSvg.setAttribute("viewBox", "0 0 24 24");
        playSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        playSvg.innerHTML = '<polygon points="5 3 19 12 5 21"></polygon>';
        playSvg.style.fill = "#f4f4f9";
        playBtn.appendChild(playSvg);
      }
    });

    // Progress bar seek
    progressBar.addEventListener("click", (e) => {
      const rect = progressBar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      video.currentTime = percent * video.duration;
    });

    // Volume control - unmute and set volume when slider is adjusted
    volumeSlider.addEventListener("input", () => {
      const volume = volumeSlider.value / 100;
      video.volume = volume;
      video.muted = false; // Unmute when user adjusts slider
      updateVolumeSvg(volumeBtn, volume);
    });

    // Volume button - toggle mute and set to 30% on first unmute
    volumeBtn.addEventListener("click", () => {
      if (video.muted) {
        video.muted = false;
        // Set volume to 30% when unmuting
        volumeSlider.value = 30;
        video.volume = 0.3;
      } else {
        video.muted = true;
      }
      updateVolumeSvg(volumeBtn, video.muted ? 0 : video.volume);
    });

    // Fullscreen
    fullscreenBtn.addEventListener("click", () => {
      const videoContainer = video.parentElement;
      if (!document.fullscreenElement) {
        videoContainer.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
    });
  });
}

/**
 * Format time to MM:SS
 */
function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Update volume SVG based on volume level
 */
function updateVolumeSvg(btn, volume) {
  btn.innerHTML = "";
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.style.stroke = "#f4f4f9";
  svg.style.strokeWidth = "2";
  svg.style.fill = "#f4f4f9";

  if (volume === 0) {
    svg.innerHTML =
      '<polygon points="3 9 7 9 11 5 11 19 7 15 3 15"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>';
  } else if (volume < 0.5) {
    svg.innerHTML =
      '<polygon points="3 9 7 9 11 5 11 19 7 15 3 15"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>';
  } else {
    svg.innerHTML =
      '<polygon points="3 9 7 9 11 5 11 19 7 15 3 15"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>';
  }
  btn.appendChild(svg);
}

// ========================================
// PUZZLE ANIMATION INITIALIZATION
// ========================================

/**
 * Initialize puzzle animation with piece positioning
 */
function initPuzzleAnimation() {
  const puzzleContainer = document.querySelector(".puzzle-container");
  const puzzlePieces = document.querySelectorAll(".puzzle-piece");

  if (!puzzleContainer || puzzlePieces.length === 0) {
    return;
  }

  // Wait for images to load to get their dimensions
  let loadedCount = 0;
  const pieces = Array.from(puzzlePieces);

  pieces.forEach((piece, index) => {
    piece.onload = function () {
      loadedCount++;
      if (loadedCount === pieces.length) {
        calculatePuzzlePositions(puzzleContainer, pieces);
      }
    };
    // Trigger load event if image is already cached
    if (piece.complete) {
      piece.onload();
    }
  });
}

/**
 * Calculate initial positions for puzzle pieces (scattered)
 */
function calculatePuzzlePositions(container, pieces) {
  // Get the first piece dimensions to estimate puzzle size
  const firstPiece = pieces[0];
  let pieceWidth = firstPiece.offsetWidth;
  let pieceHeight = firstPiece.offsetHeight;

  // If dimensions are still 0, try naturalWidth/Height
  if (pieceWidth === 0) {
    pieceWidth = firstPiece.naturalWidth || 300;
  }
  if (pieceHeight === 0) {
    pieceHeight = firstPiece.naturalHeight || 300;
  }

  // Set container dimensions based on first piece
  container.style.width = pieceWidth + "px";
  container.style.height = pieceHeight + "px";

  // Define scattered positions - pieces move outward from center in their direction
  const scatterOffsets = [
    { x: -35, y: -38, rot: -8 }, // p1 - upper left, move further upper-left
    { x: 38, y: -35, rot: 10 }, // p2 - upper right, move further upper-right
    { x: -38, y: 35, rot: 12 }, // p3 - lower left, move further lower-left
    { x: 36, y: 38, rot: -10 }, // p4 - lower right, move further lower-right
    { x: 42, y: -3, rot: -6 }, // p5 - right side, move further right
    { x: -40, y: 10, rot: 8 }, // p6 - left side, move further left
    { x: 12, y: -42, rot: -9 }, // p7 - top, move further upward
  ];

  pieces.forEach((piece, index) => {
    const offset = scatterOffsets[index] || { x: 0, y: 0, rot: 0 };
    piece.style.setProperty("--start-x", offset.x + "px");
    piece.style.setProperty("--start-y", offset.y + "px");
    piece.style.setProperty("--start-rot", offset.rot + "deg");
  });
}

// ========================================
// TOOLS INTERACTION
// ========================================

/**
 * Initialize tools grid with click/hover interactions
 */
function initToolsInteraction() {
  const toolItems = document.querySelectorAll(".tool-item");

  // Desktop hover handling
  toolItems.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      // Remove active class from all items
      toolItems.forEach((i) => i.classList.remove("active"));
      // Add to hovered item
      this.classList.add("active");
    });
  });

  // Mobile/Touch click handling
  const toolsGrid = document.querySelector(".tools-grid");
  if (toolsGrid) {
    toolsGrid.addEventListener("click", function (e) {
      const toolItem = e.target.closest(".tool-item");
      if (!toolItem) return;

      // Prevent hover state from interfering on mobile
      toolItems.forEach((item) => {
        if (item !== toolItem) {
          item.classList.remove("active");
        }
      });

      // Toggle active state for clicked item
      toolItem.classList.toggle("active");
    });
  }

  // Remove active state when mouse leaves the grid on desktop
  if (toolsGrid) {
    toolsGrid.addEventListener("mouseleave", function () {
      toolItems.forEach((item) => item.classList.remove("active"));
    });
  }
}

// Initialize when DOM is ready
window.addEventListener("load", function () {
  initPortfolioWithDynamicImages();
  initShowMore();
  initVideoPlayer();
  initLinkHandlers();
  initPuzzleAnimation();
  initToolsInteraction();
});
