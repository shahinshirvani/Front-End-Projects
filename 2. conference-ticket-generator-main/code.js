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
  const sendTicket = document.getElementById("uploadForm");

  // Trigger file selection when icon is clicked
  uploadButton.addEventListener("click", () => {
    input.click();
  });

  // Validation functions
  function validateFullName(value) {
    const trimmed = value.trim();
    if (!/^[a-zA-Z ]{1,20}$/.test(trimmed)) {
      return "Please enter a valid full name (A-Z and spaces, max 20 chars).";
    }
    return "";
  }

  function validateEmail(value) {
    const trimmed = value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return "Please enter a valid email address.";
    }
    if (trimmed.length > 50) {
      return "Maximum 50 characters allowed.";
    }
    return "";
  }

  function validateGithubUserName(value) {
    const trimmed = value.trim();
    if (
      !/^(?!-)(?!.*--)[a-zA-Z\d-]{1,39}(?<!-)$/.test(trimmed) ||
      trimmed.length > 20
    ) {
      return "Please enter a valid GitHub username (max 20 chars).";
    }
    return "";
  }

  function validateFile(file) {
    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 500 * 1024; // 500 KB

    if (!file) {
      return "Please upload an image file.";
    }
    if (!allowedTypes.includes(file.type)) {
      return "Only PNG or JPG files are allowed.";
    }
    if (file.size > maxSize) {
      return "File must be less than 500KB.";
    }
    return "";
  }

  // Show file preview
  function showPreview(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadIcon.src = e.target.result;
      localStorage.setItem("image",e.target.result)
      uploadText.style.display = "none";
      actionButtons.style.display = "flex";
      error.style.display = "none";
    };
    reader.readAsDataURL(file);
  }

  // Hide file preview & reset UI
  function hidePreview() {
    uploadIcon.src = "./assets/images/icon-upload.svg";
    uploadText.style.display = "block";
    actionButtons.style.display = "none";
    error.style.display = "block";
  }

  // Handle file input
  function handleFile(file) {
    const fileError = validateFile(file);
    if (!fileError) {
      showPreview(file);
      error.textContent = "";
    } else {
      error.textContent = fileError;
      error.style.color = "red";
      hidePreview();
    }
  }

  // File input change event
  input.addEventListener("change", () => {
    const file = input.files[0];
    handleFile(file);
  });

  // Drag and drop events
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
    if (file) {
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
    error.textContent = "Upload your photo (JPG or PNG, max size is 500kb).";
    error.style.color = "white";
  });

  // Change image button
  changeImgBtn.addEventListener("click", () => {
    input.click();
  });

  // Live validation for full name input
  fullNameInput.addEventListener("input", (e) => {
    let value = e.target.value;

    // Enforce allowed characters and max length
    value = value.replace(/[^a-zA-Z ]/g, "").slice(0, 20);
    e.target.value = value;

    nameError.textContent = validateFullName(value);
  });

  // Validate email on blur (user finishes input)
  emailInput.addEventListener("blur", (e) => {
    let value = e.target.value;

    if (value.length > 50) {
      value = value.slice(0, 50);
      e.target.value = value;
    }

    emailError.textContent = validateEmail(value);
  });

  // Live validation for GitHub username input
  githubUserNameInput.addEventListener("input", (e) => {
    let value = e.target.value;

    // Enforce max length
    if (value.length > 20) {
      value = value.slice(0, 20);
      e.target.value = value;
    }

    githubError.textContent = validateGithubUserName(value);
  });

  // Form submission handler
  sendTicket.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullNameVal = fullNameInput.value;
    const emailVal = emailInput.value;
    const githubVal = githubUserNameInput.value;
    const fileVal = input.files[0];

    const fullNameErr = validateFullName(fullNameVal);
    const emailErr = validateEmail(emailVal);
    const githubErr = validateGithubUserName(githubVal);
    const fileErr = validateFile(fileVal);

    let isValid = true;

    if (fullNameErr) {
      nameError.textContent = fullNameErr;
      isValid = false;
    } else {
      nameError.textContent = "";
    }

    if (emailErr) {
      emailError.textContent = emailErr;
      isValid = false;
    } else {
      emailError.textContent = "";
    }

    if (githubErr) {
      githubError.textContent = githubErr;
      isValid = false;
    } else {
      githubError.textContent = "";
    }

    if (fileErr) {
      error.textContent = fileErr;
      error.style.color = "red";
      isValid = false;
    } else {
      error.textContent = "";
    }

    if (isValid) {
      localStorage.setItem("userName", fullNameInput.value)
      localStorage.setItem("email", emailInput.value)
      localStorage.setItem("gitUserName", githubUserNameInput.value)
      window.location.href = "ticket.html";
    }
  });

  // Initial UI setup
  hidePreview();
});
