document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("avatarInput");
  const dropZone = document.getElementById("dropZone");
  const error = document.getElementById("error");
  const uploadButton = document.getElementById("uploadIconButton");
  const removeImgBtn = document.getElementById("removeImgBtn");
  const changeImgBtn = document.getElementById("changeImgBtn");
  const uploadIcon = document.getElementById("uploadIcon");
  const uploadText = document.getElementById("uploadText");
  const actionButtons = document.getElementById("actionButtons");

  // Trigger file selection when icon is clicked
  uploadButton.addEventListener("click", () => {
    input.click();
  });

  function validate(file) {
    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 500 * 1024; // 500 KB

    if (!allowedTypes.includes(file.type)) {
      error.textContent = "Only PNG or JPG files are allowed.";
      hidePreview();
      return false;
    }

    if (file.size > maxSize) {
      error.textContent = "File must be less than 500KB.";
      hidePreview();
      return false;
    }

    error.textContent = "";
    return true;
  }

  function showPreview(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadIcon.src = e.target.result;
      uploadText.style.display = "none";
      actionButtons.style.display = "flex";
    };
    reader.readAsDataURL(file);
  }

  function hidePreview() {
    uploadIcon.src = "./assets/images/icon-upload.svg";
    uploadText.style.display = "block";
    actionButtons.style.display = "none";
  }

  function handleFile(file) {
    if (!file || !validate(file)) {
      hidePreview();
      return;
    }

    showPreview(file);
  }

  input.addEventListener("change", () => {
    const file = input.files[0];
    handleFile(file);
  });

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.style.border = "2px dashed #aaa";
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.style.border = "none";
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.style.border = "none";
    const file = e.dataTransfer.files[0];

    if (file && validate(file)) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      handleFile(file);
    } else {
      hidePreview();
    }
  });

  // Remove image button
  removeImgBtn.addEventListener("click", () => {
    input.value = "";
    hidePreview();
    error.textContent = "";
  });

  // Change image button
  changeImgBtn.addEventListener("click", () => {
    input.click();
  });

  // Initial state
  hidePreview();
  error.textContent = "";
});
