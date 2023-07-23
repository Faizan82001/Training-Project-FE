import './App.css';
import React, { useEffect } from 'react';
import { Login } from './pages/login/Login';
import Analytics from './pages/analytics/Analytics';
import UserList from './pages/userList/UserList';
import RequestDetails from './pages/requestDetails/RequestDetails';
import PrivateRoutes from './utils/PrivateRoutes';
import Appwrapper from './components/appwrapper/Appwrapper';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { SetPassword } from '../src/pages/setPassword/SetPassword';
import { CreateUser } from './pages/createUser/CreateUser';
import { ChangePassword } from './pages/changePassword/ChangePassword';
import { ForgotPassword } from './pages/forgotPassword/ForgotPassword';
import RequestList from './pages/requestList/RequestList';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './firebase-messaging-sw';
import { onMessageListener } from './utils/firebase';

function App() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./firebase-messaging-sw.js');
      });
    }
    onMessageListener();
  }, []);

  return (
    <Router>
      <Appwrapper>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/set-password/:id" element={<SetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route element={<PrivateRoutes />}>
            <Route
              path="/*"
              element={
                <Navigate
                  to="/trip-requests?key=1&status=all&page=1&myRequest=false"
                  replace
                />
              }
            />
            <Route element={<Analytics />} path="/analytics" />
            <Route element={<UserList />} path="/users" />
            <Route element={<RequestList />} path="/trip-requests" />
            <Route
              element={<RequestDetails />}
              path="/request-details/:runNo"
            />
            <Route path="/manager/create-user" element={<CreateUser />} />
            <Route path="/change-password" element={<ChangePassword />} />
          </Route>
        </Routes>
      </Appwrapper>
      <ToastContainer />
    </Router>
  );
}

export default App;
