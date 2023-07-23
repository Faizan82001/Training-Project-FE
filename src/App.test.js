import { render, screen } from '@testing-library/react';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';

const setLocalStorage = (id, data) => {
  localStorage.setItem(id, JSON.stringify(data));
};

jest.mock('firebase/messaging', () => ({
  getMessaging: jest.fn(),
  onMessage: jest.fn(() => Promise.resolve()),
  getToken: jest.fn(() => Promise.resolve('1234')),
}));

describe('private', ()=>{
  test('private routes', () => {
    setLocalStorage('token', '1234');
    setLocalStorage('data', { roleId: 1, firstName: "John", lastName: "Doe" });
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    const menu = screen.getByRole('menu')
    expect(menu).toBeInTheDocument()
    localStorage.removeItem('data');
    localStorage.removeItem('token');
  });
})

describe('render the login page if token is not present',()=>{
  test('rendering of app component', () => {
    localStorage.removeItem('token');
    setLocalStorage('data', { roleId: 1, firstName: "John", lastName: "Doe" });
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    const loginButton = screen.getByRole('button', { name: /login/i })
    expect(loginButton).toBeInTheDocument();
  })
})
