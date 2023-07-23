import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentRunNo: 0,
  currentStatus: '',
  currentAssignee: '',
};

export const requestDetailsSlice = createSlice({
  initialState,
  name: 'requestDetails',
  reducers: {
    setCurrentRunNo: (state, action) => {
      state.currentRunNo = action.payload;
    },
    setCurrentAssignee: (state, action) => {
      state.currentAssignee = action.payload;
    },
    setCurrentStatus: (state, action) => {
      state.currentStatus = action.payload;
    },
  },
});

export const { setCurrentRunNo, setCurrentAssignee, setCurrentStatus } =
  requestDetailsSlice.actions;

export default requestDetailsSlice.reducer;
