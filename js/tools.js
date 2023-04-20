var currentBrush = 1;

// toggle brush on click
const brushOptions = document.querySelectorAll(".brush-option");
brushOptions.forEach((option) => {
  option.addEventListener("click", () => {
    currentBrush = option.dataset.select;
    // remove active class from all brush options
    brushOptions.forEach((option) => {
      option.classList.remove("btn-active");
    });
    // add active class to the selected brush option
    option.classList.add("btn-active");
  });
});

// toggle brush with keycodes
const brushKeyCodes = {
  KeyB: 1,
  KeyE: 2,
  KeyG: 3,
  KeyI: 4,
};

window.addEventListener("keydown", (event) => {
  const brushOption = brushOptions[brushKeyCodes[event.code] - 1];
  if (brushOption) {
    currentBrush = brushKeyCodes[event.code];
    brushOptions.forEach((option) => {
      option.classList.toggle("btn-active", option === brushOption);
    });
  }
});

const widthInput = document.querySelector(".inputWidth");
const heightInput = document.querySelector(".inputHeight");

function updateCanvasSize() {
  const width = parseInt(widthInput.value);
  const height = parseInt(heightInput.value);

  canvas.width = width;
  canvas.height = height;

  draw();
}
