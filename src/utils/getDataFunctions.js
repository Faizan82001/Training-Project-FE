import React from 'react';
import messages from './messages.json';
import dayjs from 'dayjs';
import { TRIP_STATUS } from '../utils/constants';
import {
  NewCommentIcon,
  NewRequestIcon,
  DataProvidedIcon,
} from '../components/icons/icons.js';
import { collection, where, query, onSnapshot } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { store } from '../app/store';
import { setNotificationDot } from '../features/notification/notificationSlice';

async function getUsers(status, role_id, page = 1) {
  const token = localStorage.getItem('token');
  let queryParms;
  if (status === undefined && role_id === undefined) {
    queryParms = `status=active&page=${page}`;
  } else if (status && role_id === undefined) {
    queryParms = `status=${status}&page=${page}`;
  } else if (role_id === 0) {
    queryParms = `status=${status}&page=${page}`;
  } else queryParms = `status=${status}&role_id=${role_id}&page=${page}`;

  const res = await fetch(
    `${process.env.REACT_APP_URL}/api/billing-manager/users?${queryParms}`,
    {
      headers: { authorization: `Bearer ${token}` },
    }
  );
  const ans = await res.json();
  return { ans, res };
}
async function getRequests(
  token,
  status = null,
  sub_status = null,
  page = 1,
  myRequest = null
) {
  try {
    // eslint-disable-next-line prettier/prettier
    const queryParms = `page=${page}${status ? `&requestType=${status}` : ``}${
      sub_status ? `&status=${sub_status}` : ``
      // eslint-disable-next-line prettier/prettier
    }${myRequest ? `&myRequest=true` : ``}`;
    const res = await fetch(
      `${process.env.REACT_APP_URL}/api/billing-admin/requests?${queryParms}`,
      {
        headers: { authorization: `Bearer ${token}` },
      }
    );
    const ans = await res.json();

    return { ans, res };
  } catch (error) {
    return messages.GENERAL_ERROR;
  }
}
// to change the status of request (new to pending or pending to new)
async function changeRequestStatus(runNo) {
  const token = localStorage.getItem('token');
  const res = await fetch(
    `${process.env.REACT_APP_URL}/api/billing-admin/change-status/${runNo}`,
    {
      method: 'PATCH',
      headers: { authorization: `Bearer ${token}` },
    }
  );
  const ans = await res.json();
  return { res, ans };
}
async function approveRequest(runNo, mappedPatientData) {
  const token = localStorage.getItem('token');
  const body = { patient: mappedPatientData };
  const res = await fetch(
    `${process.env.REACT_APP_URL}/api/billing-admin/approve-request?runNo=${runNo}`,
    {
      body: JSON.stringify(body),
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  const ans = await res.json();
  return { res, ans };
}

async function getImages(runNo) {
  const token = localStorage.getItem('token');

  const res = await fetch(
    `${process.env.REACT_APP_URL}/api/trip-requests/trip-image?runNo=${runNo}`,
    {
      method: 'GET',
      headers: { authorization: `Bearer ${token}` },
    }
  );
  const ans = await res.json();
  return { res, ans };
}

async function postRequireMoreInformation(runNo, message) {
  const token = localStorage.getItem('token');
  const body = { message };
  const res = await fetch(
    `${process.env.REACT_APP_URL}/api/billing-admin/request-more-info/${runNo}`,
    {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  const ans = await res.json();
  return { res, ans };
}

// for approve with exception /api/billing-admin/approve-with-exception/{runNo}

async function postApproveWithExp(runNo, message, mappedPatientData) {
  const token = localStorage.getItem('token');
  const body = { message, patient: mappedPatientData };
  const res = await fetch(
    `${process.env.REACT_APP_URL}/api/billing-admin/approve-with-exception/${runNo}`,
    {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  const ans = await res.json();
  return { res, ans };
}

async function getPatientData(runNo) {
  const token = localStorage.getItem('token');
  const res = await fetch(
    `${process.env.REACT_APP_URL}/api/billing-admin/patient/${runNo}`,
    {
      headers: { authorization: `Bearer ${token}` },
    }
  );
  const ans = await res.json();
  return { res, ans };
}

function formateUserData(userData) {
  userData.forEach((object, i) => {
    object['key'] = `${i}`;
    if (object.roleId === 2) {
      object['role'] = 'Billing Admin';
    }
    if (object.roleId === 3) {
      object['role'] = 'Nurse';
    }
  });

  return userData;
}

function mapPatientData(formData) {
  const mappedValues = {
    patientName: formData.name,
    MRN: formData.mrn,
    dob: dayjs(formData.dob),
    gender: formData.patientGender ? formData.patientGender.toLowerCase() : '',
    residence: formData.patientAddress,
    healthcareFacility: formData.healthcareFacility,
    admissionDate: dayjs(formData.admissionDate),
    typeOfAdmission: formData.admissionType,
    attendingPhysician: formData.attendingPhysician,
    thirdPartyPayer: formData.thirdPartyPayer,
    subscriberName: formData.subscriberName,
    address: formData.insuranceAddress,
    insuranceContactNumber: formData.insuranceContactNo,
    policyNumber: formData.policyNo,
    groupName: formData.insuranceGroupName,
    groupNumber: formData.insuranceGroupNo,
    guarantorName: formData.guarantorName,
    guarantorAddress: formData.guarantorAddress,
    guarantorGender: formData.guarantorGender
      ? formData.guarantorGender.toLowerCase()
      : '',
    relationship: formData.relationship,
    weight: +formData.guarantorWeight,
    height: +formData.guarantorHeight,
    diagnosis: formData.diagnosis,
    pickupLocation: formData.pickupLocation,
    pickupDateTime: dayjs(formData.pickupDateTime),
    requestedBy: formData.requestedBy,
    contactNumber: formData.contactNumber,
    pickupLocationunitRoom: formData.pickupLocationunitRoom,
    sendingMD: formData.sendingMD,
    destinationAddress: formData.destinationAddress,
    destinationUnitRoom: formData.destinationUnitRoom,
    acceptingMD: formData.acceptingMD,
    appointmentDateTime: dayjs(formData.appointmentDateTime),
  };
  if (formData.dob === undefined || formData.dob === null) {
    delete mappedValues.dob;
  }
  if (formData.admissionDate === undefined || formData.admissionDate === null) {
    delete mappedValues.admissionDate;
  }
  if (
    formData.pickupDateTime === undefined ||
    formData.pickupDateTime === null
  ) {
    delete mappedValues.pickupDateTime;
  }
  if (
    formData.appointmentDateTime === undefined ||
    formData.appointmentDateTime === null
  ) {
    delete mappedValues.appointmentDateTime;
  }
  return mappedValues;
}

async function getBarGraphData(token, startDate, endDate, id) {
  const res = await fetch(
    `${process.env.REACT_APP_URL}/api/billing-manager/performance-counter?startDate=${startDate}&endDate=${endDate}&id=${id}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  const ans = await res.json();
  return { res, ans };
}

function mapFormDataToPatient(patientData) {
  let admissionDate;
  let appointmentDateTime;
  if (!patientData.admissionDate) {
    admissionDate = null;
  } else {
    admissionDate = patientData.admissionDate.toISOString();
  }
  if (!patientData.appointmentDateTime) {
    appointmentDateTime = null;
  } else {
    appointmentDateTime = patientData.appointmentDateTime.toISOString();
  }
  return {
    admissionDate,
    appointmentDateTime,
    name: patientData.patientName,
    mrn: patientData.MRN,
    dob: patientData.dob.toISOString(),
    patientGender: patientData.gender,
    patientAddress: patientData.residence,
    healthcareFacility: patientData.healthcareFacility,
    admissionType: patientData.typeOfAdmission,
    attendingPhysician: patientData.attendingPhysician,
    thirdPartyPayer: patientData.thirdPartyPayer,
    subscriberName: patientData.subscriberName,
    insuranceAddress: patientData.address,
    insuranceContactNo: patientData.insuranceContactNumber,
    policyNo: patientData.policyNumber,
    insuranceGroupName: patientData.groupName,
    insuranceGroupNo: patientData.groupNumber,
    guarantorName: patientData.guarantorName,
    guarantorAddress: patientData.guarantorAddress,
    guarantorGender: patientData.guarantorGender,
    relationship: patientData.relationship,
    guarantorWeight: patientData.weight,
    guarantorHeight: patientData.height,
    diagnosis: patientData.diagnosis,
    pickupLocation: patientData.pickupLocation,
    pickupDateTime: patientData.pickupDateTime.toISOString(),
    requestedBy: patientData.requestedBy,
    contactNumber: patientData.contactNumber,
    pickupLocationunitRoom: patientData.pickupLocationunitRoom,
    sendingMD: patientData.sendingMD,
    destinationAddress: patientData.destinationAddress,
    destinationUnitRoom: patientData.destinationUnitRoom,
    acceptingMD: patientData.acceptingMD,
  };
}
async function getTripsForUser() {
  const token = localStorage.getItem('token');
  const res = await fetch(
    `${process.env.REACT_APP_URL}/api/trip-requests/trips`,
    {
      method: 'GET',
      headers: { authorization: `Bearer ${token}` },
    }
  );
  const ans = await res.json();
  return ans.data.runNoOfTrips;
}

function setDate(time) {
  const date = new Date(time);
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  return date.toLocaleDateString('en-US', options);
}

function setImage(status) {
  switch (status) {
    case TRIP_STATUS.NEW_COMMENT:
      return <NewCommentIcon />;
    case TRIP_STATUS.NEW:
      return <NewRequestIcon />;
    case TRIP_STATUS.DATA_PROVIDED:
      return <DataProvidedIcon />;
    default:
      break;
  }
}

async function getNotificationList(setNotificationList, setNotificationCount) {
  const tripList = await getTripsForUser();
  const userId = JSON.parse(localStorage.getItem('data')).id;
  const notifications = [];
  if (tripList.length > 0) {
    tripList.forEach(async (trip) => {
      const dbQuery = query(
        collection(db, trip),
        where('receiverId', '==', userId),
        where('status', 'in', [
          TRIP_STATUS.NEW_COMMENT,
          TRIP_STATUS.DATA_PROVIDED,
          TRIP_STATUS.NEW,
        ])
      );
      onSnapshot(dbQuery, (snapshot) => {
        store.dispatch(setNotificationDot(true));
        const docList = snapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id, runNo: trip };
        });

        docList.forEach((doc) => {
          const existingIndex = notifications.findIndex(
            (item) => item.id === doc.id
          );

          if (existingIndex !== -1) {
            notifications[existingIndex] = doc;
          } else {
            notifications.push(doc);
          }
        });

        notifications.sort((a, b) => a.timestamp - b.timestamp);
        setNotificationList(notifications);
        setNotificationCount(notifications.length);
      });
    });
  }
}

async function userCTA(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(
    `${process.env.REACT_APP_URL}/api/billing-manager/users/activity-status/${id}`,
    {
      method: 'PATCH',
      headers: { authorization: `Bearer ${token}` },
    }
  );
  const ans = await res.json();
  return { res, ans };
}

async function sendNotification(fcmToken, message) {
  const notificationMessage = {
    to: fcmToken,
    notification: {
      title: TRIP_STATUS.NEW_COMMENT,
      body: message,
    },
    data: {},
  };
  await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `key=${process.env.REACT_APP_SERVER_KEY}`,
    },
    body: JSON.stringify(notificationMessage),
  });
}

export {
  getUsers,
  formateUserData,
  getRequests,
  changeRequestStatus,
  approveRequest,
  getImages,
  postRequireMoreInformation,
  postApproveWithExp,
  getPatientData,
  mapPatientData,
  mapFormDataToPatient,
  getTripsForUser,
  setDate,
  setImage,
  getNotificationList,
  getBarGraphData,
  userCTA,
  sendNotification,
};
