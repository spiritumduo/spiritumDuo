import { configureStore } from '@reduxjs/toolkit';
import modalPatientReducer from 'components/ModalPatient.slice';
import homePageReducer from 'pages/HomePage.slice';

const store = configureStore({
  reducer: {
    modalPatient: modalPatientReducer,
    homePage: homePageReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
