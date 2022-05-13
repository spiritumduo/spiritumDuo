import { configureStore } from '@reduxjs/toolkit';
import homePageReducer from 'pages/HomePage.slice';
import modalPatientReducer from 'components/ModalPatient.slice';
import searchBarReducer from 'features/SearchBar/SearchBar.slice';

const store = configureStore({
  reducer: {
    modalPatient: modalPatientReducer,
    homePage: homePageReducer,
    searchBar: searchBarReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
