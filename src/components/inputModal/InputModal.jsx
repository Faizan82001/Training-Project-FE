import React from 'react';
import { Form, Input, Modal } from 'antd';
import PropTypes from 'prop-types';

function InputModal({ title, open, onSubmitMessage, onCancel }) {
  const [form] = Form.useForm();
  return (
    <Modal
      open={open}
      title={title}
      okText="Submit"
      cancelText="Cancel"
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      wrapClassName="modalStyle"
      onOk={async () => {
        await form.validateFields();
        const message = form.getFieldValue('message');
        await onSubmitMessage(message);
        form.resetFields();
      }}
    >
      <Form form={form} layout="vertical" name="modalForm">
        <Form.Item
          name="message"
          rules={[
            {
              required: true,
              message: 'Please input the message.',
            },
          ]}
        >
          <Input.TextArea
            data-testid="modalText"
            placeholder="Enter your message"
            autoSize={{ minRows: 5 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

InputModal.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool,
  onCancel: PropTypes.func,
  onSubmitMessage: PropTypes.func,
};

export default InputModal;
