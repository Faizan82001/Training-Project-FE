import {
  collection,
  onSnapshot,
  query,
  getFirestore,
  orderBy,
  getDocs,
  where,
} from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { initializeFirestore } from 'firebase/firestore';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  onSnapshot: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
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
const { getNotificationList } = require('../../utils/getDataFunctions');

describe('getNotificationList', () => {
  const setNotificationList = jest.fn();
  const setNotificationCount = jest.fn();
  const setNotificationDot = jest.fn();
  const userId = 'user123';
  const notification1 = {
    id: 'notification1',
    timestamp: 1623072000000,
  };
  const notification2 = {
    id: 'notification2',
    timestamp: 1623078000000,
  };
  const docList = [notification1, notification2];

  beforeEach(() => {
    localStorage.setItem('token', 'mock-token');
    localStorage.setItem(
      'data',
      JSON.stringify({ id: '6c6c730f-0834-4e57-9d55-3be5be66c021' })
    );
    collection.mockReturnValue('mockCollection');
    query.mockReturnValue('mockQuery');
    onSnapshot.mockImplementation((query, callback) => {
      callback({
        docs: {
          map: jest.fn().mockReturnValue(docList),
        },
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should query the database, sort, and update notification list', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ data: {runNoOfTrips: ['trip1', 'trip2']} }),
      })
    );

    await getNotificationList(
      setNotificationList,
      setNotificationCount,
      setNotificationDot
    );

    expect(collection).toHaveBeenCalledWith(db, 'trip1');
    expect(collection).toHaveBeenCalledWith(db, 'trip2');
    expect(query).toHaveBeenCalled();
    expect(onSnapshot).toHaveBeenCalledTimes(2);
    expect(setNotificationList).toHaveBeenCalledWith([
      notification1,
      notification2,
    ]);
    expect(setNotificationCount).toHaveBeenCalledWith(2);

    delete global.fetch;
  });
});
