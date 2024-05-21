const canvas = document.querySelector("canvas");
const toolBtns = document.querySelectorAll(".tool");
const fillColor = document.querySelector("#fill-color");
const sizeSlider = document.querySelector("#size-slider");
const colorBtns = document.querySelectorAll(".colors .option");
const colorPicker = document.querySelector("#color-picker");
const clearCanvas = document.querySelector(".clear-canvas");
const saveImg = document.querySelector(".save-img");
const ctx = canvas.getContext("2d"); // getContext() method returns a drawing context on the canvas

/**
 * Global variables with with default value
 */
let prevMouseX,
  prevMouseY,
  snapshot,
  isDrawing = false,
  selectedTool = "brush",
  brushWidth = 5,
  selectedColor = "#000";

const setCanvasBackground = () => {
  /**
   * Setting whole canvas to white, so the downloaded img background will be white
   */
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  /**
   * Setting fillStyle back to the selectedColor, It will be the brush color
   */
  ctx.fillStyle = selectedColor;
};

window.addEventListener("load", () => {
  /**
   * Setting canvas width/height
   * offsetWidth/offsetHeight returns viewable width/height of an element
   */
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});

const startDraw = (e) => {
  isDrawing = true;
  /**
   * Passing current mouseX position as prevMouseX value
   */
  prevMouseX = e.offsetX;
  /**
   * passing current mouseY position as prevMouseY vlaue
   */
  prevMouseY = e.offsetY;
  /**
   * Creating new path to draw
   */
  ctx.beginPath();
  /**
   * passing brushSize as line width
   */
  ctx.lineWidth = brushWidth;
  /**
   * Passing selectedColor as stroke style
   */
  ctx.strokeStyle = selectedColor;
  /**
   * Passing selectedColor as fill style
   */
  ctx.fillStyle = selectedColor;
  /**
   * getImageData() method returns an ImageData object that copies the pixel data
   * Coping canvas data & passing as snapshot value.. this avoids dragging the image
   */
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const drawRect = (e) => {
  /**
   * If fillColor isn't checked draw a rect with border else draw rect with background
   */
  if (!fillColor.checked) {
    /**
     * strokeRect() method draws a rectangle (no fill)
     * It takes strokeRect(x, y, width, height) for rectangle
     * To get width & height for rect, we will create global variables and pass mouse down values
     */
    return ctx.strokeRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    );
  }

  ctx.fillRect(
    e.offsetX,
    e.offsetY,
    prevMouseX - e.offsetX,
    prevMouseY - e.offsetY
  );
};

const drawCircle = (e) => {
  /**
   * Creating new path to draw circle
   */
  ctx.beginPath();
  /**
   * Getting radius for cirle according to the mouse pointer
   */
  const radius = Math.sqrt(
    Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)
  );
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawTriangle = (e) => {
  /**
   * Creating new path to draw circle
   */
  ctx.beginPath();
  /**
   * Moving triangle to the mouse pointer
   */
  ctx.moveTo(prevMouseX, prevMouseY);
  /**
   * creating first line according to the mouse pointer
   */
  ctx.lineTo(e.offsetX, e.offsetY);
  /**
   * Creating bottom line of the triangle
   */
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
  /**
   * Closing path of a triangle so the third line draw automatically
   */
  ctx.closePath();
  /**
   * If fillColor is checked fill triangle else draw border
   */
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawing = (e) => {
  /**
   * If isDrawing is false return from here
   */
  if (!isDrawing) return;
  /**
   * Adding copied canvas data on to this canvas
   */
  ctx.putImageData(snapshot, 0, 0);

  if (selectedTool === "brush" || selectedTool === "eraser") {
    /**
     * If selected tool is eraser then set strokeStyle to white
     * To paint white color on to the existing canvas content else set the stroke color to selected color
     */
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
    /**
     * lineTo() creates a new line
     * offsetX, offsetY returns x and y coordinate of the mouse pointer
     * creating line according to the mouse pointer
     */
    ctx.lineTo(e.offsetX, e.offsetY);
    /**
     * Drawing/filling line with color
     */
    ctx.stroke();
  } else if (selectedTool === "rectangle") {
    drawRect(e);
  } else if (selectedTool === "circle") {
    drawCircle(e);
  } else {
    drawTriangle(e);
  }
};

toolBtns.forEach((btn) => {
  /**
   * Adding click event to all tool option
   */
  btn.addEventListener("click", () => {
    /**
     * Removing active class from the pewvious option and adding on current clicked option
     */
    document.querySelector(".option.active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
    console.log(selectedTool);
  });
});

/**
 * Passing slider value as brushSize
 */
sizeSlider.addEventListener("change", () => (brushWidth = sizeSlider.value));

colorBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".option.selected").classList.remove("selected");
    btn.classList.add("selected");
    /**
     * Passing selected btn background color as SelectedColor value
     */
    selectedColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
  });
});

colorPicker.addEventListener("change", () => {
  /**
   * Passing picked color value from color picker to last color btn background
   */
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
  /**
   * Clearing whole canvas
   */
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBackground();
});

saveImg.addEventListener("click", () => {
  /**
   * Creating <a> element
   */
  const link = document.createElement("a");
  /**
   * Passing current date as link download value
   */
  link.download = `${Date.now()}.jpg`;
  /**
   * Passing canvasData as link href value
   */
  link.href = canvas.toDataURL();
  /**
   * Clicking link to download image
   */
  link.click();
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => (isDrawing = false));
