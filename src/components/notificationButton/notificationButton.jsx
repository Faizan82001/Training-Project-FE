import React, { useState, useEffect } from 'react';
import { NotificationIcon, NewNotificationIcon } from '../icons/icons';
import { Button, Dropdown } from 'antd';
import {
  setDate,
  setImage,
  getNotificationList,
} from '../../utils/getDataFunctions.js';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentRunNo } from '../../features/requestDetails/requestDetailsSlice';
import { setNotificationDot } from '../../features/notification/notificationSlice';
import { useNavigate } from 'react-router-dom';
import './notificationButton.css';

function NotificationButton() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [notificationList, setNotificationList] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const notificationDot = useSelector(
    (state) => state.notification.notificationDot
  );
  useEffect(() => {
    getNotificationList(setNotificationList, setNotificationCount);
  }, []);

  const items = [];
  if (notificationList.length === 0) {
    items.push({
      label: (
        <div className="heading">
          <h3 className="headingNotification">No Notifications</h3>
        </div>
      ),
      key: 'no-notifications',
    });
  } else {
    notificationList.map((doc) => {
      items.push({
        label: (
          <div className="notificationItem">
            <div className="notificationImg">{setImage(doc.status)}</div>
            <div className="notificationContent">
              <h3 className="statusText">{doc.status}</h3>
              <p className="messageStyle">{doc.message}</p>
              <p className="dateStyle">{setDate(doc.timestamp)}</p>
            </div>
          </div>
        ),
        key: doc.timestamp.toString(),
        onClick: () => {
          dispatch(setCurrentRunNo(doc.runNo));
          navigate({
            pathname: `/request-details/${doc.runNo}`,
            search: `?status=New%20Request&assignee=${doc.receiverId}`,
          });
        },
      });
    });
    items.push({
      label: (
        <div className="heading">
          <h3 className="headingNotification">Notifications</h3>
          <div className="notificationCountContainer">
            <span className="countText">{notificationCount}</span>
          </div>
        </div>
      ),
      key: 'heading',
    });
  }
  return (
    <div>
      <Dropdown
        menu={{
          items: items.reverse(),
        }}
        trigger={['click']}
        align={{ offset: [0, 25] }}
        overlayClassName="dropdown"
      >
        <a
          onClick={(e) => {
            dispatch(setNotificationDot(false));
            e.preventDefault();
          }}
        >
          <Button
            type="link"
            className="display-center"
            style={{ padding: '5px' }}
            size="small"
            data-testid="notifications"
          >
            {notificationDot ? <NewNotificationIcon /> : <NotificationIcon />}
          </Button>
        </a>
      </Dropdown>
    </div>
  );
}

export default NotificationButton;
