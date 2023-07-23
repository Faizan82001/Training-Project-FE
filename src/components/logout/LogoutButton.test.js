import { fireEvent, render, screen } from '@testing-library/react';
import LogoutButton from './LogoutButton';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

describe('check if it renders', () => {
  const unmockedFetch = global.fetch;

   beforeEach(() => {
     global.fetch = () =>
       Promise.resolve({
         status: 200,
         json: () =>
           Promise.resolve({
             message: 'User logged out successfully',
           }),
       });
   });

   afterEach(() => {
     global.fetch = unmockedFetch;
   });

  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <LogoutButton />
      </MemoryRouter>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('clears local storage when clicked', () => {
    render(
      <MemoryRouter>
        <LogoutButton />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button'));
    const local = localStorage.getItem('token')
    expect(local).toBeNull()
  });
});

describe('error in logout', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    toast.error = jest
      .fn()
      .mockImplementation((f) => typeof f === 'function' && f());
    global.fetch = () =>
      Promise.resolve({
        status: 404,
        json: () =>
          Promise.resolve({
            message: 'error in logout',
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  it('clears local storage when clicked', () => {
    localStorage.setItem('token', 'token')
    render(
      <MemoryRouter>
        <LogoutButton />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button'));
    const local = localStorage.getItem('token');
    expect(local).not.toBeNull();
  });
});

describe('catch block for logout', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    toast.error = jest
      .fn()
      .mockImplementation((f) => typeof f === 'function' && f());
    global.fetch = () =>
      Promise.reject({
        reason:'no internet',
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  it('clears local storage when clicked', () => {
    localStorage.setItem('token', 'token');
    render(
      <MemoryRouter>
        <LogoutButton />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button'));
    const local = localStorage.getItem('token');
    expect(local).not.toBeNull();
  });
});
