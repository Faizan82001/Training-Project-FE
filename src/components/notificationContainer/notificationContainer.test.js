import { notification } from 'antd';
import NotificationContainer from './notificationContainer';

describe('NotificationContainer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls notification.open with correct arguments', () => {
    const title = 'Test Title';
    const body = 'Test Body';

    const openMock = jest.fn();
    notification.open = openMock;

    NotificationContainer(title, body);

    expect(openMock).toHaveBeenCalledWith({
      message: title,
      description: body,
    });
  });
});
