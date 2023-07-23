import { fireEvent, render, screen } from '@testing-library/react';
import { CreateUser, fetchApi } from './CreateUser';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('test for create user page', () => {
  const unmockedFetch = global.fetch;

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  it('checks if elements are rendered', () => {
    render(
      <MemoryRouter>
        <CreateUser />
      </MemoryRouter>
    );
    const emailLabel = screen.getByLabelText(/email/i);
    const firstNameLabel = screen.getByLabelText(/first name/i);
    const lastNameLabel = screen.getByLabelText(/last name/i);
    const headingElement = screen.getByTestId('user-role');
    fireEvent.blur(screen.queryAllByRole('combobox')['0']);
    fireEvent.focus(screen.queryAllByRole('combobox')['0']);
    fireEvent.mouseDown(screen.queryAllByRole('combobox')['0']);
    fireEvent.click(
      // eslint-disable-next-line testing-library/no-node-access
      document.querySelectorAll('.ant-select-item-option-content')[0]
    );

    expect(headingElement).toBeInTheDocument();
    expect(emailLabel).toBeInTheDocument();
    expect(firstNameLabel).toBeInTheDocument();
    expect(lastNameLabel).toBeInTheDocument();
    expect(lastNameLabel).toBeInTheDocument();
  });
});

describe('tests input fields', () => {
  const unmockedFetch = global.fetch;
  beforeEach(() => {
    toast.error = jest
      .fn()
      .mockImplementation((f) => typeof f === 'function' && f());
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  it('error if elements are empty', async () => {
    render(
      <MemoryRouter>
        <CreateUser />
      </MemoryRouter>
    );
    const emailLabel = screen.getByLabelText(/email/i);
    const firstNameLabel = screen.getByLabelText(/first name/i);
    const lastNameLabel = screen.getByLabelText(/last name/i);
    const submitButton = screen.getByRole('button', { name: /create/i });

    fireEvent.change(emailLabel, { target: { value: '' } });
    fireEvent.change(firstNameLabel, { target: { value: '' } });
    fireEvent.change(lastNameLabel, { target: { value: '' } });
    fireEvent.click(submitButton);

    expect(toast.error).toHaveBeenCalled();
  });

  it('error if email is invalid', async () => {
    render(
      <MemoryRouter>
        <CreateUser />
      </MemoryRouter>
    );
    const emailLabel = screen.getByLabelText(/email/i);
    const firstNameLabel = screen.getByLabelText(/first name/i);
    const lastNameLabel = screen.getByLabelText(/last name/i);
    const submitButton = screen.getByRole('button', { name: /create/i });

    const selectInput = screen.getByRole('combobox');
    fireEvent.mouseDown(selectInput);

    const option2 = await screen.findByText('Nurse');
    fireEvent.click(option2);

    fireEvent.change(emailLabel, { target: { value: 'mayankxx.com' } });
    fireEvent.change(firstNameLabel, { target: { value: 'mayank' } });
    fireEvent.change(lastNameLabel, { target: { value: 'gouri' } });
    fireEvent.click(submitButton);

    expect(toast.error).toHaveBeenCalled();
  });
});

describe('submits form for 200 res', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 200,

        json: () =>
          Promise.resolve({
            message: 'User created and activation email sent to user.',
            status: 200,
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  it('submits form to backend for 200 res', async () => {
    render(
      <MemoryRouter>
        <CreateUser />
      </MemoryRouter>
    );
    const emailLabel = screen.getByLabelText(/email/i);
    const firstNameLabel = screen.getByLabelText(/first name/i);
    const lastNameLabel = screen.getByLabelText(/last name/i);
    const submitButton = screen.getByRole('button', { name: /create/i });

    const selectInput = screen.getByRole('combobox');
    fireEvent.mouseDown(selectInput);

    const option2 = await screen.findByText('Nurse');
    fireEvent.click(option2);

    fireEvent.change(emailLabel, { target: { value: 'mayank@growexx.com' } });
    fireEvent.change(firstNameLabel, { target: { value: 'mayank' } });
    fireEvent.change(lastNameLabel, { target: { value: 'gouri' } });
    fireEvent.click(submitButton);
    await fetchApi(
      emailLabel.value,
      firstNameLabel.value,
      lastNameLabel.value,
      2
    );
    expect(mockedUsedNavigate).toBeCalled();
  });
});

describe('submits form for 400 res', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 400,

        json: () =>
          Promise.resolve({
            message: 'Invalid request.',
            status: 400,
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  it('submits form to backend for 400 res', async () => {
    render(
      <MemoryRouter>
        <CreateUser />
      </MemoryRouter>
    );
    const emailLabel = screen.getByLabelText(/email/i);
    const firstNameLabel = screen.getByLabelText(/first name/i);
    const lastNameLabel = screen.getByLabelText(/last name/i);
    const submitButton = screen.getByRole('button', { name: /create/i });

    const selectInput = screen.getByRole('combobox');
    fireEvent.mouseDown(selectInput);

    const option2 = await screen.findByText('Nurse');
    fireEvent.click(option2);

    fireEvent.change(emailLabel, { target: { value: 'mayank@growexx.com' } });
    fireEvent.change(firstNameLabel, { target: { value: 'mayank' } });
    fireEvent.change(lastNameLabel, { target: { value: 'gouri' } });
    fireEvent.click(submitButton);
    const { res, ans } = await fetchApi(
      emailLabel.value,
      firstNameLabel.value,
      lastNameLabel.value,
      2
    );
    expect(ans.message).toBe('Invalid request.');
  });
});

describe('submits form for 401 res', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 401,

        json: () =>
          Promise.resolve({
            message: 'Invalid token',
            status: 401,
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  it('submits form to backend and gets error', async () => {
    render(
      <MemoryRouter>
        <CreateUser />
      </MemoryRouter>
    );
    const emailLabel = screen.getByLabelText(/email/i);
    const firstNameLabel = screen.getByLabelText(/first name/i);
    const lastNameLabel = screen.getByLabelText(/last name/i);
    const submitButton = screen.getByRole('button', { name: /create/i });

    const selectInput = screen.getByRole('combobox');
    fireEvent.mouseDown(selectInput);

    const option2 = await screen.findByText('Nurse');
    fireEvent.click(option2);

    fireEvent.change(emailLabel, { target: { value: 'mayank@growexx.com' } });
    fireEvent.change(firstNameLabel, { target: { value: 'mayank' } });
    fireEvent.change(lastNameLabel, { target: { value: 'gouri' } });
    fireEvent.click(submitButton);
    const { res, ans } = await fetchApi(
      emailLabel.value,
      firstNameLabel.value,
      lastNameLabel.value,
      2
    );
    expect(ans.message).toBe('Invalid token');
  });
});

describe('submits form for server error', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    global.fetch = () =>
      Promise.reject({
        status: 500,

        json: () =>
          Promise.reject({
            message: 'Something went wrong',
            status: 500,
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  it('submits form to backend for server error', async () => {
    render(
      <MemoryRouter>
        <CreateUser />
      </MemoryRouter>
    );
    const emailLabel = screen.getByLabelText(/email/i);
    const firstNameLabel = screen.getByLabelText(/first name/i);
    const lastNameLabel = screen.getByLabelText(/last name/i);
    const submitButton = screen.getByRole('button', { name: /create/i });

    const selectInput = screen.getByRole('combobox');
    fireEvent.mouseDown(selectInput);

    const option2 = await screen.findByText('Nurse');
    fireEvent.click(option2);

    fireEvent.change(emailLabel, { target: { value: 'mayank@growexx.com' } });
    fireEvent.change(firstNameLabel, { target: { value: 'mayank' } });
    fireEvent.change(lastNameLabel, { target: { value: 'gouri' } });
    fireEvent.click(submitButton);
    const res = await fetchApi(
      emailLabel.value,
      firstNameLabel.value,
      lastNameLabel.value,
      2
    );
    expect(res).toBe('Something went wrong');
  });
});
