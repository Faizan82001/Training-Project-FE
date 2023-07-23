import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: true,
  activeKey: '',
};

export const sidebarSlice = createSlice({
  initialState,
  name: 'collapsed',
  reducers: {
    toggle: (state) => {
      state.value = !state.value; // to toggle the sidebar
    },
    setActiveKey: (state, action) => {
      state.activeKey = action.payload;
    },
  },
});

export const { toggle, setActiveKey } = sidebarSlice.actions;

export default sidebarSlice.reducer;
