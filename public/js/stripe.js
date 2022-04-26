/*eslint-disable*/
import { showAlert } from './alert.js';

const stripe = Stripe(
  'pk_test_51Kg7ERSEvNFtHTTcS4lTNbTi6flLuqQlOOXXsq9jtTryYeoS67ANxDeJRGVh3MWNj4Qpp2M18Guv3K04cWwBQhMm00nkF0Wxog'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session
    const session = await axios(
      `http://127.0.0.1:8080/api/v1/bookings/checkout-session/${tourId}`
    );

    console.log(session);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (e) {
    showAlert('error', e);
  }
};

document.addEventListener('DOMContentLoaded', function () {
  const bookBtn = document.getElementById('book-tour');

  if (bookBtn) {
    bookBtn.addEventListener('click', async (e) => {
      e.target.textContent = 'processing...';
      const { tourId } = e.target.dataset;

      await bookTour(tourId);

      e.target.textContent = 'Done!';
    });
  }
});
