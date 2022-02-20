import React from 'react';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react-native'
import DashboardScreen from '../../screens/Dashboard/DashboardScreen'

const mockStore = configureStore();

describe('Dashboard Screen', () => {

  let store;
  let dashboardScreen;
  let props;

  beforeEach(() => {
    store = mockStore({
      accountDetails: {
        username: 'test username',
        balance: '1002',
        token: 'test token',
        accountNo: 'asd123'
      },
      transactionHistory: {
        transactionIsLoading: false,
        transactionList: [
          {
            transactionId:"6211c6f6c6b1e00bd0f1b32a",
            amount:555,
            description:null,
            transactionType:"transfer",
            receipient:{
              accountNo:"6554-630-9653",
              accountHolder:"Andy"
            },
            transactionDate:"Sun Feb 20 2022"
          },
          {
            transactionId:"6211c6f6c6b1e0023bd0f1b32a",
            amount:555,
            description:null,
            transactionType:"transfer",
            receipient:{
              accountNo:"6554-630-9653",
              accountHolder:"Andy"
            },
            transactionDate:"Sun Feb 20 2022"
          },
          {
            transactionId:"6211c6e0c6b1e00bd0f1b322",
            amount:20,
            description:null,
            transactionType:"transfer",
            receipient:{
              accountNo:"9226-178-8806",
              accountHolder:"Alvis"
            },
            transactionDate:"Sun Feb 19 2022"
          }
        ]
      },
      updateAccountDetails: jest.fn(),
      updateTransactionHistory: jest.fn(),
    })
    props = {
      navigation: {
        navigate: jest.fn()
      }
    }
    mountScreen(props);
  })

  const mountScreen = (customProps) => {
    dashboardScreen = render(<DashboardScreen store={store} {...customProps}/>);
  }

  test('Should load correct owner details', () => {

    const username = dashboardScreen.getByTestId('username');
    const balance = dashboardScreen.getByTestId('balance');
    const accountNo = dashboardScreen.getByTestId('accountNo');

    expect(username).toBeTruthy();
    expect(balance).toBeTruthy();
    expect(accountNo).toBeTruthy();

    expect(dashboardScreen.queryByText('test username')).toBeTruthy()
    expect(dashboardScreen.queryByText('SGD 1002')).toBeTruthy()
    expect(dashboardScreen.queryByText('asd123')).toBeTruthy()
  })

  test('Should show transaction history', () => {

    const transactionHistoryList = dashboardScreen.getByTestId('transactionHistoryList');
    expect(transactionHistoryList).toBeTruthy();

    const transactionHistoryItem = dashboardScreen.queryAllByTestId('transactionHistoryItem');
    expect(transactionHistoryItem).toHaveLength(2);
  })

})