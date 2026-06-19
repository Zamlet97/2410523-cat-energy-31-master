// source/scripts/script.js
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.querySelector(".auth-form");
  if (registerForm) {
    registerForm.addEventListener("submit", function(e) {
      const password = this.querySelector("#register-password");
      const confirm = this.querySelector("#register-password-confirm");
      const errorElement = this.querySelector("#password-error");
      if (password && confirm && password.value !== confirm.value) {
        e.preventDefault();
        errorElement.style.display = "block";
        confirm.style.borderColor = "#ff0000";
        password.style.borderColor = "#ff0000";
      } else {
        if (errorElement) {
          errorElement.style.display = "none";
        }
        confirm.style.borderColor = "";
        password.style.borderColor = "";
      }
    });
  }
});
//# sourceMappingURL=script.js.map
