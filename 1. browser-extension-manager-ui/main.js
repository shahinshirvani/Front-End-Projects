const container = document.getElementById("extensions-list");

// Renders all visible cards
function renderExtensions(data) {
  container.innerHTML = ""; // Clear previous items

  data.forEach((item) => {
    const card = document.createElement("div");
    card.innerHTML = `
      <div class="card">
        <div class="card-header">
          <img src="${item.logo}" alt="${item.name}" class="logo">
          <div class="card-text"> 
            <h3 class="name">${item.name}</h3>
            <p>${item.description}</p>
          </div>
        </div>
        <div class="card-footer">
          <label class="toggle-switch">
            <input type="checkbox" ${item.isActive ? "checked" : ""}>
            <span class="slider"></span>
          </label>
          <button class="remove-btn">Remove</button>
        </div>
      </div>
    `;

    const toggle = card.querySelector('input[type="checkbox"]');
    toggle.addEventListener("change", () => {
      item.isActive = toggle.checked;
    });

    const removeButton = card.querySelector(".remove-btn");
    removeButton.addEventListener("click", () => {
      const index = data.indexOf(item);
      if (index !== -1) {
        data.splice(index, 1);
        renderExtensions(getFilteredData()); // Re-render after removing
      }
    });

    container.appendChild(card);
  });
}

// Determines which data to show based on selected filter
function getFilteredData() {
  const selectedBtn = document.querySelector(".filter-btn.selected");
  const filter = selectedBtn?.getAttribute("data-filter");

  if (filter === "active") {
    return data.filter((item) => item.isActive);
  } else if (filter === "inactive") {
    return data.filter((item) => !item.isActive);
  }
  return data;
}

const searchInput = document.getElementById("extensions");
searchInput.addEventListener("input", () => {
  const filteredData = getFilteredData();
  const searchTerm = searchInput.value.trim().toLowerCase();
  const finalData = filteredData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm)
  );
  renderExtensions(finalData);
});
// Sets up filter button events
const filterButtons = document.querySelectorAll(".filter-btn");
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    searchInput.dispatchEvent(new Event("input"));
  });
});

// Initial render (default filter is "all")
renderExtensions(data);
