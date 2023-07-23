import { Button, Form, Input, Select } from 'antd';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import messages from '../../utils/messages.json';
import { useNavigate } from 'react-router-dom';
import { COMMON_REGEX } from '../../utils/constants';

const fetchApi = async ({ firstName, lastName, email, roleId, navigate }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${process.env.REACT_APP_URL}/api/billing-manager/user`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          roleId,
        }),
      }
    );
    const ans = await response.json();
    if (response.status === 200) {
      toast.success(ans.message);
      navigate('/users?status=invited&role_id=0&page=1');
    } else if (response.status === 400) {
      toast.error(ans.message);
      return { response, ans };
    } else if (response.status === 401) {
      toast.error(ans.message);
      return { response, ans };
    }
  } catch (error) {
    toast.error(messages.GENERAL_ERROR);
    return 'Something went wrong';
  }
};

function CreateUser() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstname] = useState('');
  const [lastName, setLastname] = useState('');
  const [roleId, setRoleId] = useState();
  const navigate = useNavigate();

  const submitForm = async () => {
    const data = { email, firstName, lastName, roleId, navigate };
    const validEmail = COMMON_REGEX.EMAIL;
    if (email === '' || firstName === '' || lastName === '' || roleId === 0) {
      toast.error(messages.EMPTY_FIELDS_ERROR);
    } else if (!validEmail.test(email)) {
      toast.error(messages.INVALID_EMAIL);
    } else {
      await fetchApi(data);
    }
  };

  const handleChange = (e) => {
    if (e.target.id === 'create-user_email') {
      setEmail(e.target.value);
    } else if (e.target.id === 'create-user_first-name') {
      setFirstname(e.target.value);
    } else if (e.target.id === 'create-user_last-name') {
      setLastname(e.target.value);
    }
  };
  const setSelectedRole = (text, index) => {
    setRoleId(index.value);
  };

  return (
    <>
      <div className="container">
        <h2 className="form-heading" data-testid="id-create">
          Create User
        </h2>
        <Form className="responsive" name="create-user" layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: messages.INVALID_EMAIL,
                type: 'email',
              },
            ]}
          >
            <Input
              size="large"
              type="email"
              name="email"
              placeholder="Enter e-mail Address..."
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item
            label="First Name"
            name="first-name"
            rules={[{ required: true, message: messages.EMPTY_FIELDS_ERROR }]}
          >
            <Input
              size="large"
              placeholder="Enter first Name..."
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="last-name"
            rules={[{ required: true, message: messages.EMPTY_FIELDS_ERROR }]}
          >
            <Input
              size="large"
              placeholder="Enter Last Name..."
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item label="User Type" name="selected-role">
            <Select
              size="large"
              placeholder="--select--"
              onChange={setSelectedRole}
              data-testid="user-role"
            >
              <Select.Option value="2" key="billing-admin">
                Billing Admin
              </Select.Option>
              <Select.Option value="3" key="nurse">
                Nurse
              </Select.Option>
            </Select>
          </Form.Item>
          <Button type="primary" data-tesid="submit-form" onClick={submitForm}>
            Create
          </Button>
        </Form>
      </div>
    </>
  );
}

export { CreateUser, fetchApi };
