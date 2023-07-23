import { fireEvent, render, screen, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import UserList from './UserList';
import { store } from '../../app/store';
import { Provider } from 'react-redux';

jest.mock('firebase/messaging', () => ({
  getMessaging: jest.fn(),
  onMessage: jest.fn(() => Promise.resolve()),
  getToken: jest.fn(() => Promise.resolve('1234')),
}));

describe('UserList', () => {
  test('should render the User List when Role id === 1', () => {
    delete window.location;
    window.location = {
      pathname: '/users',
      search: '?status=active&role_id=1&page=1',
    };
    localStorage.setItem('data', JSON.stringify({ roleId: 1 }));
    render(
      <Provider store={store}>
        <Router>
          <UserList />
        </Router>
      </Provider>
    );
    const tabs = screen.getByRole('tablist');
    expect(tabs).toBeInTheDocument(tabs);
  });
  test('should render the User List when Role id === 1', () => {
    delete window.location;
    window.location = {
      pathname: '/users',
      search: '?status=active&role_id=1',
    };
    localStorage.setItem('data', JSON.stringify({ roleId: 1 }));
    render(
      <Provider store={store}>
        <Router>
          <UserList />
        </Router>
      </Provider>
    );
    const tabs = screen.getByRole('tablist');
    expect(tabs).toBeInTheDocument(tabs);
  });
  test('should render the User List when Role id === 1', () => {
    delete window.location;
    window.location = {
      pathname: '/users',
      search: '?status=active',
    };
    localStorage.setItem('data', JSON.stringify({ roleId: 1 }));
    render(
      <Provider store={store}>
        <Router>
          <UserList />
        </Router>
      </Provider>
    );
    const tabs = screen.getByRole('tablist');
    expect(tabs).toBeInTheDocument(tabs);
  });
  test('should render the User List when Role id === 1', () => {
    delete window.location;
    window.location = {
      pathname: '/users',
      search: '',
    };
    localStorage.setItem('data', JSON.stringify({ roleId: 1 }));
    render(
      <Provider store={store}>
        <Router>
          <UserList />
        </Router>
      </Provider>
    );
    const tabs = screen.getByRole('tablist');
    expect(tabs).toBeInTheDocument(tabs);
  });
  test('should not render the User List when Role id !== 1', () => {
    delete window.location;
    window.location = {
      pathname: '/users',
      search: '?status=active&role_id=1&page=1',
    };
    localStorage.setItem('data', JSON.stringify({ roleId: 2 }));
    render(
      <Provider store={store}>
        <Router>
          <UserList />
        </Router>
      </Provider>
    );
    const messageElement = screen.getByTestId('notAuthorized');
    expect(messageElement).toBeInTheDocument();
  });
  test('click on tab', async () => {
    delete window.location;
    window.location = {
      pathname: '/users',
      search: '?status=active&role_id=1&page=1',
    };
    localStorage.setItem('data', JSON.stringify({ roleId: 1 }));
    render(
      <Provider store={store}>
        <Router>
          <UserList />
        </Router>
      </Provider>
    );
    const invitedUserTab = screen.getByText(/Invited/i);
    expect(invitedUserTab).toBeInTheDocument();
    expect(fireEvent.click(invitedUserTab)).toBeTruthy();

  })
});
