import { configureStore } from '@reduxjs/toolkit';
import sidebarReducer from '../features/sidebar/sidebarSlice';
import requestDetailsReducer from '../features/requestDetails/requestDetailsSlice';
import notificationReducer from '../features/notification/notificationSlice';

export const store = configureStore({
  reducer: {
    collapsed: sidebarReducer,
    requestDetails: requestDetailsReducer,
    notification: notificationReducer,
  },
});
