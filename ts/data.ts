function exportImage() {
  const data = canvas.toDataURL();

  const image = new Image();
  image.src = data;

  const w = window.open("");
  w.document.write(image.outerHTML);
}

const jsonImport = document.getElementById("importJSON");
jsonImport.addEventListener("change", (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = () => {
    const json = reader.result;
    const uploadedGrid = JSON.parse(json);
    console.table(uploadedGrid[0]);
    layers = uploadedGrid;
    draw();
  };
});

function exportJSON() {
  const json = JSON.stringify(layers);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "tilemap.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
