import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/App.jsx';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

// Step 1: Saga imports
import createSagaMiddleware from 'redux-saga';

// put is dispatch
import { takeEvery, put } from 'redux-saga/effects';
import axios from 'axios';
// END Saga imports

import logger from 'redux-logger';

const elementList = (state = [], action) => {
    switch (action.type) {
        case 'SET_ELEMENTS':
            return action.payload;
        default:
            return state;
    }
};

// Sagas are generator functions
// Sagas are going to repeat or be the same each time you write them
function* fetchElements() {

    try {
        // Try everything, we're good if no errors
        const response = yield axios.get('/api/element');
        // ! No need to use .then with a saga!
        // Dispatch an action (make sure the type is 
        // different than the saga action type)
        const action = { type: 'SET_ELEMENTS', payload: response.data };
        // put is dispatch
        yield put(action);
    } catch (error) {
        // Any errors will trigger the catch
        console.error('Error fetching elements', error);
        alert('Something went wrong.');
    }

}

function* postElement(action) {

    try {
        // Send our data to the server
        yield axios.post('/api/element', action.payload);
        // Go get the updated list of elements
        yield put({ type: 'FETCH_ELEMENTS' });
    } catch (error) {
        console.log('Error posting element', error);
        alert('Something went wrong.');
    }

}

// this is the saga that will watch for actions
function* rootSaga() {
    // Add all sagas here
    yield takeEvery('FETCH_ELEMENTS', fetchElements);
    yield takeEvery('ADD_ELEMENT', postElement);
}


const sagaMiddleware = createSagaMiddleware();

// This is creating the store
// the store is the big JavaScript Object that holds all of the information for our application
const storeInstance = createStore(
    // This function is our first reducer
    // reducer is a function that runs every time an action is dispatched
    combineReducers({
        elementList,
    }),
    applyMiddleware(sagaMiddleware, logger),
);

sagaMiddleware.run(rootSaga);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={storeInstance}>
            <App />
        </Provider>
    </React.StrictMode>
);
