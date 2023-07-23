import React from 'react';
import { ChangePasswordIcon } from '../icons/icons';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

function ChangePasswordButton() {
  const navigate = useNavigate();
  const handleclick = () => {
    navigate('/change-password');
  };
  return (
    <Button
      type="link"
      onClick={handleclick}
      style={{
        padding: '5px',
        display: 'flex',
        alignItems: 'center',
        color: '#354b7a',
      }}
      size="small"
    >
      <ChangePasswordIcon /> Change Password
    </Button>
  );
}

export default ChangePasswordButton;
