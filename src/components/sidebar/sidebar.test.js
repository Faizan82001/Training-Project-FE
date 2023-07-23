import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';
import { MemoryRouter } from 'react-router-dom';
import { store } from '../../app/store';
import { Provider } from 'react-redux';

const setLocalStorage = (id, data) => {
  localStorage.setItem(id, JSON.stringify(data));
};

it('renders 3 menu items if manager is logged in', () => {
  setLocalStorage('data', { roleId: 1 });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    </Provider>
  );
  const menuElements = screen.getAllByRole('menuitem');
  expect(menuElements.length).toBe(3);
  localStorage.removeItem('data');
});

it('renders 1 menu items if admin is logged in', () => {
  setLocalStorage('data', { roleId: 2 });
  setLocalStorage('token', '12345');

  render(
    <Provider store={store}>
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    </Provider>
  );
  const menuElements = screen.getAllByRole('menuitem');
  expect(menuElements.length).toBe(1);
  localStorage.removeItem('data');
}); 

describe('clicking menu items', () => {
  it('action after clicking analytics button', () => {
    setLocalStorage('data', { roleId: 1 });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>
      </Provider>
    );
    const menuItemAnalytics = screen.getByAltText('analytics');
    expect(menuItemAnalytics).toBeInTheDocument();
    expect(fireEvent.click(menuItemAnalytics)).toBe(true);
    localStorage.removeItem('data');
  });

  it('action after clicking tripRequest button for manager', () => {
    setLocalStorage('data', { roleId: 1 });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>
      </Provider>
    );
    const menuItemTrips = screen.getByAltText('ambulance');
    expect(menuItemTrips).toBeInTheDocument();
    expect(fireEvent.click(menuItemTrips)).toBe(true);
    localStorage.removeItem('data');
  });

  it('action after clicking tripRequest button for admin', () => {
    setLocalStorage('data', { roleId: 2 });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>
      </Provider>
    );
    const menuItemTrips = screen.getByAltText('ambulance');
    expect(menuItemTrips).toBeInTheDocument();
    expect(fireEvent.click(menuItemTrips)).toBe(true);
    localStorage.removeItem('data');
  });

  it('action after clicking users button', () => {
    setLocalStorage('data', { roleId: 1 });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>
      </Provider>
    );
    const menuItemUsers = screen.getByAltText('users');
    expect(menuItemUsers).toBeInTheDocument();
    expect(fireEvent.click(menuItemUsers)).toBe(true);
    localStorage.removeItem('data');
  });
});
