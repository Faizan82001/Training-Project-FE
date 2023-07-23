import {
  findByText,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SetPassword, setPasswordApi } from './SetPassword.jsx';
import { toast } from 'react-toastify';

const mockRejectFetch = (data) => {
  return (global.fetch = jest.fn().mockImplementation(() =>
    Promise.reject({
      status: 400,
      json: () => Promise.resolve({ data }),
    })
  ));
};

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...(jest.requireActual("react-router-dom")),
  useNavigate: () => mockedUsedNavigate
}));

describe('set password', () => {
  beforeEach(() => {
    toast.error = jest
      .fn()
      .mockImplementation((f) => typeof f === 'function' && f());
  });

  it('renders everything', async () => {
    render(
      <MemoryRouter>
        <SetPassword />
      </MemoryRouter>
    );
    const textElement = await screen.findByTestId('set-password-text');
    const inputElement = screen.getByPlaceholderText(/Enter new password/i);
    const confirmElement = screen.getByPlaceholderText(/confirm new password/i);
    const submitElement = screen.getByRole('button', { name: 'Change' });

    expect(textElement).toBeInTheDocument();
    expect(inputElement).toBeInTheDocument();
    expect(confirmElement).toBeInTheDocument();
    expect(submitElement).toBeInTheDocument();
  });

  it('shows error message if any field is empty', async () => {
    render(
      <MemoryRouter>
        <SetPassword />
      </MemoryRouter>
    );

    const newPassElement = screen.getByPlaceholderText(/enter new password/i);
    const confirmPassElement =
      screen.getByPlaceholderText(/confirm new password/i);
    const submitButton = screen.getByRole('button', { name: 'Change' });

    fireEvent.change(newPassElement, {
      target: { value: '', name: 'password' },
    });
    fireEvent.change(confirmPassElement, {
      target: { value: '', name: 'confirm-password' },
    });
    fireEvent.click(submitButton);
    expect(toast.error).toHaveBeenCalled();
  });

  it('shows error message if any field is less than 6', async () => {
    await mockRejectFetch({ message: 'Password must be greater than 6 characters' });
    render(
      <MemoryRouter>
        <SetPassword />
      </MemoryRouter>
    );
    const newPassElement = screen.getByPlaceholderText(/enter new password/i);
    const confirmPassElement =
      screen.getByPlaceholderText(/confirm new password/i);
    const submitButton = screen.getByRole('button', { name: 'Change' });

    fireEvent.change(newPassElement, {
      target: { value: 'ssss', name: 'password' },
    });
    fireEvent.change(confirmPassElement, {
      target: { value: 'ssss', name: 'confirm-password' },
    });
    fireEvent.click(submitButton);
    expect(toast.error).toHaveBeenCalled();
  });

  it('shows error message if password is not equal to confirm password', async () => {
    render(
      <MemoryRouter>
        <SetPassword />
      </MemoryRouter>
    );

    const newPassElement = screen.getByPlaceholderText(/enter new password/i);
    const confirmPassElement =
      screen.getByPlaceholderText(/confirm new password/i);
    const submitButton = screen.getByRole('button', { name: 'Change' });

    fireEvent.change(newPassElement, {
      target: { value: 'sssssssh', name: 'password' },
    });
    fireEvent.change(confirmPassElement, {
      target: { value: 'sssssss', name: 'confirm-password' },
    });
    fireEvent.click(submitButton);
    expect(toast.error).toHaveBeenCalled();
  });
});

describe('for status is 200', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 200,

        json: () =>
          Promise.resolve({
            message: 'Password changed successfully.',
            status: 200,
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  it('should pass test',async()=>{
    render(
      <MemoryRouter>
        <SetPassword />
      </MemoryRouter>
    );
    
    const newPassElement = screen.getByPlaceholderText(/enter new password/i);
    const confirmPassElement =
      screen.getByPlaceholderText(/confirm new password/i);
    const submitButton = screen.getByRole('button', { name: 'Change' });
    fireEvent.click(submitButton);

    fireEvent.change(newPassElement, {
      target: { value: 'Password@123', name: 'password' },
    });
    fireEvent.change(confirmPassElement, {
      target: { value: 'Password@123', name: 'confirm-password' },
    });

    fireEvent.click(submitButton)

    await setPasswordApi(newPassElement.value, confirmPassElement.value)
    expect(mockedUsedNavigate).toBeCalled()
  })
});

describe('for status is 400', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 400,

        json: () =>
          Promise.resolve({
            message: 'Please enter a password that has minimum 8 and maximum 20 character. It should contain atleast 1 uppercase, 1 lowercase letter, 1 special character and 1 number.',
            status: 400,
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  it('should pass test',async()=>{
    render(
      <MemoryRouter>
        <SetPassword />
      </MemoryRouter>
    );
    
    const newPassElement = screen.getByPlaceholderText(/enter new password/i);
    const confirmPassElement =
      screen.getByPlaceholderText(/confirm new password/i);
    const submitButton = screen.getByRole('button', { name: 'Change' });
    fireEvent.click(submitButton);

    fireEvent.change(newPassElement, {
      target: { value: 'password', name: 'password' },
    });
    fireEvent.change(confirmPassElement, {
      target: { value: 'password', name: 'confirm-password' },
    });

    const {res,ans} = await setPasswordApi(newPassElement.value, confirmPassElement.value, 'test')
    expect(res.status).toEqual(400)
  })
});

describe('error', () => {
  const unmockedFetch = global.fetch;
  beforeEach(() => {
    toast.error = jest
      .fn()
      .mockImplementation((f) => typeof f === 'function' && f());
  });
  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 500,
        json: () =>
          Promise.resolve({
            message: 'An error occured',
            status: 500,
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  test('works', async () => {
    render(
      <MemoryRouter>
        <SetPassword />
      </MemoryRouter>
    );

    const newPassElement = screen.getByPlaceholderText(/enter new password/i);
    const confirmPassElement =
      screen.getByPlaceholderText(/confirm new password/i);
    const submitButton = screen.getByRole('button', { name: 'Change' });
    fireEvent.click(submitButton);

    fireEvent.change(newPassElement, {
      target: { value: 'password', name: 'password' },
    });
    fireEvent.change(confirmPassElement, {
      target: { value: 'password', name: 'confirm-password' },
    });

    await setPasswordApi(newPassElement.value, confirmPassElement.value, 'test')
    expect(toast.error).toHaveBeenCalled()
  });
});
