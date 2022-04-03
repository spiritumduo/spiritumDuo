import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from 'app/store';

interface ModalPatientState {
    isTabDisabled: boolean;
}

const initialState: ModalPatientState = {
  isTabDisabled: false,
};

export const modalPatientSlice = createSlice({
  name: 'modalPatient',
  initialState: initialState,
  reducers: {
    setIsTabDisabled: (state, action: PayloadAction<boolean>) => {
      state.isTabDisabled = action.payload;
    },
  },
});

export const { setIsTabDisabled } = modalPatientSlice.actions;
export const selectIsTabDisabled = (state: RootState) => state.modalPatient.isTabDisabled;

export default modalPatientSlice.reducer;
