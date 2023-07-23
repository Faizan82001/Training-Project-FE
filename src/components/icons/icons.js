import React, { useState } from 'react';
import analytics from '../../assets/home.png';
import users from '../../assets/users.png';
import ambulance from '../../assets/ambulance.png';
import logout from '../../assets/logout.png';
import auditTrail from '../../assets/auditTrail.png';
import preview from '../../assets/preview.png';
import patient from '../../assets/patient.png';
import comment from '../../assets/comment.png';
import doc from '../../assets/doc.png';
import healthInsurance from '../../assets/health-insurance.png';
import changePassword from '../../assets/changepassword.png';
import sendMsg from '../../assets/send.png';
import sendMsgGray from '../../assets/sendgray.png';
import pcsIcon from '../../assets/pcs_icon.png';
import notification from '../../assets/notification.png';
import dataProvided from '../../assets/data-provided.png';
import newComment from '../../assets/comment-list.png';
import newRequest from '../../assets/new-request.png';
import newNotification from '../../assets/newnotification.png';

const AnalyticsIcon = () => {
  return <img src={analytics} alt="analytics" />;
};

const UserIcon = () => {
  return <img src={users} alt="users" />;
};

const AmbulanceIcon = () => {
  return <img src={ambulance} alt="ambulance" />;
};
const LogoutIcon = () => {
  return (
    <img
      style={{
        maxWidth: '1vw',
        minWidth: '15px',
        marginRight: '10px',
      }}
      src={logout}
      alt="logout"
    />
  );
};
const ChangePasswordIcon = () => {
  return (
    <img
      style={{
        maxWidth: '1.3vw',
        minWidth: '20px',
        marginRight: '7px',
        marginLeft: '-2px',
      }}
      src={changePassword}
      alt="change-password"
    />
  );
};

const NotificationIcon = () => {
  return (
    <img
      style={{
        maxWidth: '1.4vw',
        minWidth: '28px',
      }}
      src={notification}
      alt="notification"
    />
  );
};

const NewNotificationIcon = () => {
  return (
    <img
      style={{ maxWidth: '1.4vw', minWidth: '28px' }}
      src={newNotification}
      alt="new-notification"
    />
  );
};

const AuditTrailIcon = () => {
  return <img src={auditTrail} alt="auditTrail" data-testid="auditTrail" />;
};

const PreviewIcon = () => {
  return <img src={preview} alt="preview" data-testid="previewIcon" />;
};
const PatientIcon = () => {
  return <img src={patient} alt="patient" data-testid="patientIcon" />;
};

const DocIcon = () => {
  return <img src={doc} alt="guarantor" data-testid="guarantorIcon" />;
};

const CommentIcon = () => {
  return <img src={comment} alt="comment" data-testid="commentIcon" />;
};

const HealthInsuranceIcon = () => {
  return (
    <img
      src={healthInsurance}
      alt="healthInsurance"
      data-testid="healthInsuranceIcon"
    />
  );
};

// eslint-disable-next-line react/prop-types
const SendMsg = ({ handleClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return (
    <img
      style={{
        width: '35px',
        borderRadius: '50%',
        cursor: isHovered ? 'grab' : 'auto',
        border: isHovered ? '0.1px solid blue' : 'none',
      }}
      src={sendMsg}
      alt="sendMsg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    />
  );
};

const SendMsgGray = () => {
  return <img style={{ width: '35px' }} src={sendMsgGray} alt="sendDisabled" />;
};

const PCSIcon = () => {
  return <img src={pcsIcon} alt="pcsIcon" data-testid="pcsIcon" />;
};

const DataProvidedIcon = () => {
  return (
    <img
      style={{ maxWidth: '2.4vw', minWidth: '15px' }}
      src={dataProvided}
      alt="dataProvided"
    />
  );
};

const NewRequestIcon = () => {
  return (
    <img
      style={{ maxWidth: '3vw', minWidth: '15px' }}
      src={newRequest}
      alt="newRequest"
    />
  );
};

const NewCommentIcon = () => {
  return (
    <img
      style={{ maxWidth: '2.4vw', minWidth: '15px' }}
      src={newComment}
      alt="newComment"
    />
  );
};
export {
  AnalyticsIcon,
  UserIcon,
  AmbulanceIcon,
  LogoutIcon,
  ChangePasswordIcon,
  NotificationIcon,
  NewNotificationIcon,
  AuditTrailIcon,
  PreviewIcon,
  PatientIcon,
  DocIcon,
  CommentIcon,
  HealthInsuranceIcon,
  SendMsg,
  SendMsgGray,
  PCSIcon,
  DataProvidedIcon,
  NewCommentIcon,
  NewRequestIcon,
};
