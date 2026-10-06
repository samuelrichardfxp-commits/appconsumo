import '../styles.css';
import { App } from './quiz-app.js';

window.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  window.ecoQuizApp = app;

  if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload(), { once: true });
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}service-worker.js`).catch(() => undefined);
  } else if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      if (registrations.length > 0) {
        Promise.all(registrations.map((registration) => registration.unregister()))
          .then(() => window.location.reload());
      }
    });
  }
});
