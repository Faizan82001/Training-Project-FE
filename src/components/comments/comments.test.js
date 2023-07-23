import { fireEvent, render, screen } from '@testing-library/react';
import {
  onSnapshot,
  query,
} from 'firebase/firestore';
import { Provider } from 'react-redux';
import { store } from '../../app/store';
import Comments from './Comments';
import { toast } from 'react-toastify';

jest.mock('firebase/messaging', () => ({
  getMessaging: jest.fn(),
  onMessage: jest.fn(() => Promise.resolve()),
  getToken: jest.fn(() => Promise.resolve('1234')),
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  onSnapshot: jest.fn(),
  query: jest.fn(),
  initializeFirestore: jest.fn(),
  orderBy: jest.fn(),
  addDoc: jest.fn(),
}));

const setLocalStorage = (id, data) => {
  localStorage.setItem(id, JSON.stringify(data));
};

it('when no chats are available', async () => {
  setLocalStorage('data', { roleId: 2 });
  toast.error = jest
    .fn()
    .mockImplementation((f) => typeof f === 'function' && f());

  global.fetch = () =>
    Promise.reject({
      status: 500,
      json: () =>
        Promise.reject({}),
    });

  render(
    <Provider store={store}>
      <Comments />
    </Provider>
  );
  expect(screen.getByText('No data')).toBeInTheDocument();
});

describe('Comments', () => {
  beforeEach(() => {
    window.HTMLElement.prototype.scrollTo = jest.fn();
    const mockComments = [{
      message: 'Request with Run No. 12345 wants pcs',
      receiverId: 1,
      senderId: 2,
      status: 'New Comment',
      subMessage: 'Hello',
      timestamp: 1684495146861,
      formattedTimestamp: '3:19 PM May 23, 2023',
      id: 1
    },
    {
      message: 'Request with Run No. 12346 wants some more data',
      receiverId: 3,
      senderId: 4,
      status: 'New Comment',
      subMessage: 'Bello',
      timestamp: 1684495146861,
      formattedTimestamp: '3:19 PM May 23, 2023',
      id: 2
    }];

    const mockData = [
      {
        data: () => {
          return mockComments;
        },
      },
    ];
    onSnapshot.mockImplementation((q, callback) => {
      callback({ docs: mockData });
    });
    query.mockReturnValue('mockQuery');
  })

  const unmockedFetch = global.fetch;

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  it('renders comments and sends message', async () => {
    setLocalStorage('data', { roleId: 2 });
    global.fetch = () =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            data: [
              {
                creatorId: '23456789',
                assignee: '4567890',
                creatorInitial: 'AB',
                assigneeInitial: 'BA',
              },
            ],
          }),
      });

    render(
      <Provider store={store}>
        <Comments />
      </Provider>
    );
    expect(await screen.findByTestId('input')).toBeInTheDocument();
  });

  it('tests input field', async () => {
    setLocalStorage('data', { roleId: 2 });

    global.fetch = () =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            data: [
              {
                creatorId: '23456789',
                assignee: '1',
                creatorInitial: 'AB',
                assigneeInitial: 'BA',
              },
            ],
          }),
      });

    render(
      <Provider store={store}>
        <Comments />
      </Provider>
    );
    const input = screen.getByTestId('input');
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.keyDown(input, { keyCode: 13 });
    expect(input.value).toBe('Hello')
  })

  it('tests input field when field is empty string', async () => {
    setLocalStorage('data', { roleId: 2 });

    global.fetch = () =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            data: [
              {
                creatorId: '23456789',
                assignee: '1',
                creatorInitial: 'AB',
                assigneeInitial: 'BA',
              },
            ],
          }),
      });

    render(
      <Provider store={store}>
        <Comments />
      </Provider>
    );
    const input = screen.getByTestId('input');
    fireEvent.change(input, { target: { value: '    ' } });
    fireEvent.keyDown(input, { keyCode: 13 });
    expect(screen.getByAltText('sendDisabled')).toBeInTheDocument()
  })
});