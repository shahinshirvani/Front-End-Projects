const container = document.getElementById("extensions-list");
data.forEach((item) => {
  const card = document.createElement("div");
  card.innerHTML = `
    <div class='card-header'> 
        <img src="${item.logo}" alt="${item.name}" class="logo">
        <h3 class="name">${item.name}</h3>
    </div> 
    <p>${item.description}</p>
    <button class='remove-btn'>Remove</button>
    `;

  card.querySelector(".remove-btn").addEventListener("click", () => {
    card.remove();
  });
  container.appendChild(card);
  card.classList.add("extension-card");
});
