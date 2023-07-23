import { Button, Form, Input } from 'antd';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import cryptoJs from 'crypto-js';
import { useNavigate, useParams } from 'react-router-dom';

const setPasswordApi = async ({
  password,
  confirmPassword,
  token,
  navigate,
}) => {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_URL}/api/auth/set-password/${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
          confirmPassword,
          token,
        }),
      }
    );

    const ans = await res.json();

    if (res.status === 200) {
      navigate('/login');
      toast.success(ans.message);
    } else if (res.status === 400) {
      toast.error(ans.message);
    } else if (res.status === 500) {
      toast.error(ans.message);
    }

    return { res, ans };
  } catch (error) {
    toast.error('An error occured');
    return 'An error occured';
  }
};

function SetPassword() {
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const params = useParams();
  const token = params.id;
  const navigate = useNavigate();

  const submitForm = async () => {
    const secret = process.env.REACT_APP_PSW_ENCRYPT_KEY;
    if (pass === '' || confirmPass === '') {
      toast.error('Please fill all fields');
    } else if (pass.length < 6 || confirmPass.length < 6) {
      toast.error('Password must be greater than 6 characters');
    } else if (pass !== confirmPass) {
      toast.error('New password and confirm password must be same');
    } else {
      const password = cryptoJs.AES.encrypt(pass, secret).toString();
      const confirmPassword = cryptoJs.AES.encrypt(
        confirmPass,
        secret
      ).toString();
      await setPasswordApi({ password, confirmPassword, token, navigate });
    }
  };

  const handleChange = (e) => {
    if (e.target.id === 'change-password_password') {
      setPass(e.target.value);
    }
    if (e.target.id === 'change-password_confirm-password') {
      setConfirmPass(e.target.value);
    }
  };

  return (
    <>
      <div className="container">
        <h2 className="form-heading" data-testid="set-password-text">
          Please Set Your New Password
        </h2>
        <br />
        <br />

        <Form className="responsive" name="change-password" layout="vertical">
          <Form.Item
            label="New Password"
            name="password"
            rules={[
              { required: true, message: 'Please enter your new password.' },
              {
                min: 6,
                message: 'Password must be at least 6 characters.',
              },
            ]}
          >
            <Input.Password
              size="large"
              className="blue-underline"
              placeholder="Enter New Password..."
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item
            label="Confirm New Password"
            name="confirm-password"
            rules={[
              {
                required: true,
                message: 'Please confirm new Password.',
              },
              {
                min: 6,
                message: 'Confirm New Password must be at least 6 characters.',
              },
            ]}
          >
            <Input.Password
              size="large"
              className="blue-underline"
              placeholder="Confirm New Password..."
              onChange={handleChange}
            />
          </Form.Item>
          <Button type="primary" onClick={submitForm}>
            Change
          </Button>
        </Form>
      </div>
    </>
  );
}

export { SetPassword, setPasswordApi };
