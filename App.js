import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './src/screens/Login/LoginScreen'
import Navigation from './src/Navigation/Navigation'
import React from 'react'
import {createStore} from 'redux';
import {Provider} from 'react-redux';

const initialState = {
  accountDetails: {
    username: '',
    accountNo: '',
    token: '',
    balance: '',
  },
  transactionHistory: {
    transactionIsLoading: true,
    transactionList: []
  }
}

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case 'SET_ACCOUNT_DETAILS':
      return {...state,
      accountDetails: {
        accountNo: action.accountDetails.accountNo,
        username: action.accountDetails.username,
        token: action.accountDetails.token
      }}
    case 'UPDATE_ACCOUNT_DETAILS': {
      return {...state,
        accountDetails: {
        ...state.accountDetails,
          balance: action.balance
      }}
    }
    case 'UPDATE_TRANSACTION_HISTORY' : {
      return {
        ...state,
        transactionHistory: {
          transactionIsLoading: action.transactionHistory.transactionIsLoading,
          transactionList: action.transactionHistory.transactionList,
        }
      }
    }
  }
  return state;
}

const store = createStore(reducer);

export default function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}