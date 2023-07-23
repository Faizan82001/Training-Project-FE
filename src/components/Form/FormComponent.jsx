import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, InputNumber, DatePicker, Select, Row, Col } from 'antd';
import { mapPatientData } from '../../utils/getDataFunctions';
import { TRIP_STATUS, REGEX_FACESHEET, REGEX_PCS } from '../../utils/constants';
import { useSelector } from 'react-redux';
import messages from '../../utils/messages.json';
function FormComponent({ patientForm, formData }) {
  useEffect(() => {
    const mappedValues = mapPatientData(formData);
    patientForm.setFieldsValue(mappedValues);
  }, [formData]);
  const handleValuesChange = (changedValues) => {
    patientForm.setFieldValue(changedValues);
  };
  const data = JSON.parse(localStorage.getItem('data'));
  const isManager = data.roleId === 1;
  const currentStatus = useSelector(
    (state) => state.requestDetails.currentStatus
  );
  let inValidState = false;
  if (
    currentStatus !== TRIP_STATUS.REVIEW &&
    currentStatus !== TRIP_STATUS.MORE_INFO &&
    currentStatus !== TRIP_STATUS.DATA_PROVIDED
  ) {
    inValidState = true;
  }

  const currentAssignee = useSelector(
    (state) => state.requestDetails.currentAssignee
  );

  let isDifferentAdmin = true;

  if (currentAssignee === data.id) {
    isDifferentAdmin = false;
  }

  const makeDisable = isDifferentAdmin || isManager || inValidState;
  return (
    <>
      <Form
        className="form-columns"
        data-testid="information-form-component"
        name="information-form"
        layout="vertical"
        form={patientForm}
        disabled={makeDisable}
        onValuesChange={handleValuesChange}
        labelCol={{
          span: 16,
        }}
        wrapperCol={{
          span: 22,
        }}
        style={{
          maxWidth: '100%',
        }}
        initialValues={{ remember: true }}
        autoComplete="off"
      >
        <div id="patient-details-div">
          <Row
            gutter={[16, 40]}
            data-testid="patient-details"
            id="patient-details"
          >
            <Col span={12}>
              <Form.Item
                className="inputLabel"
                label="Patient Name"
                name="patientName"
                rules={[
                  {
                    required: true,
                    message: messages.PATIENT_NAME_NOT_GIVEN,
                  },
                  {
                    pattern: REGEX_FACESHEET.NAME,
                    message: messages.NAME_INVALID,
                  },
                ]}
              >
                <Input className="inputItem" data-testid="patient-name-input" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                className="inputLabel"
                label="MRN"
                name="MRN"
                rules={[
                  {
                    required: true,
                    message: messages.MRN_NO_NOT_GIVEN,
                  },
                ]}
              >
                <Input className="inputItem" data-testid="mrn-input" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 40]}>
            <Col span={12}>
              <Form.Item
                className="inputLabel"
                label="DOB"
                name="dob"
                rules={[
                  {
                    required: true,
                    message: messages.DOB_NOT_GIVEN,
                  },
                ]}
              >
                <DatePicker
                  format={'YYYY-MM-DD'}
                  className="inputItem"
                  data-testid="dob-input"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                className="inputLabel"
                label="Gender"
                name="gender"
                rules={[
                  {
                    required: true,
                    message: messages.GENDER_NOT_GIVEN,
                  },
                ]}
              >
                <Select
                  className="inputItem"
                  data-testid="gender-input"
                  options={[
                    {
                      value: 'male',
                      label: 'Male',
                    },
                    {
                      value: 'female',
                      label: 'Female',
                    },
                    {
                      value: 'other',
                      label: 'Other',
                    },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 40]}>
            <Col span={12}>
              <Form.Item
                className="inputLabel"
                label="Residence"
                name="residence"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Input.TextArea
                  maxLength={500}
                  style={{ resize: 'none' }}
                  className="inputItem inputItem-TextArea"
                />
              </Form.Item>
            </Col>
            <Col
              span={12}
              data-testid="insurance-details"
              id="insurance-details"
            >
              <Form.Item
                className="inputLabel"
                label="Healthcare Facility"
                name="healthcareFacility"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Input className="inputItem" />
              </Form.Item>
            </Col>
          </Row>
        </div>
        <div id="insurance-details-div">
          <Row gutter={[16, 40]}>
            <Col span={12}>
              <Form.Item
                className="inputLabel"
                label="Admission Date"
                name="admissionDate"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <DatePicker format={'YYYY-MM-DD'} className="inputItem" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                className="inputLabel"
                label="Type of Admission"
                name="typeOfAdmission"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Input className="inputItem" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 40]}>
            <Col span={12}>
              <Form.Item
                className="inputLabel"
                label="Attending Physician"
                name="attendingPhysician"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Input className="inputItem" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                className="inputLabel"
                label="Third Party Payer"
                name="thirdPartyPayer"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Input className="inputItem" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 40]}>
            <Col span={12}>
              <Form.Item
                className="inputLabel"
                label="Subscriber Name"
                name="subscriberName"
                rules={[
                  {
                    required: false,
                  },
                  {
                    pattern: REGEX_FACESHEET.NAME,
                    message: messages.NAME_INVALID,
                  },
                ]}
              >
                <Input className="inputItem" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                className="inputLabel"
                label="Address"
                name="address"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Input.TextArea
                  maxLength={500}
                  style={{ resize: 'none' }}
                  className="inputItem inputItem-TextArea"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 40]}>
            <Col span={12}>
              <Form.Item
                className="inputLabel"
                label="Insurance Contact Number"
                name="insuranceContactNumber"
                rules={[
                  {
                    required: false,
                  },
                  {
                    pattern: REGEX_FACESHEET.PHONE_NO,
                    message: messages.INSURANCE_CONTACTNO_INVALID,
                  },
                ]}
              >
                <Input className="inputItem" placeholder="1234-123-123" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                className="inputLabel"
                label="Policy Number"
                name="policyNumber"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Input className="inputItem" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 40]}>
            <Col span={12}>
              <Form.Item
                className="inputLabel"
                label="Group Name"
                name="groupName"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Input className="inputItem" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                className="inputLabel"
                label="Group Number"
                name="groupNumber"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Input className="inputItem" />
              </Form.Item>
            </Col>
          </Row>
        </div>
        <div id="guarantor-details-div">
          <Row
            gutter={[16, 40]}
            data-testid="guarantor-details"
            id="guarantor-details"
          >
            <Col span={12}>
              <Form.Item
                className="inputLabel"
                label="Guarantor Name"
                name="guarantorName"
                rules={[
                  {
                    required: false,
                  },
                  {
                    pattern: REGEX_FACESHEET.NAME,
                    message: messages.NAME_INVALID,
                  },
                ]}
              >
                <Input className="inputItem" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                className="inputLabel"
                label="Guarantor Address"
                name="guarantorAddress"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Input.TextArea
                  maxLength={500}
                  style={{ resize: 'none' }}
                  className="inputItem inputItem-TextArea"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 40]}>
            <Col span={12}>
              <Form.Item
                className="inputLabel"
                label="Guarantor Gender"
                name="guarantorGender"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Select
                  className="inputItem"
                  style={{
                    height: '2.5rem',
                  }}
                  options={[
                    {
                      value: 'male',
                      label: 'Male',
                    },
                    {
                      value: 'female',
                      label: 'Female',
                    },
                    {
                      value: 'other',
                      label: 'Other',
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                className="inputLabel"
                label="Relationship"
                name="relationship"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Input className="inputItem" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 40]}>
            <Col span={12}>
              <Form.Item
                className="inputLabel"
                label="Weight (in Kg)"
                name="weight"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <InputNumber className="inputItem" controls={false} min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                className="inputLabel"
                label="Height (in cm)"
                name="height"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <InputNumber className="inputItem" controls={false} min={0} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 40]}>
            <Col span={12}>
              <Form.Item
                className="inputLabel"
                label="Diagnosis"
                name="diagnosis"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Input className="inputItem" />
              </Form.Item>
            </Col>
          </Row>
        </div>
        <div id="pcs-details-div">
          <Row gutter={[16, 40]} id="pcs-details">
            <Col span={12}>
              <Form.Item
                className="inputLabel"
                label="Pickup Location"
                name="pickupLocation"
                rules={[
                  {
                    required: true,
                    message: messages.PICKUP_LOCATION_NOT_GIVEN,
                  },
                ]}
              >
                <Input.TextArea
                  maxLength={500}
                  style={{ resize: 'none' }}
                  className="inputItem inputItem-TextArea"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                className="inputLabel"
                label="Pickup Date and Time"
                name="pickupDateTime"
                rules={[
                  {
                    required: true,
                    message: messages.PICKUP_DATE_NOT_GIVEN,
                  },
                ]}
              >
                <DatePicker
                  placeholder="Select date and time"
                  showTime
                  format={'YYYY-MM-DD h:mm A'}
                  className="inputItem"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 40]}>
            <Col span={12}>
              <Form.Item
                className="inputLabel"
                label="Transport Requested by"
                name="requestedBy"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Input className="inputItem" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                className="inputLabel"
                label="Contact Number"
                name="contactNumber"
                rules={[
                  {
                    required: false,
                  },
                  {
                    pattern: REGEX_PCS.PHONE_NO,
                    message: messages.CONTACTNO_INVALID,
                  },
                ]}
              >
                <Input className="inputItem" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 40]}>
            <Col span={12}>
              <Form.Item
                className="inputLabel"
                label="Pickup Unit/Room Number"
                name="pickupLocationunitRoom"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Input className="inputItem" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                className="inputLabel"
                label="Sending MD"
                name="sendingMD"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Input className="inputItem" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 40]}>
            <Col span={12}>
              <Form.Item
                className="inputLabel"
                label="Destination Address"
                name="destinationAddress"
                rules={[
                  {
                    required: true,
                    message: messages.DESTINATION_LOCATION_NOT_GIVEN,
                  },
                ]}
              >
                <Input.TextArea
                  maxLength={500}
                  style={{ resize: 'none' }}
                  className="inputItem inputItem-TextArea"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                className="inputLabel"
                label="Appointment Date and time"
                name="appointmentDateTime"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <DatePicker
                  placeholder="Select date and time"
                  showTime
                  format={'YYYY-MM-DD h:mm A'}
                  className="inputItem"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 40]}>
            <Col span={12}>
              <Form.Item
                className="inputLabel"
                label="Destination Unit/Room Number"
                name="destinationUnitRoom"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Input className="inputItem" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                className="inputLabel"
                label="Accepting MD"
                name="acceptingMD"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Input className="inputItem" />
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
    </>
  );
}

FormComponent.propTypes = {
  patientForm: PropTypes.object,
  formData: PropTypes.object,
};

export default FormComponent;
