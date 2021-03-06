import { configureStore } from '@reduxjs/toolkit';
import homePageReducer from 'pages/HomePage.slice';
import modalPatientReducer from 'components/ModalPatient.slice';
import searchBarReducer from 'features/SearchBar/SearchBar.slice';
import onMdtWorkflowReducer from 'features/DecisionPoint/DecisionPoint.slice';

const store = configureStore({
  reducer: {
    modalPatient: modalPatientReducer,
    homePage: homePageReducer,
    searchBar: searchBarReducer,
    onMdtWorkflow: onMdtWorkflowReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
