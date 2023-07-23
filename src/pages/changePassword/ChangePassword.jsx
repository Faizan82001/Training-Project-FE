import { Button, Form, Input } from 'antd';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import cryptoJs from 'crypto-js';
import messages from '../../utils/messages.json';
import { useNavigate } from 'react-router-dom';

const changePasswordApi = async ({
  oldPassword,
  newPassword,
  confirmPassword,
  navigate,
}) => {
  try {
    const token = localStorage.getItem('token');

    const res = await fetch(
      `${process.env.REACT_APP_URL}/api/auth/change-password`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
          confirmPassword,
        }),
      }
    );
    const ans = await res.json();
    if (res.status === 200) {
      toast.success(ans.message);
      navigate('/');
    } else if (res.status === 400) {
      toast.error(ans.message);
      return true;
    } else if (res.status === 401) {
      toast.error(ans.message);
      return true;
    }
  } catch (error) {
    toast.error(messages.GENERAL_ERROR);
    return true;
  }
};

function ChangePassword() {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const navigate = useNavigate();

  const submitForm = async () => {
    const secret = process.env.REACT_APP_PSW_ENCRYPT_KEY;
    if (oldPass === '' || newPass === '' || confirmPass === '') {
      toast.error(messages.EMPTY_FIELDS_ERROR);
    } else if (
      oldPass.length < 6 ||
      newPass.length < 6 ||
      confirmPass.length < 6
    ) {
      toast.error(messages.INSUFFICENT_PASSWORD_LENGTH_MESSAGE);
    } else if (newPass !== confirmPass) {
      toast.error(messages.NEW_NOT_EQUAL_CONFIRM);
    } else {
      const oldPassword = cryptoJs.AES.encrypt(oldPass, secret).toString();
      const newPassword = cryptoJs.AES.encrypt(newPass, secret).toString();
      const confirmPassword = cryptoJs.AES.encrypt(
        confirmPass,
        secret
      ).toString();
      await changePasswordApi({
        oldPassword,
        newPassword,
        confirmPassword,
        navigate,
      });
    }
  };

  const handleChange = (e) => {
    if (e.target.id === 'change-password_old-password') {
      setOldPass(e.target.value);
    }
    if (e.target.id === 'change-password_new-password') {
      setNewPass(e.target.value);
    }
    if (e.target.id === 'change-password_confirm-password') {
      setConfirmPass(e.target.value);
    }
  };

  return (
    <>
      <div className="container">
        <h2 className="form-heading">Change Password</h2>

        <Form className="responsive" name="change-password" layout="vertical">
          <Form.Item
            label="Old Password"
            name="old-password"
            rules={[
              { required: true, message: messages.INPUT_OLD_PASSWORD_MESSAGE },
              {
                min: 6,
                message: messages.INSUFFICENT_PASSWORD_LENGTH_MESSAGE,
              },
            ]}
          >
            <Input
              size="large"
              type="password"
              placeholder="Enter Old Password..."
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="new-password"
            rules={[
              { required: true, message: messages.INPUT_NEW_PASSWORD_MESSAGE },
              {
                min: 6,
                message: messages.INSUFFICENT_PASSWORD_LENGTH_MESSAGE,
              },
            ]}
          >
            <Input
              size="large"
              type="password"
              placeholder="Enter New Password..."
              data-testid="id-new"
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item
            label="Confirm New Password"
            name="confirm-password"
            rules={[
              {
                required: true,
                message: messages.INPUT_CONFIRM_PASSWORD_MESSAGE,
              },
              {
                min: 6,
                message: messages.INSUFFICENT_PASSWORD_LENGTH_MESSAGE,
              },
            ]}
          >
            <Input
              size="large"
              type="password"
              placeholder="Confirm New Password..."
              onChange={handleChange}
            />
          </Form.Item>
          <Button type="primary" onClick={submitForm} data-testid="id-submit">
            Change
          </Button>
        </Form>
      </div>
    </>
  );
}

export { ChangePassword, changePasswordApi };
