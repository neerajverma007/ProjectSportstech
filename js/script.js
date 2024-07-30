console.clear();

const canvas = document.getElementById("hero-lightpass");
const context = canvas.getContext("2d");
const loader = document.getElementById("loader");

// Canvas dimensions
const canvasDimensions = { width: 1440, height: 900 };
canvas.width = canvasDimensions.width;
canvas.height = canvasDimensions.height;

// Frame settings
const frameCount = 732;
const imagePaths = Array.from(
  { length: frameCount },
  (_, i) =>
    `images/1440х900/v_01/1440х900_${(i + 49).toString().padStart(4, "0")}.png`
);

let images = [];
const chunkSize = 50; // I want it to Load images in chunks
let imagesLoaded = 0;

// Function to load a chunk of images
const loadImageChunk = (startIndex, endIndex) => {
  for (let i = startIndex; i < endIndex; i++) {
    const img = new Image();
    img.src = imagePaths[i];
    img.onload = () => {
      images[i] = img;
      imagesLoaded++;
      if (imagesLoaded === frameCount) {
        hideLoader();
        initAnimation(); // Start animation only when all images are loaded
      }
    };
    img.onerror = () => console.error(`Error loading image: ${imagePaths[i]}`);
  }
};

// Show the loader
const showLoader = () => {
  loader.classList.remove("hidden");
};

// Hide the loader
const hideLoader = () => {
  loader.classList.add("hidden");
};

// Preload images in chunks
const preloadImages = () => {
  showLoader();
  for (let i = 0; i < frameCount; i += chunkSize) {
    loadImageChunk(i, Math.min(i + chunkSize, frameCount));
  }
};

const airpods = { frame: 0 };

const render = () => {
  const frameIndex = Math.round(airpods.frame);
  if (frameIndex >= 0 && frameIndex < images.length && images[frameIndex]) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(images[frameIndex], 0, 0);
  }
};

const initAnimation = () => {
  gsap.to(airpods, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
      trigger: ".canvas-container",
      start: "top top",
      end: "+=7000",
      markers: false,
      scrub: 1,
      pin: true,
    },
    onUpdate: render,
  });
};

// Start preloading images and then initialize animation
preloadImages();
