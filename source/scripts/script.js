document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.querySelector('.auth-form');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      const password = this.querySelector('#register-password');
      const confirm = this.querySelector('#register-password-confirm');
      const errorElement = this.querySelector('#password-error');

      if (password && confirm && password.value !== confirm.value) {
        e.preventDefault();
        errorElement.style.display = 'block'; // Показываем ошибку
        confirm.style.borderColor = '#ff0000';
        password.style.borderColor = '#ff0000';
      } else {
        // Скрываем ошибку, если всё хорошо
        if (errorElement) {
          errorElement.style.display = 'none';
        }
        confirm.style.borderColor = '';
        password.style.borderColor = '';
      }
    });
  }
});
