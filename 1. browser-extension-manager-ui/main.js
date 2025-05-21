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

  const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove 'selected' from all
    filterButtons.forEach(b => b.classList.remove('selected'));
    // Add 'selected' to clicked button
    btn.classList.add('selected');

    // Optional: filter logic based on btn.dataset.filter
    const filter = btn.dataset.filter;
    console.log("Filtering by:", filter);
  });
});

  container.appendChild(card);
});
