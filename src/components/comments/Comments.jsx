import React, { useEffect, useState, useCallback, useRef } from 'react';
import './comments.css';
import { Avatar, Card, ConfigProvider, Input } from 'antd';
import { SendMsg, SendMsgGray } from '../icons/icons';
import messages from '../../utils/messages.json';
import { db } from '../../utils/firebase.js';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
} from 'firebase/firestore';
import { store } from '../../app/store.js';
import { setShouldReceiveNotification } from '../../features/notification/notificationSlice.js';
import { sendNotification } from '../../utils/getDataFunctions.js';

function Comments() {
  const chatParent = useRef();
  const data = JSON.parse(localStorage.getItem('data'));
  const currentStatus = useSelector(
    (state) => state.requestDetails.currentStatus
  );
  const runNo = window.location.pathname.substring(17);
  const token = localStorage.getItem('token');
  const [message, setMessage] = useState('');
  const [comments, setComments] = useState([]);
  const [disable, setDisable] = useState(true);
  const [chatData, setChatData] = useState({
    creatorId: '',
    assignee: '',
    creatorInitial: '',
    assigneeInitial: '',
    creatorFCMToken: '',
    assigneeFCMToken: '',
  });

  const renderMessage = (comment, text) => {
    return (
      <>
        <Avatar
          className={chatData.assignee === comment.senderId ? 'hide' : 'avatar'}
          style={{
            backgroundColor: '#ccd6ff',
            color: '#222029',
            margin: '1%',
            userSelect: 'none',
          }}
        >
          {chatData.creatorInitial}
        </Avatar>
        <div className="message-container">
          <div className="message-body">
            <Card size="small" className="card">
              {text}
            </Card>
          </div>
          <span className="date">{comment.formattedTimestamp}</span>
        </div>
      </>
    );
  };

  const subscribeToFirestore = useCallback(async () => {
    const q = query(collection(db, runNo), orderBy('timestamp'));
    onSnapshot(q, (snapshot) => {
      const updatedData = snapshot.docs.map((doc) => {
        const date = new Date(doc.data().timestamp);
        const formattedTimestamp = `${date.toLocaleString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        })} ${date.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}`;
        return { ...doc.data(), formattedTimestamp, id: doc.id };
      });
      setComments(updatedData);
      scrollToBottom();
    });
  }, []);

  useEffect(() => {
    if (currentStatus === 'Request more Information') {
      setDisable(false);
    }
  }, [currentStatus]);

  useEffect(() => {
    fetchAPI();
    subscribeToFirestore();
    domScrollBottom();
  }, []);

  const fetchAPI = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_URL}/api/trip-requests/chat-data/${runNo}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const ans = await res.json();
      setChatData(ans.data);
      domScrollBottom();
    } catch (error) {
      toast.error(messages.GENERAL_ERROR);
    }
  };

  const scrollToBottom = () => {
    const element = document.querySelector('#chats');
    if (element) {
      document.querySelector('#chats').scrollTo({
        top: element.scrollHeight,
      });
    }
  };

  const messageRegex = new RegExp(/^(?:\s*|)$/, 'gm');

  const handlePressEnter = (e) => {
    if (e.keyCode === 13) {
      if (message.trimStart().length !== 0) {
        handleClick();
      } else {
        setMessage('');
      }
    }
  };

  const handleClick = async () => {
    try {
      await addDoc(collection(db, runNo), {
        senderId: chatData.assignee,
        receiverId: chatData.creatorId,
        status: 'New Comment',
        subMessage: message,
        message: `New Request has been created with Run No. ${runNo}`,
        timestamp: Date.now(),
      });
      sendNotification(chatData.creatorFCMToken, message);
    } catch (error) {
      toast.error(messages.GENERAL_ERROR);
    }
    scrollToBottom();
    setMessage('');
  };

  const domScrollBottom = () => {
    const domNode = chatParent.current;
    if (domNode) {
      const element = document.querySelector('#chats');

      document.querySelector('#chats').scrollTo({
        top: element.scrollHeight,
      });
      domNode.scrollTop = domNode.scrollHeight;
    }
  };

  useEffect(() => {
    store.dispatch(setShouldReceiveNotification(false));

    scrollToBottom();

    return () => {
      store.dispatch(setShouldReceiveNotification(true));
    };
  }, [comments]);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="comment-box">
      {comments.length === 0 ? (
        <div className="no-data">No data</div>
      ) : (
        <div id="chats" data-testid="chats">
          {comments.map((comment) => {
            return (
              <>
                <div key={comment.id}>
                  <div
                    className={
                      chatData.assignee === comment.senderId
                        ? 'my-message'
                        : 'recieved-message'
                    }
                  >
                    {comment.status !== 'New Comment' &&
                      renderMessage(comment, comment.message)}
                  </div>
                </div>
                <div key={comment.id}>
                  <div
                    className={
                      chatData.assignee === comment.senderId
                        ? 'my-message'
                        : 'recieved-message'
                    }
                  >
                    {comment.subMessage &&
                      renderMessage(comment, comment.subMessage)}
                  </div>
                </div>
              </>
            );
          })}
        </div>
      )}
      <ConfigProvider
        theme={{
          token: {
            borderRadius: '50px',
            colorBorder: disable ? '#d9d9d9' : '#b9b6b6',
          },
        }}
      >
        <Input
          disabled={disable}
          value={message}
          data-testid="input"
          onChange={handleChange}
          className={
            data.roleId === 1 || chatData.assignee !== data.id
              ? 'hide'
              : 'input'
          }
          placeholder="Type a comment..."
          onKeyDown={handlePressEnter}
          suffix={
            messageRegex.test(message) ? (
              <SendMsgGray />
            ) : (
              <SendMsg data-testid="send-suffix" handleClick={handleClick} />
            )
          }
        />
      </ConfigProvider>
    </div>
  );
}

export default Comments;
