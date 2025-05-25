document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("avatarInput");
  const form = document.getElementById("uploadForm");
  const dropZone = document.getElementById("dropZone");
  const preview = document.getElementById("preview");
  const error = document.getElementById("error");

  function validate(file) {
    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 500 * 1024; // 500 KB

    if (!allowedTypes.includes(file.type)) {
      error.textContent = "Only PNG or JPG files are allowed.";
      return false;
    }

    if (file.size > maxSize) {
      error.textContent = "File must be less than 500KB.";
      return false;
    }

    error.textContent = "";
    return true;
  }

  function showPreveiw(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }

  input.addEventListener("change", () => {
    const file = input.files[0];
    if (file && validate(file)) {
      showPreveiw(file);
    } else {
      preview.style.display = "none";
    }
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
      input.files = e.dataTransfer.files;
      showPreveiw(file);
    } else {
      preview.style.display = "none";
    }
  });
  form.addEventListener("submit", (e) => {
    const file = input.file[0];
    if (!file || !validate(file)) {
      e.preventDefault();
      error.textContent = "Please upload a valid PNG/JPG under 500KB.";
    }
  });
});
