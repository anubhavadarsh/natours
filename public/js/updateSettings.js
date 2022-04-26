/*eslint-disable */
import { showAlert } from './alert.js';

const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:8080/api/v1/users/updateMyPassword'
        : 'http://127.0.0.1:8080/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (e) {
    showAlert('error', e.response.data.message);
  }
};

document.addEventListener('DOMContentLoaded', function () {
  const userDataForm = document.querySelector('.form.form-user-data');
  const userPasswordForm = document.querySelector('.form.form-user-password');

  if (userDataForm) {
    userDataForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const form = new FormData();

      form.append('name', document.getElementById('name').value);
      form.append('email', document.getElementById('email').value);

      form.append('photo', document.getElementById('photo').files[0]);

      await updateSettings(form, 'data');

      location.reload();
    });
  }

  if (userPasswordForm) {
    userPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      document.querySelector('.btn--save-password').textContent = 'Updating...';
      const passwordCurrent = document.getElementById('password-current').value;
      const password = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('password-confirm').value;

      await updateSettings(
        { passwordCurrent, password, passwordConfirm },
        'password'
      );

      document.querySelector('.btn--save-password').textContent =
        'save password';
      document.getElementById('password-current').value = '';
      document.getElementById('password').value = '';
      document.getElementById('password-confirm').value = '';
    });
  }
});
