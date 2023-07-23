import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuditTrail from './AuditTrail';
import { act } from 'react-dom/test-utils';

describe('audit trail component', () => {
    const unmockedFetch = global.fetch;

    it('should render no data available when data is not present', async () => {
        global.fetch = () =>
            Promise.resolve({
                status: 200,
                json: () =>
                    Promise.resolve({
                        data: [
                            {
                                actions: ''
                            }
                        ]
                    }),
            });
        render(
            <MemoryRouter>
                <AuditTrail />
            </MemoryRouter>
        )
        expect(await screen.findByText(/no data/i)).toBeInTheDocument();
        global.fetch = unmockedFetch;
    })

    it('renders data if data is present', async () => {
        global.fetch = () =>
            Promise.resolve({
                status: 200,
                json: () =>
                    Promise.resolve({
                        data: [
                            {
                                dateTime: '12/3/2002',
                                firstName: 'Alex',
                                lastName: 'Nelson',
                                message: 'BA requires more information',
                                roleId: 2
                            },
                            {
                                dateTime: '12/1/2003',
                                firstName: 'David',
                                lastName: 'Nelson',
                                message: 'Data Provided',
                                roleId: 3
                            },
                        ]
                    }),
            });
        render(
            <MemoryRouter>
                <AuditTrail />
            </MemoryRouter>
        )
        const text = await screen.findByText(/BA requires more information/i)
        expect(text).toBeInTheDocument();
        global.fetch = unmockedFetch;
    });

    it('renders data if response is 401', async () => {
        global.fetch = () =>
            Promise.resolve({
                status: 401,
                json: () =>
                    Promise.resolve({
                        data: []
                    }),
            });
        render(
            <MemoryRouter>
                <AuditTrail />
            </MemoryRouter>
        )
        const token = localStorage.getItem('token');
        expect(token).toBeNull();
        global.fetch = unmockedFetch;
    });

    it('renders data if response is 400', async () => {
        global.fetch = () =>
            Promise.resolve({
                status: 400,
                json: () =>
                    Promise.resolve({ }),
            });
        render(
            <MemoryRouter>
                <AuditTrail />
            </MemoryRouter>
        )
        expect(await screen.findByText(/no data/i)).toBeInTheDocument();
        global.fetch = unmockedFetch;
    });

    it('renders data if response is 500', async () => {
        global.fetch = () =>
            Promise.reject({
                status: 500,
                json: () =>
                    Promise.reject({
                        data: []
                    }),
            });
        await act(async() => { 
            render(
                <MemoryRouter>
                    <AuditTrail />
                </MemoryRouter>
            )
        })
        expect(await screen.findByText(/no data/i)).toBeInTheDocument();
        global.fetch = unmockedFetch;
    });
})
