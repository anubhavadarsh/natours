/*eslint-disable*/
import { showAlert } from './alert.js';

const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8080/api/v1/users/login',
      data: {
        email,
        password,
      },
      Credential: 'include',
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (e) {
    console.log(e.response.data.message);
    showAlert('error', e.response.data.message);
  }
};

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8080/api/v1/users/logout',
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged out successfully');
      location.assign('/');
    }
  } catch (e) {
    showAlert('error', 'Error logging out! Try again.');
  }
};

document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.querySelector('.login-form .form');
  const logOutBtn = document.querySelector('.nav__el--logout');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const submit = document.querySelector('form button.btn.btn--green');

      submit.disabled = true;

      await login(email, password);

      setTimeout(() => (submit.disabled = false), 2000);
    });
  }

  if (logOutBtn) {
    logOutBtn.addEventListener('click', logout);
  }
});
