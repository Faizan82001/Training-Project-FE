import React, { useState } from 'react';
import { Button, Form, Input, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import cryptoJs from 'crypto-js';
import { toast } from 'react-toastify';
import './login.css';
import logo from '../../assets/md.png';
import messages from '../../utils/messages.json';
import { COMMON_REGEX } from '../../utils/constants';
import { getFCMToken } from '../../utils/firebase';

const Login = function () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  let navigateTo = '/analytics';

  const submit = async () => {
    try {
      if (password.length > 6) {
        const secret = process.env.REACT_APP_PSW_ENCRYPT_KEY;
        const encryptedPassword = cryptoJs.AES.encrypt(
          password,
          secret
        ).toString();
        const fcmToken = await getFCMToken();
        localStorage.setItem('fcmToken', fcmToken);

        setLoading(true);
        const { res, ans } = await postLogin(
          email,
          encryptedPassword,
          fcmToken
        );

        if (res.status === 200) {
          setLoading(false);
          if (ans.data.roleId === 1 || ans.data.roleId === 2) {
            localStorage.setItem('token', ans.token);
            localStorage.setItem('data', JSON.stringify(ans.data));
            if (ans.data.roleId === 2) {
              navigateTo =
                '/trip-requests?key=1&status=all&page=1&myRequest=false';
            }
            navigate(navigateTo);
          } else {
            setLoading(false);
            toast.error(messages.NURSE_NOT_AUTHORIZED);
          }
        } else {
          setLoading(false);
          toast.warning(ans.message);
        }
      }
    } catch (e) {
      setLoading(false);
      toast.error(messages.GENERAL_ERROR);
    }
  };

  const handleChange = (e) => {
    if (e.target.id === 'login_email') {
      setEmail(e.target.value);
    } else if (e.target.id === 'login_password') {
      setPassword(e.target.value);
    }
  };

  const onForgotPassword = () => {
    navigate('/forgot-password');
  };

  const emailPattern = COMMON_REGEX.EMAIL;

  return (
    <Spin spinning={loading} size="large">
      <div id="login-container">
        <div className="logo-container">
          <img src={logo} alt="logoImage" className="logo-main" />
          <br />
          <p>Sign In</p>
        </div>
        <Form
          id="login"
          name="login"
          layout="vertical"
          labelCol={{ span: 8 }}
          wrapperCol={{
            span: 24,
          }}
          style={{
            maxWidth: 500,
          }}
          autoComplete="off"
        >
          <Form.Item
            label="Email ID"
            name="email"
            rules={[
              {
                required: true,
                pattern: emailPattern,
                message: messages.INPUT_VALID_EMAIL_MESSAGE,
                type: 'email',
              },
            ]}
          >
            <Input placeholder="Enter e-mail Address" onChange={handleChange} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: messages.INPUT_PASSWORD_MESSAGE,
              },
              {
                min: 6,
                message: messages.INSUFFICENT_PASSWORD_LENGTH_MESSAGE,
              },
            ]}
          >
            <Input.Password
              placeholder="Enter Password"
              onChange={handleChange}
            />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              span: 24,
            }}
          >
            <div className="buttons">
              <Button
                className="button"
                type="primary"
                block
                htmlType="submit"
                onClick={submit}
              >
                Login
              </Button>

              <Button
                className="button"
                type="link"
                htmlType="button"
                onClick={onForgotPassword}
              >
                Forgot Password
              </Button>
            </div>
          </Form.Item>
        </Form>
        <p className="text-muted text-center ">
          © 2023 Medical Data Innovations
        </p>
      </div>
    </Spin>
  );
};
async function postLogin(email, password, fcmToken) {
  const body = { email, password, fcmToken };
  const res = await fetch(`${process.env.REACT_APP_URL}/api/auth/login`, {
    body: JSON.stringify(body),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const ans = await res.json();

  return { ans, res };
}

export { Login, postLogin };
