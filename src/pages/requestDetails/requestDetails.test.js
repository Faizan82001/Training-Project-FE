import {
  fireEvent,
  render,
  screen,
  waitFor,
  act,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  setCurrentRunNo,
  setCurrentStatus,
  setCurrentAssignee,
} from '../../features/requestDetails/requestDetailsSlice';
import { store } from '../../app/store';
import { Provider } from 'react-redux';
import {
  approveRequest,
  postApproveWithExp,
  postRequireMoreInformation,
  changeRequestStatus,
} from '../../utils/getDataFunctions';
import { toast } from 'react-toastify';
import RequestDetails from './RequestDetails';
import { TRIP_STATUS } from '../../utils/constants';

const mockedUsedNavigate = jest.fn();

jest.mock('firebase/messaging', () => ({
  getMessaging: jest.fn(),
  onMessage: jest.fn(() => Promise.resolve()),
  getToken: jest.fn(() => Promise.resolve('1234')),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('Rendering', () => {
  test('should render the main div', () => {
    delete window.location;
    window.location = {
      pathname: '/request-details/1234',
      search: '?status=Data%20Provided&assignee=123',
    };
    //window.location.search = '?status=Assigned%20for%20Review&assignee=123';
    localStorage.setItem('data', '{"roleId":2}');
    store.dispatch(setCurrentRunNo(1234));
    store.dispatch(setCurrentStatus(TRIP_STATUS.DATA_PROVIDED));
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RequestDetails />
        </MemoryRouter>
      </Provider>
    );

    const mainContainer = screen.getByTestId('mainContainer');
    const layout = screen.getByTestId('layout');
    expect(layout).toBeInTheDocument();
    expect(mainContainer).toBeInTheDocument();
  });
});

describe('Right Menu', () => {
  test('should render the right menu', async () => {
    delete window.location;
    window.location = {
      pathname: '/request-details/1234',
      search: '?status=Approved&assignee=123',
    };
    localStorage.setItem('data', '{"roleId":2}');
    store.dispatch(setCurrentRunNo(1234));
    store.dispatch(setCurrentStatus(TRIP_STATUS.APPROVED));
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RequestDetails />
        </MemoryRouter>
      </Provider>
    );

    const rightMenuBar = screen.getByTestId('rightMenu');
    expect(rightMenuBar).toBeInTheDocument();

    const auditMenuItem = screen.getByTestId('auditTrail');
    const previewMenuItem = screen.getByTestId('previewIcon');
    expect(previewMenuItem).toBeInTheDocument();
    expect(auditMenuItem).toBeInTheDocument();

    expect(fireEvent.click(previewMenuItem)).toBeTruthy();
    expect(fireEvent.click(auditMenuItem)).toBeTruthy();
  });
});

describe('document viewer buttons', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            data: {
              runNo: 333,
              faceSheet:
                'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format',
              pcs: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format',
              aob: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format',
              other1:
                'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format',
              other2:
                'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format',
              other3:
                'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format',
              other4:
                'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format',
              createdAt: '2023-05-09T07:59:12.898Z',
              updatedAt: '2023-05-09T07:59:12.898Z',
              'trip_data.status': TRIP_STATUS.NEW,
              status: TRIP_STATUS.NEW,
            },
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });
  test('should run onclick action of document viewer buttons', async () => {
    delete window.location;
    window.location = {
      pathname: '/request-details/1234',
      search: '?status=New%20Request&assignee=null',
    };
    localStorage.setItem('data', '{"roleId":2}');
    store.dispatch(setCurrentRunNo(333));
    store.dispatch(setCurrentStatus(TRIP_STATUS.NEW));
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RequestDetails />
        </MemoryRouter>
      </Provider>
    );
    const imgBtn0 = screen.getByTestId('imgBtn0');
    expect(imgBtn0).toBeInTheDocument();
    expect(fireEvent.click(imgBtn0)).toBeTruthy();
  });

  test('to click back button', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RequestDetails />
        </MemoryRouter>
      </Provider>
    );
    fireEvent.click(await screen.findByTestId('backBtn'));
    expect(mockedUsedNavigate).toHaveBeenCalled();
  });
});

