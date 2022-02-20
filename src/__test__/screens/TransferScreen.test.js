import React from 'react';
import configureStore from 'redux-mock-store'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import TransferScreen from '../../screens/Transfer/TransferScreen'
import { act } from 'react-dom/test-utils';

const mockStore = configureStore();

describe('Transfer Screen', () => {

  let store;
  let transferScreen;
  let props;

  beforeEach(() => {
    store = mockStore({
      accountDetails: {
        username: 'test username',
        balance: '1002',
        token: 'test token',
        accountNo: 'asd123'
      },
      updateTransactionHistory: jest.fn(),
    })
    props = {
      navigation: {
        navigate: jest.fn()
      }
    }
    transferScreen = render(<TransferScreen store={store} {...props}/>);
  })

  test('Transfer screen should validate amount transfer', async () => {
    const transferButtonText = transferScreen.getByTestId('transferButtonText');
    expect(transferButtonText).toBeTruthy();

    const payeePicker = transferScreen.getByTestId('payeePicker');
    expect(payeePicker).toBeTruthy();

    act(() => {
      fireEvent.press(transferButtonText);
    })
    await waitFor(() => {
      const amountErrorMessage = transferScreen.getByTestId('amountErrorMessage');
      expect(amountErrorMessage.props.children).toEqual("Please put amount");
    });

  })

});