import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getMessaging, onMessage, getToken } from 'firebase/messaging';
import { store } from '../app/store';
import NotificationContainer from '../components/notificationContainer/notificationContainer.jsx';
import { setNotificationDot } from '../features/notification/notificationSlice';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});

export const messaging = getMessaging(app);

export const registerServiceWorker = (env) => {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('../firebase-messaging-sw.js', {
            scope: '/',
          })
          .then(async (registration) => {
            registration.active.postMessage(env);
            const fcmToken = await getToken(messaging, {
              vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
              serviceWorkerRegistration: registration,
            });

            const token = localStorage.getItem('token');
            const body = { fcmToken };
            await fetch(`${process.env.REACT_APP_URL}/api/auth/set-fcm-token`, {
              body: JSON.stringify(body),
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
              },
            });
            localStorage.setItem('fcmToken', fcmToken);
          });
      }
    }
  });
};

export const getFCMToken = async () => {
  const fcmToken = await getToken(messaging, {
    vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
  });
  if (fcmToken) {
    localStorage.setItem('fcmToken', fcmToken);
    return fcmToken;
  }
};

export const onMessageListener = () => {
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      store.getState().notification.shouldReceiveNotification &&
        (store.dispatch(setNotificationDot(true)),
        NotificationContainer(
          payload.notification.title,
          payload.notification.body
        ));
      resolve(payload);
    });
  });
};
