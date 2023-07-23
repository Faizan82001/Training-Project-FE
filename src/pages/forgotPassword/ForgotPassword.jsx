import { Button, Form, Input } from 'antd';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { COMMON_REGEX } from '../../utils/constants';

async function forgotPasswordApi(email, navigate) {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_URL}/api/auth/forgot-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      }
    );
    const ans = await res.json();
    if (res.status === 200) {
      toast.success(ans.message);
      navigate('/login');
    } else if (res.status === 400) {
      toast.error(ans.message);
      return { res, ans };
    } else if (res.status === 404) {
      toast.error(ans.message);
      return { res, ans };
    }
  } catch (error) {
    toast.error('Server Error');
    return 'Server Error';
  }
}

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const validEmail = COMMON_REGEX.EMAIL;

  const submitForm = async () => {
    if (email === '') {
      toast.error('Please enter your Email');
    } else if (!validEmail.test(email)) {
      toast.error('Please enter a valid email address');
    } else {
      await forgotPasswordApi(email, navigate);
    }
  };

  const backToLogin = () => {
    navigate('/login');
  };

  const handleChange = (e) => {
    if (e.target.id === 'forgot-password_email') {
      setEmail(e.target.value);
    }
  };

  return (
    <>
      <div className="container">
        <h2 className="form-heading">
          Forgot your Password? <span>Set a new one</span>
        </h2>

        <Form className="responsive" name="forgot-password" layout="vertical">
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              {
                required: true,
                message: 'Please Enter your Email.',
              },
            ]}
          >
            <Input
              size="large"
              type="email"
              placeholder="Enter your Email..."
              onChange={handleChange}
            />
          </Form.Item>
          <div className="buttons">
            <Button type="primary" name="submit" onClick={submitForm}>
              Submit
            </Button>
            <Button type="link" onClick={backToLogin}>
              Back to Login
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}

export { ForgotPassword, forgotPasswordApi };