describe('for approve button', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            message: 'request approved successfully',
            data: {
              name: 'alex',
              mrn: '1234',
              dob: '2023-05-19T08:38:03.704Z',
              patientGender: 'male',
              patientAddress: '',
              healthcareFacility: '',
              admissionDate: '',
              admissionType: '',
              attendingPhysician: '',
              diagnostics: '',
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
              pickupLocation: 'xyz',
              pickupDateTime: '2023-05-19T08:38:03.704Z',
              requestedBy: '',
              contactNumber: '',
              pickupLocationunitRoom: '',
              sendingMD: '',
              destinationAddress: 'abc',
              destinationUnitRoom: '',
              acceptingMD: '',
              appointmentDateTime: '',
              id:'fb2e3e70-439f-483b-ad91-258fe03a95da'
            },
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });
  test('approve button should render', async () => {
    delete window.location;
    window.location = {
      pathname: '/request-details/1234',
      search: '?status=Assigned%20for%20Review&assignee=123',
    };
    localStorage.setItem('data', '{"roleId":2,"id":"123"}');
    store.dispatch(setCurrentRunNo(1234));
    store.dispatch(setCurrentStatus(TRIP_STATUS.REVIEW));
    store.dispatch(setCurrentAssignee('123'));
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RequestDetails />
        </MemoryRouter>
      </Provider>
    );

    const approveBtn = screen.getByTestId('approveBtn');
    const mappedPatientData = {
      name: 'alex',
      mrn: '123',
      dob: '2023-05-19T08:38:03.704Z',
      patientGender: 'male',
    };
    expect(approveBtn).toBeInTheDocument();
    fireEvent.click(approveBtn);
    const { res, ans } = await approveRequest(1234, mappedPatientData);
    expect(res.status).toBe(200);
  });
  test('for manager user', async () => {
    delete window.location;
    window.location = {
      pathname: '/request-details/1234',
      search: '?status=Approved%20with%20Exception&assignee=123',
    };
    store.dispatch(setCurrentRunNo(1234));
    store.dispatch(setCurrentStatus(TRIP_STATUS.EXCEPTION));
    localStorage.setItem('data', '{"roleId":1}');
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RequestDetails />
        </MemoryRouter>
      </Provider>
    );

    const approveBtn = screen.getByTestId('approveBtn');

    expect(approveBtn).toBeInTheDocument();
  });
});

describe('for error in api', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 500,
        json: () =>
          Promise.resolve({
            message: 'bad request',
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });
  test('approve event with failure', async () => {
    delete window.location;
    window.location = {
      pathname: '/request-details/1234',
      search: '?status=Assigned%20for%20Review&assignee=123',
    };
    localStorage.setItem('data', '{"roleId":2}');
    store.dispatch(setCurrentRunNo(1234));
    store.dispatch(setCurrentStatus(TRIP_STATUS.REVIEW));
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RequestDetails />
        </MemoryRouter>
      </Provider>
    );

    const approveBtn = screen.getByTestId('approveBtn');

    expect(approveBtn).toBeInTheDocument();
    fireEvent.click(approveBtn);
    const { res, ans } = await approveRequest(1234);
    const state = store.getState();
    expect(state.requestDetails.currentStatus).not.toBe('Approved');
    expect(res.status).toBe(500);
  });
});

describe('for request for information', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            message: 'ok',
            data: {
              name: 'alex',
              mrn: '123',
              dob: '',
              patientGender: 'male',
              patientAddress: '',
              healthcareFacility: '',
              admissionDate: '',
              admissionType: '',
              attendingPhysician: '',
              diagnostics: '',
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
              pickupLocation: 'xyz',
              pickupDateTime: '2023-05-19T08:38:03.704Z',
              requestedBy: '',
              contactNumber: '',
              pickupLocationunitRoom: '',
              sendingMD: '',
              destinationAddress: 'abc',
              destinationUnitRoom: '',
              acceptingMD: '',
              appointmentDateTime: '',
              id:'fb2e3e70-439f-483b-ad91-258fe03a95da',
            },
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  test('request more info button click', async () => {
    delete window.location;
    window.location = {
      pathname: '/request-details/1234',
      search: '?status=Assigned%20for%20Review&assignee=123',
    };
    localStorage.setItem('data', '{"roleId":2,"id":"123"}');
    store.dispatch(setCurrentRunNo(1234));
    store.dispatch(setCurrentStatus(TRIP_STATUS.REVIEW));
    store.dispatch(setCurrentAssignee('123'));
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RequestDetails />
        </MemoryRouter>
      </Provider>
    );

    const reqMoreInfoBtn = screen.getByTestId('reqMoreInfo');
    expect(reqMoreInfoBtn).toBeInTheDocument();

    fireEvent.click(reqMoreInfoBtn);
    const modalSubmit = await screen.findByText('Submit');
    expect(modalSubmit).toBeInTheDocument();

    const modalText = await screen.findByTestId('modalText');
    expect(modalText).toBeInTheDocument();

    fireEvent.change(modalText, {
      target: { value: 'give more details on MRN no' },
    });
    expect(fireEvent.click(modalSubmit)).toBeTruthy();

    const { ans, res } = await postRequireMoreInformation(
      1234,
      modalText.value
    );
    expect(res.status).toBe(200);
  });

  test('request more info button click but not filling details, cancle the modal', async () => {
    delete window.location;
    window.location = {
      pathname: '/request-details/1234',
      search: '?status=Assigned%20for%20Review&assignee=123',
    };
    localStorage.setItem('data', '{"roleId":2,"id":"123"}');
    store.dispatch(setCurrentRunNo(1234));
    store.dispatch(setCurrentStatus(TRIP_STATUS.REVIEW));
    store.dispatch(setCurrentAssignee('123'));
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RequestDetails />
        </MemoryRouter>
      </Provider>
    );

    const reqMoreInfoBtn = screen.getByTestId('reqMoreInfo');
    expect(reqMoreInfoBtn).toBeInTheDocument();

    fireEvent.click(reqMoreInfoBtn);
    const modalCancel = await screen.findByText('Cancel');
    expect(modalCancel).toBeInTheDocument();

    expect(fireEvent.click(modalCancel)).toBeTruthy();
  });
});

