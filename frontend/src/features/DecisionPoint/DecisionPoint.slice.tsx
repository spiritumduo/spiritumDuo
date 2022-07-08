import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from 'app/store';

interface DecisionPointState {
  onMdtWorkflow?: string;
}

const initialState: DecisionPointState = {
  onMdtWorkflow: undefined,
};

export const decisionPointSlice = createSlice({
  name: 'decisionPoint',
  initialState: initialState,
  reducers: {
    setOnMdtWorkflow: (state, action: PayloadAction<string | undefined>) => {
      state.onMdtWorkflow = action.payload;
    },
  },
});

export const { setOnMdtWorkflow } = decisionPointSlice.actions;
export const selectOnMdtWorkflow = (state: RootState) => state.onMdtWorkflow;

export default decisionPointSlice.reducer;
