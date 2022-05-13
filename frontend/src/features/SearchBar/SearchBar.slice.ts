import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from 'app/store';

interface SearchBarState {
  query?: string;
}

const initialState: SearchBarState = {
  query: undefined,
};

export const searchBarSlice = createSlice({
  name: 'searchBar',
  initialState: initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
  },
});

export const { setQuery } = searchBarSlice.actions;
export const selectQuery = (state: RootState) => state.searchBar.query;

export default searchBarSlice.reducer;
