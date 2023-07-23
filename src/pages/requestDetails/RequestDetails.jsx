import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  setCurrentRunNo,
  setCurrentStatus,
  setCurrentAssignee,
} from '../../features/requestDetails/requestDetailsSlice';
import { setActiveKey } from '../../features/sidebar/sidebarSlice';
import {
  approveRequest,
  postRequireMoreInformation,
  postApproveWithExp,
  getPatientData,
  mapFormDataToPatient,
  changeRequestStatus,
} from '../../utils/getDataFunctions';
import messages from '../../utils/messages.json';
import { TRIP_STATUS } from '../../utils/constants';
import { Button, Layout, Menu, Steps, Form } from 'antd';
import { toast } from 'react-toastify';
import './requestDetails.css';
import {
  PreviewIcon,
  AuditTrailIcon,
  PatientIcon,
  DocIcon,
  CommentIcon,
  HealthInsuranceIcon,
  PCSIcon,
} from '../../components/icons/icons';
import { StyledMenu } from './StyledElements';
import DocViewerComponent from '../../components/docViewer/DocViewerComponent';
import InputModal from '../../components/inputModal/InputModal';
import AuditTrail from '../../components/auditTrail/AuditTrail';
import FormComponent from '../../components/Form/FormComponent';
import Comments from '../../components/comments/Comments';
const { Header, Sider, Content } = Layout;

function RequestDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = JSON.parse(localStorage.getItem('data'));
  const isAdmin = data.roleId === 2 ? true : false;
  const loggedInUser = data.id;
  // for state management
  const runNo = +window.location.pathname.substring(17);
  const search = window.location.search;
  const queries = search.split('&');
  const status = decodeURIComponent(queries[0].substring(8));
  const assignee = queries[1].substring(9);

  const setCurrentDetails = () => {
    dispatch(setCurrentRunNo(runNo));
    dispatch(setCurrentStatus(status));
    dispatch(setCurrentAssignee(assignee));
  };

  const setUrl = (paramsObj) => {
    const query = `?status=${paramsObj.status}&assignee=${paramsObj.assignee}`;
    window.history.pushState(null, '', query);
    dispatch(setCurrentStatus(paramsObj.status));
    dispatch(setCurrentAssignee(paramsObj.assignee));
  };

  useEffect(() => {
    async function getFormData() {
      try {
        const { res, ans } = await getPatientData(runNo);
        if (res.status === 200) {
          setFormData(ans.data);
          setUrl({ status: ans.data.status, assignee });
        } else {
          toast.error(ans.message);
        }
      } catch {
        toast.error(messages.GENERAL_ERROR);
      }
    }
    // to make sure the query parameters are saved in store;
    dispatch(setActiveKey('2'));
    getFormData();
    setCurrentDetails();
  }, []);

  // for status indicator
  const currentRunNo = useSelector(
    (state) => state.requestDetails.currentRunNo
  );
  const currentStatus = useSelector(
    (state) => state.requestDetails.currentStatus
  );
  const currentAssignee = useSelector(
    (state) => state.requestDetails.currentAssignee
  );

  // for form component
  const [patientForm] = Form.useForm();
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    mrn: '',
    patientGender: '',
    patientAddress: '',
    healthcareFacility: '',
    admissionType: '',
    attendingPhysician: '',
    thirdPartyPayer: '',
    subscriberName: '',
    insuranceAddress: '',
    insuranceContactNo: '',
    policyNo: '',
    insuranceGroupName: '',
    insuranceGroupNo: '',
    guarantorName: '',
    guarantorAddress: '',
    guarantorGender: '',
    relationship: '',
    guarantorWeight: '',
    guarantorHeight: '',
    diagnosis: '',
  });
  // for modal component
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('Request for More Information');
  const [action, setAction] = useState(2); //0 for request more info
  //1 for approve with exception;

  const handleRequestMoreInfo = async (values) => {
    try {
      const message = values;
      const { res, ans } = await postRequireMoreInformation(
        currentRunNo,
        message
      );
      if (res.status === 200) {
        setUrl({
          status: TRIP_STATUS.MORE_INFO,
          assignee: currentAssignee,
        });
        toast.success(ans.message);
      } else {
        toast.error(ans.message);
      }
      setOpen(false);
    } catch (e) {
      toast.error(messages.GENERAL_ERROR);
    }
  };

  const handleApproveWithException = async (values) => {
    try {
      await patientForm.validateFields();
      const patientData = patientForm.getFieldsValue();
      const mappedPatientData = mapFormDataToPatient(patientData);
      mappedPatientData.id = formData.id;
      const message = values;
      const { res, ans } = await postApproveWithExp(
        currentRunNo,
        message,
        mappedPatientData
      );
      if (res.status === 200) {
        setUrl({
          status: TRIP_STATUS.EXCEPTION,
          assignee: currentAssignee,
        });
        toast.success(ans.message);
      } else {
        toast.error(ans.message);
      }
      setOpen(false);
    } catch (error) {
      if (error.errorFields) {
        toast.error(messages.FILL_REQUIRED_FIELDS);
      } else {
        toast.error(messages.GENERAL_ERROR);
      }
    }
  };

  // for enabling/disabling approve,request with more button
  const isMyRequest = loggedInUser === currentAssignee ? true : false;
  let isValidState;
  if (
    currentStatus === TRIP_STATUS.REVIEW ||
    currentStatus === TRIP_STATUS.DATA_PROVIDED
  ) {
    isValidState = true;
  } else {
    isValidState = false;
  }

  let makeBtnDisable;
  if (isValidState && isAdmin && isMyRequest) {
    makeBtnDisable = false;
  } else {
    makeBtnDisable = true;
  }
  // for approve with exception
  const checkCondition = () => {
    if (
      isAdmin &&
      (currentStatus === TRIP_STATUS.REVIEW ||
        currentStatus === TRIP_STATUS.MORE_INFO ||
        currentStatus === TRIP_STATUS.DATA_PROVIDED)
    ) {
      return false;
    } else {
      return true;
    }
  };
  const disableApproveExp = checkCondition();
  // for assign to me button
  let makeAssignDisable = true;
  if (isAdmin && currentStatus === TRIP_STATUS.NEW) {
    makeAssignDisable = false;
  }
  // for status indicator
  let currentKey = 0;
  switch (currentStatus) {
    case TRIP_STATUS.NEW:
      currentKey = 0;
      break;
    case TRIP_STATUS.REVIEW:
      currentKey = 1;
      break;
    case TRIP_STATUS.MORE_INFO:
      currentKey = 2;
      break;
    case TRIP_STATUS.DATA_PROVIDED:
      currentKey = 3;
      break;
    case TRIP_STATUS.APPROVED:
      currentKey = 4;
      break;
    case TRIP_STATUS.EXCEPTION:
      currentKey = 4;
      break;
  }
  // for right menu of image-viewer and audit trail
  const [rightMenu, setRightMenu] = useState(1);
  const handleDocMenuClick = (e) => {
    setRightMenu(Number(e.key));
  };

  // for form menu of chat
  const [formMenu, setFormMenu] = useState(2);
  const patientDetails = document.getElementById('patient-details');
  const insuranceDetails = document.getElementById('insurance-details');
  const guarantorDetails = document.getElementById('guarantor-details');
  const pcsDetails = document.getElementById('pcs-details');

  const handleFormMenuClick = (e) => {
    setFormMenu(Number(e.key));
    if (e.key === '2') {
      patientDetails?.scrollIntoView({ block: 'start' });
    } else if (e.key === '3') {
      insuranceDetails?.scrollIntoView({ block: 'start' });
    } else if (e.key === '4') {
      guarantorDetails?.scrollIntoView({ block: 'start' });
    } else if (e.key === '5') {
      pcsDetails?.scrollIntoView({ block: 'start' });
    }
  };
  const scrollableForm = document.getElementById('info-form');
  const handleScroll = () => {
    if (
      scrollableForm.scrollTop >= 0 &&
      scrollableForm.scrollTop <= scrollableForm.offsetHeight / 3
    ) {
      setFormMenu(2);
    } else if (
      insuranceDetails.offsetTop - scrollableForm.scrollTop <
        scrollableForm.offsetHeight / 2 &&
      scrollableForm.scrollTop <= 620
    ) {
      setFormMenu(3);
    } else if (
      scrollableForm.scrollTop >= 621 &&
      scrollableForm.scrollTop <= 1008
    ) {
      setFormMenu(4);
    } else if (scrollableForm.scrollTop >= 1008) {
      setFormMenu(5);
    }
  };
  // for approve request
  const handleApprove = async () => {
    try {
      await patientForm.validateFields();
      const patientData = await patientForm.getFieldsValue();
      const mappedPatientData = mapFormDataToPatient(patientData);
      mappedPatientData.id = formData.id;
      const { res, ans } = await approveRequest(
        currentRunNo,
        mappedPatientData
      );
      if (res.status === 200) {
        setUrl({
          status: TRIP_STATUS.APPROVED,
          assignee: currentAssignee,
        });
        toast.success(ans.message);
      } else {
        toast.error(ans.message);
      }
    } catch (error) {
      if (error.errorFields) {
        toast.error(messages.FILL_REQUIRED_FIELDS);
      } else {
        toast.error(messages.GENERAL_ERROR);
      }
    }
  };

  const handleAssign = async () => {
    try {
      const { res, ans } = await changeRequestStatus(currentRunNo);
      if (res.status === 200) {
        toast.success(ans.message);
        setUrl({
          status: TRIP_STATUS.REVIEW,
          assignee: loggedInUser,
        });
      } else {
        toast.error(ans.message);
      }
    } catch (error) {
      toast.error(messages.GENERAL_ERROR);
    }
  };
  let backURl;
  switch (currentStatus) {
    case TRIP_STATUS.NEW:
      backURl = '/trip-requests?key=1&status=all&page=1&myRequest=false';
      break;
    case TRIP_STATUS.REVIEW:
      backURl = '/trip-requests?key=2&status=all&page=1&myRequest=false';
      break;
    case TRIP_STATUS.MORE_INFO:
      backURl = '/trip-requests?key=2&status=all&page=1&myRequest=false';
      break;
    case TRIP_STATUS.DATA_PROVIDED:
      backURl = '/trip-requests?key=2&status=all&page=1&myRequest=false';
      break;
    case TRIP_STATUS.APPROVED:
      backURl = '/trip-requests?key=3&status=all&page=1&myRequest=false';
      break;
    case TRIP_STATUS.EXCEPTION:
      backURl = '/trip-requests?key=3&status=all&page=1&myRequest=false';
      break;
    default:
      break;
  }

  const handleBackButton = () => {
    navigate(backURl);
  };
  const statusList = [
    {
      title: TRIP_STATUS.NEW,
    },
    {
      title: TRIP_STATUS.REVIEW,
    },
    {
      title: TRIP_STATUS.MORE_INFO,
    },
    {
      title: TRIP_STATUS.DATA_PROVIDED,
    },
    {
      title: TRIP_STATUS.APPROVED,
    },
  ];
  return (
    <div className="details-container" data-testid="mainContainer">
      <div className="request-status">
        <div className="backButton">
          <Button
            data-testid="backBtn"
            type="text"
            className="backBtn"
            size={'large'}
            onClick={handleBackButton}
          >
            &lt; Back
          </Button>
        </div>
        {/* function to map the status of request from the API to the index of the steps, then set the current value according to the mapper function */}
        <div className="statusIndicator">
          <Steps
            data-testid="statusIndicator"
            progressDot
            current={currentKey}
            items={statusList}
          />
        </div>
        <div className="runNum">
          Run no: <span className="num">{currentRunNo}</span>
        </div>
      </div>
      <div className="main-container">
        <div className="docViewer-container details-item">
          <Layout className="layout-container" data-testid="layout">
            <Header style={{ height: '3rem' }} className="component-header">
              {rightMenu === 2 ? <>Audit Trail</> : <>Preview</>}
            </Header>
            <Layout>
              <Sider className="component-sidebar" collapsed={true}>
                <StyledMenu>
                  <Menu
                    data-testid="rightMenu"
                    theme="light"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    onClick={handleDocMenuClick}
                    items={[
                      {
                        key: '1',
                        icon: <PreviewIcon />,
                        label: 'Preview',
                      },
                      {
                        key: '2',
                        icon: <AuditTrailIcon />,
                        label: 'Audit Trail',
                      },
                    ]}
                  />
                </StyledMenu>
              </Sider>
              <Content style={{ padding: '0' }}>
                {rightMenu === 2 ? (
                  <AuditTrail data-testid="auditTrailSection" />
                ) : (
                  <div className="docViewer">
                    <DocViewerComponent />
                  </div>
                )}
              </Content>
            </Layout>
          </Layout>
        </div>
        <div className="information-container details-item">
          <Layout className="layout-container">
            <Header
              style={{ height: '3rem' }}
              data-testid="info-header"
              className="component-header"
            >
              {formMenu === 1 ? <>Comments</> : <>Information</>}
            </Header>
            <Layout>
              <Sider className="component-sidebar" collapsed={true}>
                <StyledMenu>
                  <Menu
                    theme="light"
                    mode="inline"
                    defaultSelectedKeys={['2']}
                    selectedKeys={[String(formMenu)]}
                    onClick={handleFormMenuClick}
                    items={[
                      {
                        key: '1',
                        icon: <CommentIcon />,
                        label: 'Chat',
                      },
                      {
                        key: '2',
                        icon: <PatientIcon />,
                        label: 'Patient Details',
                      },
                      {
                        key: '3',
                        icon: <HealthInsuranceIcon />,
                        label: 'Insurance Details',
                      },
                      {
                        key: '4',
                        icon: <DocIcon />,
                        label: 'Guarantor Details',
                      },
                      {
                        key: '5',
                        icon: <PCSIcon />,
                        label: 'PCS Details',
                      },
                    ]}
                  />
                </StyledMenu>
              </Sider>
              <Content style={{ padding: '0' }}>
                <div className="information">
                  <div
                    className={formMenu === 1 ? 'comment show' : 'comment hide'}
                  >
                    {formMenu === 1 && <Comments />}
                  </div>
                  <div
                    id="info-form"
                    data-testid="information-form"
                    className={
                      formMenu === 1
                        ? 'information-form hide'
                        : 'information-form show'
                    }
                    onScroll={handleScroll}
                  >
                    <FormComponent
                      patientForm={patientForm}
                      formData={formData}
                    />
                  </div>
                  <div className="buttons-panel">
                    <div className="buttonGroup1">
                      <Button
                        type="primary"
                        className="btn"
                        data-testid="assigntoMeBtn"
                        disabled={makeAssignDisable}
                        onClick={handleAssign}
                      >
                        Assign to me
                      </Button>
                      <Button
                        type="default"
                        className="btn"
                        data-testid="reqMoreInfo"
                        disabled={makeBtnDisable}
                        onClick={() => {
                          setTitle('Request more information');
                          setAction(0);
                          setOpen(true);
                        }}
                      >
                        Request More Information
                      </Button>
                    </div>
                    <div className="buttonGroup2">
                      <Button
                        type="default"
                        className="btn"
                        data-testid="approveWithException"
                        disabled={disableApproveExp}
                        onClick={() => {
                          setTitle('Approve with exception');
                          setAction(1);
                          setOpen(true);
                        }}
                      >
                        Approve with Exception
                      </Button>
                      <Button
                        type="primary"
                        className="btn"
                        data-testid="approveBtn"
                        disabled={makeBtnDisable}
                        onClick={handleApprove}
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                </div>
              </Content>
            </Layout>
          </Layout>
        </div>
      </div>
      <InputModal
        open={open}
        title={title}
        onSubmitMessage={
          action === 0 ? handleRequestMoreInfo : handleApproveWithException
        }
        onCancel={() => {
          setOpen(false);
        }}
      />
    </div>
  );
}

export default RequestDetails;
