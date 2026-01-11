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
    ></a>
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10 5H8.59C7.711 5 7 5.711 7 6.59V15.41C7 16.289 7.711 17 8.59 17H17.41C18.289 17 19 16.289 19 15.41V14M21 3h-8m8 0l-8 8m8 0V5"
        ></path>
      </svg>
    </a>
  `;

  return div;
}

/**
 * Create a video element
 */
function createVideoElement(item, category) {
  const div = document.createElement("div");
  div.className = `category-content ${category}-item`;
  div.setAttribute("data-link", item.link);

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
    const response = await fetch(`config/${category}.json`);
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
  // Refresh items in case they were dynamically added
  refreshCategoryItems();

  // Hide all items by adding hidden class
  categoryItems.forEach((item) => {
    item.classList.add("category-hidden");
  });

  // Remove existing skeleton loader
  const existingSkeleton = document.querySelector(".skeleton-item");
  if (existingSkeleton) {
    existingSkeleton.remove();
  }

  // Show only items matching the selected category
  const selectedItems = document.querySelectorAll(`.${category}-item`);
  selectedItems.forEach((item) => {
    item.classList.remove("category-hidden");
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

  // Drag and pan variables
  let isDragging = false;
  let startX, startY, scrollLeft, scrollTop;
  let offsetX = 0,
    offsetY = 0;

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
      offsetX = 0;
      offsetY = 0;

      if (img && img.src) {
        // Handle image content
        const clonedImg = img.cloneNode();
        clonedImg.id = "lightbox-image";
        lightboxContent.appendChild(clonedImg);

        // Add link icon if it exists
        if (linkIcon) {
          const clonedLinkIcon = linkIcon.cloneNode(true);
          clonedLinkIcon.classList.add("lightbox-link-icon");
          lightboxContent.appendChild(clonedLinkIcon);
        }

        lightboxModal.classList.add("active");
        document.body.style.overflow = "hidden";

        // Add drag and pan functionality
        setupImageDragPan(clonedImg);
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

  /**
   * Setup drag and pan functionality for zoomed images
   */
  function setupImageDragPan(img) {
    const zoomControls = document.querySelector(".lightbox-zoom-controls");
    img.style.cursor = "grab";
    img.style.transition = "none";

    img.addEventListener("mousedown", (e) => {
      // Only allow dragging if image is zoomed in
      const currentZoom = parseFloat(
        img.style.transform?.match(/scale\(([^)]+)\)/) || [1, 1]
      )[1];
      if (currentZoom <= 1) return;

      isDragging = true;
      startX = e.pageX;
      startY = e.pageY;
      img.style.cursor = "grabbing";

      // Hide zoom controls while dragging
      if (zoomControls) {
        zoomControls.style.opacity = "0";
        zoomControls.style.pointerEvents = "none";
      }

      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      const deltaX = e.pageX - startX;
      const deltaY = e.pageY - startY;

      offsetX += deltaX;
      offsetY += deltaY;

      startX = e.pageX;
      startY = e.pageY;

      updateImageTransform(img);
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        img.style.cursor = "grab";

        // Show zoom controls again
        if (zoomControls) {
          zoomControls.style.opacity = "1";
          zoomControls.style.pointerEvents = "auto";
        }
      }
    });

    // Touch support for mobile
    img.addEventListener("touchstart", (e) => {
      const currentZoom = parseFloat(
        img.style.transform?.match(/scale\(([^)]+)\)/) || [1, 1]
      )[1];
      if (currentZoom <= 1 || e.touches.length > 1) return;

      isDragging = true;
      startX = e.touches[0].pageX;
      startY = e.touches[0].pageY;

      // Hide zoom controls while dragging
      if (zoomControls) {
        zoomControls.style.opacity = "0";
        zoomControls.style.pointerEvents = "none";
      }

      e.preventDefault();
    });

    document.addEventListener("touchmove", (e) => {
      if (!isDragging || !e.touches[0]) return;

      const deltaX = e.touches[0].pageX - startX;
      const deltaY = e.touches[0].pageY - startY;

      offsetX += deltaX;
      offsetY += deltaY;

      startX = e.touches[0].pageX;
      startY = e.touches[0].pageY;

      updateImageTransform(img);
    });

    document.addEventListener("touchend", () => {
      if (isDragging) {
        isDragging = false;

        // Show zoom controls again
        if (zoomControls) {
          zoomControls.style.opacity = "1";
          zoomControls.style.pointerEvents = "auto";
        }
      }
    });
  }

  /**
   * Update image transform with zoom and pan
   */
  function updateImageTransform(img) {
    const currentZoom = parseFloat(
      img.style.transform?.match(/scale\(([^)]+)\)/) || [1, 1]
    )[1];

    // Limit pan based on zoom level
    const maxOffsetX = (img.offsetWidth * (currentZoom - 1)) / 2;
    const maxOffsetY = (img.offsetHeight * (currentZoom - 1)) / 2;

    offsetX = Math.max(-maxOffsetX, Math.min(maxOffsetX, offsetX));
    offsetY = Math.max(-maxOffsetY, Math.min(maxOffsetY, offsetY));

    img.style.transform = `scale(${currentZoom}) translate(${offsetX}px, ${offsetY}px)`;
  }

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

    // ========================================
    // AUDIO LOGIC: Mute by default, unmute on interaction
    // ========================================

    // Set initial state: muted by default
    video.muted = true;
    video.volume = 1; // Keep volume at max, but muted
    volumeSlider.value = 100; // Slider shows 100% but video is muted

    // Track if user has interacted with volume controls
    let userHasInteractedWithVolume = false;

    // Update volume SVG to show muted state initially
    updateVolumeSvg(volumeBtn, 0);

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

    // Volume slider - adjust volume and unmute on first interaction
    const handleVolumeChange = () => {
      const volume = parseFloat(volumeSlider.value) / 100;
      video.volume = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1

      // On first interaction with slider, unmute
      if (!userHasInteractedWithVolume) {
        userHasInteractedWithVolume = true;
        video.muted = false;
      }

      // Ensure muted state reflects actual volume
      if (volume === 0) {
        video.muted = true;
      } else if (video.muted) {
        video.muted = false;
      }

      updateVolumeSvg(volumeBtn, video.muted ? 0 : video.volume);
    };

    volumeSlider.addEventListener("input", handleVolumeChange);
    volumeSlider.addEventListener("change", handleVolumeChange);

    // Volume slider - smooth interaction feedback
    volumeSlider.addEventListener("mousedown", (e) => {
      volumeSlider.style.cursor = "grabbing";
      e.preventDefault();
      handleVolumeChange();
    });

    volumeSlider.addEventListener("mousemove", (e) => {
      if (e.buttons === 1) {
        // Left mouse button is pressed
        handleVolumeChange();
      }
    });

    document.addEventListener("mouseup", () => {
      if (volumeSlider === document.activeElement) {
        volumeSlider.blur();
      }
      volumeSlider.style.cursor = "grab";
    });

    // Touch support for volume slider
    volumeSlider.addEventListener("touchstart", (e) => {
      e.preventDefault();
      updateVolumeFromTouch(e, volumeSlider, video, volumeBtn, () => {
        if (!userHasInteractedWithVolume) {
          userHasInteractedWithVolume = true;
          video.muted = false;
        }
      });
    });

    volumeSlider.addEventListener("touchmove", (e) => {
      e.preventDefault();
      updateVolumeFromTouch(e, volumeSlider, video, volumeBtn, () => {
        if (!userHasInteractedWithVolume) {
          userHasInteractedWithVolume = true;
          video.muted = false;
        }
      });
    });

    volumeSlider.addEventListener("touchend", () => {
      handleVolumeChange();
    });

    // Volume button - toggle mute on first click, then toggle between mute states
    volumeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();

      // On first interaction, unmute and set to 50%
      if (!userHasInteractedWithVolume) {
        userHasInteractedWithVolume = true;
        video.muted = false;
        volumeSlider.value = 50;
        video.volume = 0.5;
        updateVolumeSvg(volumeBtn, 0.5);
      } else {
        // Toggle mute state
        video.muted = !video.muted;
        updateVolumeSvg(volumeBtn, video.muted ? 0 : video.volume);
      }
    });

    // Add visual feedback for volume button
    volumeBtn.addEventListener("mousedown", (e) => {
      volumeBtn.style.transform = "scale(0.92)";
      volumeBtn.style.transition = "transform 0.1s ease";
    });

    document.addEventListener("mouseup", () => {
      volumeBtn.style.transform = "scale(1)";
    });

    // Keyboard support for volume (use arrow keys when focused on slider)
    volumeSlider.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        volumeSlider.value = Math.max(0, parseFloat(volumeSlider.value) - 5);
        handleVolumeChange();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        volumeSlider.value = Math.min(100, parseFloat(volumeSlider.value) + 5);
        handleVolumeChange();
      }
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
 * Update volume SVG based on volume level with smooth transitions
 */
function updateVolumeSvg(btn, volume) {
  btn.innerHTML = "";
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.style.stroke = "#f4f4f9";
  svg.style.strokeWidth = "2";
  svg.style.fill = "#f4f4f9";
  svg.style.transition = "all 0.2s ease";

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

/**
 * Update volume from touch input
 */
function updateVolumeFromTouch(e, slider, video, btn, callback) {
  const touch = e.touches[0];
  const rect = slider.getBoundingClientRect();
  const percent = Math.max(
    0,
    Math.min(1, (touch.clientX - rect.left) / rect.width)
  );
  slider.value = Math.round(percent * 100);
  const volume = percent;
  video.volume = volume;
  updateVolumeSvg(btn, video.muted ? 0 : volume);
  if (callback) callback();
}

// Initialize when DOM is ready
window.addEventListener("load", function () {
  initPortfolioWithDynamicImages();
  initShowMore();
  initVideoPlayer();
  initLinkHandlers();
});
