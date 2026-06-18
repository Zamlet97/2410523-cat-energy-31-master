document.addEventListener('DOMContentLoaded', () => {
  // Валидация формы регистрации
  const registerForm = document.querySelector('.auth-form');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      const password = this.querySelector('#register-password');
      const confirm = this.querySelector('#register-password-confirm');

      if (password && confirm && password.value !== confirm.value) {
        e.preventDefault();
        // eslint-disable-next-line no-alert
        alert('Пароли не совпадают!');
        confirm.style.borderColor = '#ff0000';
      }
    });
  }
});
