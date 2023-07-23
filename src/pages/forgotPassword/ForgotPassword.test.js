import {
   findByText,
   fireEvent,
   render,
   screen,
   waitFor,
 } from '@testing-library/react';
 import { MemoryRouter } from 'react-router-dom';
import { ForgotPassword, forgotPasswordApi } from './ForgotPassword.jsx'
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
 
describe('forgot password', () => {
  beforeEach(() => {
    toast.error = jest
      .fn()
      .mockImplementation((f) => typeof f === 'function' && f());
  });

   it('renders everything', async () => {
     render(
       <MemoryRouter>
         <ForgotPassword />
       </MemoryRouter>
     );
     const textElement = await screen.findByText('Forgot your Password?');
     const inputElement = screen.getByPlaceholderText(/Enter your Email/i);
     const submitElement = screen.getByRole('button', { name: 'Submit' });
     const backElement = screen.getByRole('button',{name:'Back to Login'})

     expect(textElement).toBeInTheDocument();
     expect(inputElement).toBeInTheDocument();
     expect(submitElement).toBeInTheDocument();
     expect(backElement).toBeInTheDocument();
   });
 
   it('shows error message if field is empty', async () => {
     render(
       <MemoryRouter>
         <ForgotPassword />
       </MemoryRouter>
     );
 
     const inputElement = screen.getByPlaceholderText(/Enter your Email/i);
     const submitButton = screen.getByRole('button', { name: 'Submit' });
 
     fireEvent.change(inputElement, {
       target: { value: '', name: 'password' },
     });
     fireEvent.click(submitButton);
     expect(toast.error).toHaveBeenCalled();
   });

   it('navigates back to login', async () => {
    
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    const backElement = screen.getByRole('button',{name:'Back to Login'})
    fireEvent.click(backElement);
      
    expect(mockedUsedNavigate).toBeCalled();
  });
 
   it('shows error message if email is invalid', async () => {
     render(
       <MemoryRouter>
         <ForgotPassword />
       </MemoryRouter>
     );
 
     const inputElement = screen.getByPlaceholderText(/Enter your Email/i);
     const submitButton = screen.getByRole('button', { name: 'Submit' });
 
     fireEvent.change(inputElement, {
       target: { value: 'abcd@ef', name: 'email' },
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
             message: 'Link to reset password is sent to the registered email address.',
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
         <ForgotPassword />
       </MemoryRouter>
     );
     
     
     const inputElement = screen.getByPlaceholderText(/Enter your Email/i);
     const submitButton = screen.getByRole('button', { name: 'Submit' });
 
     fireEvent.change(inputElement, {
       target: { value: 'abcd@ef.com', name: 'email' },
     });
     fireEvent.click(submitButton);
 
     await forgotPasswordApi(inputElement.value)
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
             message: 'You have entered invalid email address. Please, enter a valid email address.',
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
         <ForgotPassword />
       </MemoryRouter>
     );
     
     const inputElement = screen.getByPlaceholderText(/Enter your Email/i);
     const submitButton = screen.getByRole('button', { name: 'Submit' });
 
     fireEvent.change(inputElement, {
       target: { value: 'abcd@ef', name: 'email' },
     });
     fireEvent.click(submitButton);
 
     const {res,ans} = await forgotPasswordApi(inputElement.value)
     expect(ans.message).toBe('You have entered invalid email address. Please, enter a valid email address.')
   })
 });

 describe('for status is 404', () => {
   const unmockedFetch = global.fetch;
 
   beforeEach(() => {
     global.fetch = () =>
       Promise.resolve({
         status: 404,
 
         json: () =>
           Promise.resolve({
             message: 'User not found.',
             status: 404,
           }),
       });
   });
 
   afterEach(() => {
     global.fetch = unmockedFetch;
   });
 
   it('should pass test',async()=>{
     render(
       <MemoryRouter>
         <ForgotPassword />
       </MemoryRouter>
     );
     
     const inputElement = screen.getByPlaceholderText(/Enter your Email/i);
     const submitButton = screen.getByRole('button', { name: 'Submit' });
 
     fireEvent.change(inputElement, {
       target: { value: 'abcd@ef', name: 'email' },
     });
     fireEvent.click(submitButton);
 
     const {res,ans} = await forgotPasswordApi(inputElement.value)
     expect(ans.message).toBe('User not found.')
   })
 });
 
 
 
 describe('server error with 500 status', () => {
   const unmockedFetch = global.fetch;
   beforeEach(() => {
     global.fetch = () =>
       Promise.reject({
         status: 500,
         json: () =>
           Promise.reject({
             message: 'Server Error',
             status: 500,
           }),
       });
   });
 
   afterEach(() => {
     global.fetch = unmockedFetch;
   });
 
   it('works', async () => {
     render(
       <MemoryRouter>
         <ForgotPassword />
       </MemoryRouter>
     );
 
     const inputElement = screen.getByPlaceholderText(/Enter your Email/i);
     const submitButton = screen.getByRole('button', { name: 'Submit' });
 
     fireEvent.change(inputElement, {
       target: { value: 'abcde@gmail.com', name: 'email' },
     });
     fireEvent.click(submitButton);

     const res = await forgotPasswordApi(inputElement.value)
     expect(res).toBe('Server Error')
   });
 });
 
