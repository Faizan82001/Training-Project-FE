import { notification } from 'antd';
import PropTypes from 'prop-types';

function NotificationContainer(title, body) {
  return notification.open({
    message: title,
    description: body,
  });
}

NotificationContainer.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
};

export default NotificationContainer;