describe('for request for information with failed response', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    toast.error = jest
      .fn()
      .mockImplementation((f) => typeof f === 'function' && f());
    global.fetch = () =>
      Promise.resolve({
        status: 400,
        json: () =>
          Promise.resolve({
            message: 'Invalid request',
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  test('request more info button click', async () => {
    delete window.location;
    window.location = {
      pathname: '/request-details/1234',
      search: '?status=Assigned%20for%20Review&assignee=123',
    };
    localStorage.setItem('data', '{"roleId":2,"id":"123"}');
    store.dispatch(setCurrentRunNo(1234));
    store.dispatch(setCurrentStatus(TRIP_STATUS.REVIEW));
    store.dispatch(setCurrentAssignee('123'));
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RequestDetails />
        </MemoryRouter>
      </Provider>
    );

    const reqMoreInfoBtn = screen.getByTestId('reqMoreInfo');
    expect(reqMoreInfoBtn).toBeInTheDocument();

    fireEvent.click(reqMoreInfoBtn);
    const modalSubmit = await screen.findByText('Submit');
    expect(modalSubmit).toBeInTheDocument();

    const modalText = await screen.findByTestId('modalText');
    expect(modalText).toBeInTheDocument();

    fireEvent.change(modalText, {
      target: { value: 'give more details on MRN no' },
    });
    expect(fireEvent.click(modalSubmit)).toBeTruthy();

    const { ans, res } = await postRequireMoreInformation(
      1234,
      modalText.value
    );
    expect(res.status).toBe(400);
    expect(toast.error).toHaveBeenCalled();
  });
});

describe('for successful approve with exception', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            message: 'ok',
            data: {
              name: 'alex',
              mrn: '123',
              dob: '2023-05-19T08:38:03.704Z',
              patientGender: 'male',
              patientAddress: '',
              healthcareFacility: '',
              admissionDate: '',
              admissionType: '',
              attendingPhysician: '',
              diagnostics: '',
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
              pickupLocation: 'xyz',
              pickupDateTime: '2023-05-19T08:38:03.704Z',
              requestedBy: '',
              contactNumber: '',
              pickupLocationunitRoom: '',
              sendingMD: '',
              destinationAddress: 'abc',
              destinationUnitRoom: '',
              acceptingMD: '',
              appointmentDateTime: '',
              id:'fb2e3e70-439f-483b-ad91-258fe03a95da'
            },
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  test('approve with exception button click', async () => {
    delete window.location;
    window.location = {
      pathname: '/request-details/1234',
      search: '?status=Assigned%20for%20Review&assignee=123',
    };
    localStorage.setItem('data', '{"roleId":2,"id":"123"}');
    store.dispatch(setCurrentRunNo(1234));
    store.dispatch(setCurrentStatus(TRIP_STATUS.REVIEW));
    store.dispatch(setCurrentAssignee('123'));
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RequestDetails />
        </MemoryRouter>
      </Provider>
    );

    const approveWithExpBtn = screen.getByTestId('approveWithException');
    expect(approveWithExpBtn).toBeInTheDocument();

    fireEvent.click(approveWithExpBtn);
    const modalSubmit = await screen.findByText('Submit');
    expect(modalSubmit).toBeInTheDocument();

    const modalText = await screen.findByTestId('modalText');
    expect(modalText).toBeInTheDocument();

    fireEvent.change(modalText, {
      target: { value: 'approved with exception due to form filled already' },
    });
    expect(fireEvent.click(modalSubmit)).toBeTruthy();

    const { ans, res } = await postApproveWithExp(1234, modalText.value);
    expect(res.status).toBe(200);
  });
});

