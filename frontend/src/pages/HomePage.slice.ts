import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from 'app/store';

interface HomePageState {
  modalPatientHospitalNumber?: string;
}

const initialState: HomePageState = {
  modalPatientHospitalNumber: undefined,
};

export const homePageSlice = createSlice({
  name: 'homePage',
  initialState: initialState,
  reducers: {
    setModalPatientHospitalNumber: (state, action: PayloadAction<string | undefined>) => {
      state.modalPatientHospitalNumber = action.payload;
    },
  },
});

export const { setModalPatientHospitalNumber } = homePageSlice.actions;
export const selectModalPatientHospitalNumber = (state: RootState) => state.modalPatient;

export default homePageSlice.reducer;
