import {
  getTripsForUser,
  setDate,
  setImage,
  getNotificationList,
} from '../../utils/getDataFunctions';
import { render, screen, fireEvent } from '@testing-library/react';
import { TRIP_STATUS } from '../../utils/constants';
import {
  NewCommentIcon,
  NewRequestIcon,
  DataProvidedIcon,
} from '../icons/icons';
import { useNavigate, BrowserRouter, MemoryRouter } from 'react-router-dom';
import NotificationButton from './notificationButton';
import { store } from '../../app/store';
import { Provider } from 'react-redux';
import { db } from '../../utils/firebase';
import { setNotificationDot } from '../../features/notification/notificationSlice';
import {
  collection,
  onSnapshot,
  query,
  getFirestore,
  initializeFirestore,
  orderBy,
  getDocs,
  where,
} from 'firebase/firestore';
import { onMessage } from 'firebase/messaging';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  onSnapshot: jest.fn(),
  query: jest.fn(),
  getFirestore: jest.fn(),
  initializeFirestore: jest.fn(),
  orderBy: jest.fn(),
  addDoc: jest.fn(),
}));

jest.mock('firebase/messaging', () => ({
  getMessaging: jest.fn(),
  onMessage: jest.fn(() => Promise.resolve()),
  getToken: jest.fn(() => Promise.resolve('1234')),
  onBackgroundMessage: jest.fn(() => Promise.resolve()),
}));

describe('notifications button', () => {
  it('fetches notification list and renders the correct items', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <NotificationButton />
        </MemoryRouter>
      </Provider>
    );
    fireEvent.click(await screen.findByTestId('notifications'));
  });
});

describe('getTripsForUser', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'mock-token');
    localStorage.setItem(
      'data',
      JSON.stringify({ id: '6c6c730f-0834-4e57-9d55-3be5be66c021' })
    );
  });

  afterEach(() => {
    localStorage.removeItem('token');
  });

  it('should fetch trips for the user', async () => {
    const mockData = { runNoOfTrips: ['trip1', 'trip2'] };

    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ data: mockData }),
    });

    const trips = await getTripsForUser();

    expect(global.fetch).toHaveBeenCalledWith(
      `${process.env.REACT_APP_URL}/api/trip-requests/trips`,
      {
        method: 'GET',
        headers: { authorization: 'Bearer mock-token' },
      }
    );
    expect(trips).toEqual(mockData.runNoOfTrips);
  });

  it('should fetch notifications list', async () => {
    const mockData = { runNoOfTrips: ['trip1', 'trip2'] };

    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ data: mockData }),
    });

    const { list } = await getTripsForUser();

    expect(global.fetch).toHaveBeenCalledWith(
      `${process.env.REACT_APP_URL}/api/trip-requests/trips`,
      {
        method: 'GET',
        headers: { authorization: 'Bearer mock-token' },
      }
    );
  });

  it('should handle fetch errors', async () => {
    const errorMessage = 'Failed to fetch trips';
    global.fetch = jest.fn().mockRejectedValueOnce(new Error(errorMessage));
    try {
      await getTripsForUser();
      fail('Expected an error to be thrown');
    } catch (error) {
      expect(error.message).toBe(errorMessage);
    }
  });
});

describe('setDate', () => {
  it('formats the date correctly', () => {
    const time = '2023-05-29T10:30:00Z';
    const expectedFormattedDate = 'May 29, 2023 at 4:00 PM';

    const formattedDate = setDate(time);

    expect(typeof formattedDate).toBe('string');
  });
});

describe('setImage', () => {
  it('returns the correct image component based on status', () => {
    const newCommentStatus = TRIP_STATUS.NEW_COMMENT;
    const newRequestStatus = TRIP_STATUS.NEW;
    const dataProvidedStatus = TRIP_STATUS.DATA_PROVIDED;

    const newCommentIcon = <NewCommentIcon />;
    const newRequestIcon = <NewRequestIcon />;
    const dataProvidedIcon = <DataProvidedIcon />;

    const newCommentResult = setImage(newCommentStatus);
    const newRequestResult = setImage(newRequestStatus);
    const dataProvidedResult = setImage(dataProvidedStatus);

    expect(newCommentResult).toEqual(newCommentIcon);
    expect(newRequestResult).toEqual(newRequestIcon);
    expect(dataProvidedResult).toEqual(dataProvidedIcon);
  });
});

import { onMessageListener } from '../../utils/firebase';
import { NotificationContainer } from '../notificationContainer/notificationContainer.jsx';

jest.mock('../notificationContainer/notificationContainer.jsx', () =>
  jest.fn()
);

describe('onMessageListener', () => {
  test('should dispatch action and resolve with payload', async () => {
    const mockPayload = {
      notification: {
        title: 'Test Notification',
        body: 'This is a test notification',
      },
    };

    const listenerPromise = onMessageListener();
    onMessage.mock.calls[0][1](mockPayload);

    store.dispatch(setNotificationDot(true));
    expect(onMessage).toHaveBeenCalled();
  });
});
