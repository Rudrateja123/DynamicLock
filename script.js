const colors = [
    "#1a6366", "#f5388a", "#9638f5",
    "#389af5", "#38f5d2", "#a0f538",
    "#f5b038", "#f53838", "#e238f5"
  ];
  
  let passwordPositions = [];
  let enteredPin = [];
  
  document.addEventListener("DOMContentLoaded", () => {
    const gridElement = document.getElementById("grid");
    if (gridElement) {
      const isSetup = document.title.includes("Set");
      const grid = generateGrid(!isSetup);
      drawGrid(gridElement, grid, isSetup);
      if (isSetup) {
        document.getElementById("savePassword").addEventListener("click", () => {
          if (passwordPositions.length !== 4) {
            alert("Select 4 positions.");
            return;
          }
          localStorage.setItem("password", JSON.stringify(passwordPositions));
          window.location.href = "unlock.html";
        });
      } else {
        localStorage.setItem("currentGrid", JSON.stringify(grid));
      }
    }
  });
  
  function generateGrid(fillNumbers = false) {
    const grid = [];
    for (let i = 0; i < 81; i++) {
      const row = Math.floor(i / 9);
      const col = i % 9;
      const subgridRow = Math.floor(row / 3);
      const subgridCol = Math.floor(col / 3);
      const posInSubgrid = (row % 3) * 3 + (col % 3);
      const color = colors[posInSubgrid];
      const value = fillNumbers ? Math.floor(Math.random() * 10) : "";
      grid.push({ color, value });
    }
    return grid;
  }
  
  function drawGrid(container, grid, clickable) {
    container.innerHTML = "";
    passwordPositions = [];
    grid.forEach((cell, index) => {
      const box = document.createElement("div");
      box.style.backgroundColor = cell.color;
      box.textContent = cell.value;
      box.dataset.index = index;
      if (clickable) {
        box.onclick = () => {
          const pos = passwordPositions.indexOf(index);
          if (pos !== -1) {
            passwordPositions.splice(pos, 1);
            box.classList.remove("selected");
            box.textContent = "";
            updateSelectedLabels();
          } else if (passwordPositions.length < 4) {
            passwordPositions.push(index);
            box.classList.add("selected");
            box.textContent = passwordPositions.length;
          }
        };
      }
      container.appendChild(box);
    });
  }
  
  function updateSelectedLabels() {
    document.querySelectorAll("#grid div").forEach((box, i) => {
      const idx = parseInt(box.dataset.index);
      const pos = passwordPositions.indexOf(idx);
      box.textContent = pos !== -1 ? (pos + 1) : "";
    });
  }
  
  // Keypad handling
  function enterDigit(digit) {
    if (enteredPin.length < 4) {
      enteredPin.push(digit);
      updateEnteredPin();
    }
  }
  
  function clearLast() {
    enteredPin.pop();
    updateEnteredPin();
  }
  
  function updateEnteredPin() {
    document.getElementById("enteredPin").textContent = enteredPin.join("");
  }
  
  function submitPin() {
    const savedPositions = JSON.parse(localStorage.getItem("password"));
    const currentGrid = JSON.parse(localStorage.getItem("currentGrid"));
    if (!savedPositions || !currentGrid) {
      alert("No password or grid found.");
      return;
    }
    const correctPin = savedPositions.map(idx => parseInt(currentGrid[idx].value));
    if (JSON.stringify(correctPin) === JSON.stringify(enteredPin)) {
      alert("Access Granted ✅");
      if (confirm("Lock Again?")) {
        window.location.href = "unlock.html";
      }
    } else {
      alert("Incorrect PIN ❌");
      window.location.href = "unlock.html";
    }
  }
  
  function forgetPassword() {
    localStorage.removeItem("password");
    location.href = "setup.html";
  }