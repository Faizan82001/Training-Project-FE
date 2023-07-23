/* eslint-disable no-restricted-globals */
/* eslint-disable func-names */
/* eslint-disable no-undef */

if (typeof importScripts === 'function') {
  importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js');
  importScripts(
    'https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js'
  );

  self.addEventListener('message', (event) => {
    const env = event.data;
    const apiKey = env.REACT_APP_FIREBASE_API_KEY;
    const authDomain = env.REACT_APP_FIREBASE_AUTH_DOMAIN;
    const projectId = env.REACT_APP_FIREBASE_PROJECT_ID;
    const storageBucket = env.REACT_APP_FIREBASE_STORAGE_BUCKET;
    const messagingSenderId = env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID;
    const appId = env.REACT_APP_FIREBASE_APP_ID;
    const measurementId = env.REACT_APP_FIREBASE_MEASUREMENT_ID;

    firebase.initializeApp({
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId,
      measurementId,
    });

    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      const {
        notification: { title, body },
      } = payload;

      return self.registration.showNotification(title, body);
    });
  });
}
