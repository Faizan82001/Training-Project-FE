import { fireEvent, render, screen } from '@testing-library/react';
import HeaderComponent from './HeaderComponent';
import { MemoryRouter } from 'react-router-dom';
import { store } from '../../app/store';
import { Provider } from 'react-redux';

jest.mock('firebase/messaging', () => ({
  getMessaging: jest.fn(),
  onMessage: jest.fn(() => Promise.resolve()),
  getToken: jest.fn(() => Promise.resolve('1234')),
}));

describe('header', () => {
  test('should render the header', () => {
    localStorage.setItem(
      'data',
      '{"roleId":1, "firstName": "John", "lastName": "Doe"}'
    );
    render(
      <Provider store={store}>
        <MemoryRouter>
          <HeaderComponent />
        </MemoryRouter>
      </Provider>
    );
    const toggleButton = screen.getByTestId('toggle');
    expect(toggleButton).toBeInTheDocument();
    localStorage.clear();
  });

  test('toggle sidebar button', () => {
    localStorage.setItem(
      'data',
      '{"roleId":1, "firstName": "John", "lastName": "Doe"}'
    );
    render(
      <Provider store={store}>
        <MemoryRouter>
          <HeaderComponent />
        </MemoryRouter>
      </Provider>
    );
    const toggleButton = screen.getByTestId('toggle');

    fireEvent.click(toggleButton);
    expect(toggleButton).toBeInTheDocument();
    localStorage.clear();
  });

  test('dropdown for billing manager',async () => {
    localStorage.setItem(
      'data',
      '{"roleId":1, "firstName": "John", "lastName": "Doe"}'
    );
    render(
      <Provider store={store}>
        <MemoryRouter>
          <HeaderComponent />
        </MemoryRouter>
      </Provider>
    );
    const dropdown = screen.getByTestId('avatar-dropdown');

    fireEvent.click(dropdown);
    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    localStorage.clear();
  });

  test('dropdown for billing admin',async () => {
    localStorage.setItem(
      'data',
      '{"roleId":2, "firstName": "Jane", "lastName": "Doe"}'
    );
    render(
      <Provider store={store}>
        <MemoryRouter>
          <HeaderComponent />
        </MemoryRouter>
      </Provider>
    );
    const dropdown = screen.getByTestId('avatar-dropdown');

    fireEvent.click(dropdown);
    expect(await screen.findByText('Jane Doe')).toBeInTheDocument();
    localStorage.clear();
  });
});