describe('for approve with exception, failed response', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    toast.error = jest
      .fn()
      .mockImplementation((f) => typeof f === 'function' && f());
    global.fetch = () =>
      Promise.resolve({
        status: 400,
        json: () =>
          Promise.resolve({
            message: 'Invalid request',
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  test('approve with exception button click', async () => {
    delete window.location;
    window.location = {
      pathname: '/request-details/1234',
      search: '?status=Assigned%20for%20Review&assignee=123',
    };
    localStorage.setItem('data', '{"roleId":2,"id":"123"}');
    store.dispatch(setCurrentRunNo(1234));
    store.dispatch(setCurrentStatus(TRIP_STATUS.REVIEW));
    store.dispatch(setCurrentAssignee('123'));
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RequestDetails />
        </MemoryRouter>
      </Provider>
    );

    const approveWithExpBtn = screen.getByTestId('approveWithException');
    expect(approveWithExpBtn).toBeInTheDocument();

    fireEvent.click(approveWithExpBtn);
    const modalSubmit = await screen.findByText('Submit');
    expect(modalSubmit).toBeInTheDocument();

    const modalText = await screen.findByTestId('modalText');
    expect(modalText).toBeInTheDocument();

    fireEvent.change(modalText, {
      target: { value: 'approved with exception due to form filled already' },
    });
    expect(fireEvent.click(modalSubmit)).toBeTruthy();

    const { ans, res } = await postApproveWithExp(1234, modalText.value);
    expect(res.status).toBe(400);
    expect(toast.error).toHaveBeenCalled();
  });
});

describe('form rendering and integration with patient data api', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            message: 'ok',
            data: {
              name: 'alex1',
              mrn: '123',
              dob: '2002-05-17T12:00:00.000Z',
              patientGender: 'male',
              patientAddress: '',
              healthcareFacility: '',
              admissionDate: '',
              admissionType: '',
              attendingPhysician: '',
              diagnostics: '',
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
              pickupLocation: 'xyz',
              pickupDateTime: '2023-05-19T08:38:03.704Z',
              requestedBy: '',
              contactNumber: '',
              pickupLocationunitRoom: '',
              sendingMD: '',
              destinationAddress: 'abc',
              destinationUnitRoom: '',
              acceptingMD: '',
              appointmentDateTime: '',
              id:'fb2e3e70-439f-483b-ad91-258fe03a95da'
            },
          }),
      });
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  test('clicking on comment icon', async () => {
    delete window.location;
    window.location = {
      pathname: '/request-details/1234',
      search: '?status=Assigned%20for%20Review&assignee=123',
    };
    localStorage.setItem('data', '{"roleId":2,"id":"123"}');
    store.dispatch(setCurrentRunNo(1234));
    store.dispatch(setCurrentStatus(TRIP_STATUS.REVIEW));
    store.dispatch(setCurrentAssignee('123'));
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RequestDetails />
        </MemoryRouter>
      </Provider>
    );

    const commentMenuItem = screen.getByTestId('commentIcon');
    expect(commentMenuItem).toBeInTheDocument();
    expect(fireEvent.click(commentMenuItem)).toBeTruthy();
  });
  test('clicking on patient icon', async () => {
    delete window.location;
    window.location = {
      pathname: '/request-details/1234',
      search: '?status=Assigned%20for%20Review&assignee=123',
    };
    localStorage.setItem('data', '{"roleId":2,"id":"123"}');
    store.dispatch(setCurrentRunNo(1234));
    store.dispatch(setCurrentStatus(TRIP_STATUS.REVIEW));
    store.dispatch(setCurrentAssignee('123'));
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RequestDetails />
        </MemoryRouter>
      </Provider>
    );

    const insuranceMenuItem = screen.getByTestId('healthInsuranceIcon');
    expect(insuranceMenuItem).toBeInTheDocument();
    expect(fireEvent.click(insuranceMenuItem)).toBeTruthy();
  });

  test('clicking on guarantor icon', async () => {
    delete window.location;
    window.location = {
      pathname: '/request-details/1234',
      search: '?status=Assigned%20for%20Review&assignee=123',
    };
    localStorage.setItem('data', '{"roleId":2,"id":"123"}');
    store.dispatch(setCurrentRunNo(1234));
    store.dispatch(setCurrentStatus(TRIP_STATUS.REVIEW));
    store.dispatch(setCurrentAssignee('123'));
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RequestDetails />
        </MemoryRouter>
      </Provider>
    );

    const guarantorMenuItem = screen.getByTestId('guarantorIcon');
    expect(guarantorMenuItem).toBeInTheDocument();
    expect(fireEvent.click(guarantorMenuItem)).toBeTruthy();
  });
});

