import { fireEvent, render, screen } from '@testing-library/react';
import ChangePasswordButton from './ChangePasswordButton'
import { MemoryRouter, useNavigate } from 'react-router-dom';

const MockNavigate = jest.fn()

jest.mock('react-router-dom',()=>({
   ...(jest.requireActual('react-router-dom')),
   useNavigate:()=> MockNavigate
}))

describe('check if it renders', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <ChangePasswordButton />
      </MemoryRouter>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('redirects to change password page', () => {
    render(
      <MemoryRouter>
        <ChangePasswordButton />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button'));
   
    expect(MockNavigate).toBeCalled()
  });
});
