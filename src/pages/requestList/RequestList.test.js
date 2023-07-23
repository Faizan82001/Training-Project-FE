import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { store } from '../../app/store';
import { Provider } from 'react-redux';
import RequestList from './RequestList';

jest.mock('firebase/messaging', () => ({
  getMessaging: jest.fn(),
  onMessage: jest.fn(() => Promise.resolve()),
  getToken: jest.fn(() => Promise.resolve('1234')),
}));

describe('Request list', () => {  
  it('should render the request list when Role id === 1', () => {
    localStorage.setItem('data', JSON.stringify({ roleId: 1 }));
    delete window.location;
    window.location = {
      pathname: '/trip-requests',
      search: '?key=1&status=&page=1&myRequest=false',
    };
    render(
      <Provider store={store}>
        <Router>
          <RequestList />
        </Router>
      </Provider>
    );
    const tabs = screen.getByRole('tablist');
    expect(tabs).toBeInTheDocument();
  });
  
  it('should render the request list when Role id === 1', () => {
    localStorage.setItem('data', JSON.stringify({ roleId: 1 }));
    delete window.location;
    window.location = {
      pathname: '/trip-requests',
      search: '?key=1&status=all&page=1',
    };
    render(
      <Provider store={store}>
        <Router>
          <RequestList />
        </Router>
      </Provider>
    );
    const tabs = screen.getByRole('tablist');
    expect(tabs).toBeInTheDocument();
  });
  
  it('should render the request list when Role id === 1', () => {
    localStorage.setItem('data', JSON.stringify({ roleId: 1 }));
    delete window.location;
    window.location = {
      pathname: '/trip-requests',
      search: '?key=1&status=',
    };
    render(
      <Provider store={store}>
        <Router>
          <RequestList />
        </Router>
      </Provider>
    );
    const tabs = screen.getByRole('tablist');
    expect(tabs).toBeInTheDocument();
  });
  
  it('should render the request list when Role id === 1', () => {
    localStorage.setItem('data', JSON.stringify({ roleId: 1 }));
    delete window.location;
    window.location = {
      pathname: '/trip-requests',
      search: '?key=1',
    };
    render(
      <Provider store={store}>
        <Router>
          <RequestList />
        </Router>
      </Provider>
    );
    const tabs = screen.getByRole('tablist');
    expect(tabs).toBeInTheDocument();
  });
  
  it('should render the request list when Role id === 1', () => {
    localStorage.setItem('data', JSON.stringify({ roleId: 1 }));
    delete window.location;
    window.location = {
      pathname: '/trip-requests',
      search: '',
    };
    render(
      <Provider store={store}>
        <Router>
          <RequestList />
        </Router>
      </Provider>
    );
    const tabs = screen.getByRole('tablist');
    expect(tabs).toBeInTheDocument();
  });
});