describe('for assign to me button in request details page', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            message: 'request assigned successfully',
            data: {
              name: 'alex',
              mrn: '1234',
              dob: '2023-05-19T08:38:03.704Z',
              patientGender: 'male',
              patientAddress: '',
              healthcareFacility: '',
              admissionDate: '',
              admissionType: '',
              attendingPhysician: '',
              diagnostics: '',
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
              id: 'fb2e3e70-439f-483b-ad91-258fe03a95da',
            },
          }),
      });
});

  afterEach(() => {
    global.fetch = unmockedFetch;
  });
  test('assign button should render', async () => {
    delete window.location;
    window.location = {
      pathname: '/request-details/1234',
      search: '?status=New%20Request&assignee=null',
    };
    localStorage.setItem('data', '{"roleId":2,"id":"123"}');
    store.dispatch(setCurrentRunNo(1234));
    store.dispatch(setCurrentStatus(TRIP_STATUS.NEW));
    store.dispatch(setCurrentAssignee('null'));
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RequestDetails />
        </MemoryRouter>
      </Provider>
    );

    const assignBtn = screen.getByTestId('assigntoMeBtn');
    expect(assignBtn).toBeInTheDocument();
    expect(fireEvent.click(assignBtn)).toBeTruthy();
  });

  test('clicking on pcs icon', async () => {
    delete window.location;
    window.location = {
      pathname: '/request-details/1234',
      search: '?status=Assigned%20for%20Review&assignee=123',
    };
    localStorage.setItem('data', '{"roleId":2,"id":"123"}');
    store.dispatch(setCurrentRunNo(1234));
    store.dispatch(setCurrentStatus(TRIP_STATUS.REVIEW));
    store.dispatch(setCurrentAssignee('123'));
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RequestDetails />
        </MemoryRouter>
      </Provider>
    );

    const guarantorMenuItem = screen.getByTestId('pcsIcon');
    expect(guarantorMenuItem).toBeInTheDocument();
    expect(fireEvent.click(guarantorMenuItem)).toBeTruthy();
  });
});

describe('for assign to me button with error in response', () => {
  const unmockedFetch = global.fetch;

  beforeEach(() => {
    toast.error = jest
      .fn()
      .mockImplementation((f) => typeof f === 'function' && f());
    global.fetch = () =>Promise.resolve({
      status: 403,
      json: () =>
        Promise.resolve({
          message: 'invalid request',
          data: {
            name: 'alex',
            mrn: '1234',
            dob: '2023-05-19T08:38:03.704Z',
            patientGender: 'male',
            patientAddress: '',
            healthcareFacility: '',
            admissionDate: '',
            admissionType: '',
            attendingPhysician: '',
            diagnostics: '',
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
            id: 'fb2e3e70-439f-483b-ad91-258fe03a95da',
          },
        }),
    });
      
  });

  afterEach(() => {
    global.fetch = unmockedFetch;
  });
  test('assign button clicked with promise rejected', async () => {
    delete window.location;
    window.location = {
      pathname: '/request-details/1234',
      search: '?status=New%20Request&assignee=null',
    };
    localStorage.setItem('data', '{"roleId":2,"id":"123"}');
    store.dispatch(setCurrentRunNo(1234));
    store.dispatch(setCurrentStatus(TRIP_STATUS.NEW));
    store.dispatch(setCurrentAssignee('null'));
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RequestDetails />
        </MemoryRouter>
      </Provider>
    );

    const assignBtn = screen.getByTestId('assigntoMeBtn');
    expect(assignBtn).toBeInTheDocument();
    expect(fireEvent.click(assignBtn)).toBeTruthy();
  });
});