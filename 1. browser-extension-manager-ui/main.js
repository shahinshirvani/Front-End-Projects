const container = document.getElementById("extensions-list");
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
    console.log(`${item.name} is now ${item.isActive ? "Active" : "Inactive"}`);
  });
  card.querySelector(".remove-btn").addEventListener("click", () => {
    card.remove();
  });
  container.appendChild(card);
  card.classList.add("extension-card");
});
