const TRIP_STATUS = {
  NEW: 'New Request',
  REVIEW: 'Assigned for Review',
  MORE_INFO: 'Request more Information',
  DATA_PROVIDED: 'Data Provided',
  APPROVED: 'Approved',
  EXCEPTION: 'Approved with Exception',
  NEW_COMMENT: 'New Comment',
};

const COMMON_REGEX = {
  EMAIL:
    /^[A-Za-z0-9](\.?[A-Za-z0-9_-]){0,}@[A-Za-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/,
};

const REGEX_FACESHEET = {
  NAME: /^[a-zA-Z '.]+$/,
  GENDER: /^(male|female|other)$/i,
  DATE: /^(0[1-9]|[1-2][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
  PHONE_NO:
    /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
};

const REGEX_PCS = {
  PHONE_NO: /^(?:\d{3}[-. ])?\d{3}[-. ]\d{4}$|^\d{7}$|^\d{10}$/,
};
export { TRIP_STATUS, REGEX_FACESHEET, REGEX_PCS, COMMON_REGEX };
