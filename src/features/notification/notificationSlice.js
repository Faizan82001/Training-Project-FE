import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notificationDot: false,
  shouldReceiveNotification: true,
};

export const notificationSlice = createSlice({
  initialState,
  name: 'notification',
  reducers: {
    setNotificationDot: (state, action) => {
      state.notificationDot = action.payload;
    },
    setShouldReceiveNotification: (state, action) => {
      state.shouldReceiveNotification = action.payload;
    },
  },
});

export const { setNotificationDot, setShouldReceiveNotification } =
  notificationSlice.actions;

export default notificationSlice.reducer;
