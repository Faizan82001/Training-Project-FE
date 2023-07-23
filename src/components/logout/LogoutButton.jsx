import React from 'react';
import { LogoutIcon } from '../icons/icons';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { toast } from 'react-toastify';
import messages from '../../utils/messages.json';

function LogoutButton() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_URL}/api/auth/logout`, {
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
      });
      const ans = await res.json();
      if (res.status === 200) {
        localStorage.clear();
        navigate('/login');
      } else if (res.status === 401) {
        navigate('/login');
        localStorage.clear();
      } else {
        toast.error(ans.message);
      }
    } catch (err) {
      toast.error(messages.GENERAL_ERROR);
    }
  };
  return (
    <div>
      <Button
        type="link"
        onClick={handleLogout}
        style={{
          padding: '5px',
          display: 'flex',
          alignItems: 'center',
          color: '#354b7a',
          width: '152px',
        }}
        size="small"
      >
        <LogoutIcon /> Logout
      </Button>
    </div>
  );
}

export default LogoutButton;
