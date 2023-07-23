import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Analytics from './Analytics';
import { store } from '../../app/store';
import { Provider } from 'react-redux';

const setLocalStorage = (id, data) => {
    localStorage.setItem(id, JSON.stringify(data));
};

jest.mock('firebase/messaging', () => ({
    getMessaging: jest.fn(),
    onMessage: jest.fn(() => Promise.resolve()),
    getToken: jest.fn(() => Promise.resolve('1234')),
}));

describe('Analytics screen', () => {
    test('renders page if manager is logged in', () => {
        setLocalStorage('data', { roleId: 1 });
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Analytics />
                </MemoryRouter>
            </Provider>);
        const elementText = screen.getByText(/total requests/i);
        expect(elementText).toBeInTheDocument();
        localStorage.removeItem('data');

    });
    test('does not renders page if admin is logged in', () => {
        setLocalStorage('data', { roleId: 2 });
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Analytics />
                </MemoryRouter>
            </Provider>);
        const elementText = screen.getByText(/You are not authorized to access this page/i);
        expect(elementText).toBeInTheDocument();
        localStorage.removeItem('data');

    });
});
