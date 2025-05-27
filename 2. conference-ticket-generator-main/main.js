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
  const fullNameInput = document.getElementById("fullName");
  const nameError = document.getElementById("nameError");
  const emailInput = document.getElementById("email");
  const emailError = document.getElementById("emailError");
  const githubUserNameInput = document.getElementById("githubUserName");
  const githubError = document.getElementById("githubError");

  // Trigger file selection when icon is clicked
  uploadButton.addEventListener("click", () => {
    input.click();
  });

  function validate(file) {
    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 500 * 1024; // 500 KB

    if (!allowedTypes.includes(file.type)) {
      error.textContent = "Only PNG or JPG files are allowed.";
      error.style.color = "red";
      return false;
    }

    if (file.size > maxSize) {
      error.textContent = "File must be less than 500KB.";
      error.style.color = "red";
      return false;
    }

    error.textContent = "Upload your photo (JPG or PNG, max size is 500kb).";
    error.style.color = "white";
    return true;
  }

  function showPreview(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadIcon.src = e.target.result;
      uploadText.style.display = "none";
      actionButtons.style.display = "flex";
      error.style.display = "none";
    };
    reader.readAsDataURL(file);
  }

  function hidePreview() {
    uploadIcon.src = "./assets/images/icon-upload.svg";
    uploadText.style.display = "block";
    actionButtons.style.display = "none";
    error.style.display = "block";
  }

  function handleFile(file) {
    if (file && validate(file)) {
      showPreview(file);
    } else {
      hidePreview();
    }
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
      showPreview(file);
    } else {
      hidePreview();
    }
  });

  fullNameInput.addEventListener("input", (e) => {
    let value = e.target.value;

    const originalLength = value.length;
    const invalidChar = /[^a-zA-Z ]/.test(value);

    // Show error message if needed
    if (invalidChar) {
      nameError.textContent = "Only A-Z letters and spaces are allowed.";
    } else if (originalLength > 20) {
      nameError.textContent = "Maximum 20 characters allowed.";
    } else {
      nameError.textContent = "";
    }

    // Enforce allowed characters and max length
    value = value.replace(/[^a-zA-Z ]/g, "");
    if (value.length > 20) {
      value = value.slice(0, 20);
    }
    e.target.value = value;
  });

  emailInput.addEventListener("blur", (e) => {
    let value = e.target.value;
    const originalLength = value.length;
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if (!isValidEmail) {
      emailError.textContent = "Please enter a valid email address.";
    } else if (originalLength > 50) {
      emailError.textContent = "Maximum 50 characters allowed.";
    } else {
      emailError.textContent = "";
    }

    // Enforce max length
    if (value.length > 50) {
      value = value.slice(0, 50);
      e.target.value = value;
    }
  });

  githubUserNameInput.addEventListener("input", (e) => {
    let value = e.target.value;
    const originalLength = value.length;
    const isValidGithubUserName = /^(?!-)(?!.*--)[a-zA-Z\d-]{1,39}(?<!-)$/.test(
      value
    );
    if (!isValidGithubUserName) {
      githubError.textContent = "Please enter a valid github username.";
    } else if (originalLength > 20) {
      githubError.textContent = "Maximum 20 characters allowed.";
    } else {
      githubError.textContent = "";
    }

    // Enforce max length
    if (value.length > 20) {
      value = value.slice(0, 20);
      e.target.value = value;
    }
  });

  removeImgBtn.addEventListener("click", () => {
    input.value = "";
    hidePreview();
  });

  changeImgBtn.addEventListener("click", () => {
    input.click();
  });

  // Initial UI setup
  hidePreview();
});
