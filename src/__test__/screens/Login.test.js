import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import LoginScreen from '../../screens/Login/LoginScreen'
import configureStore from 'redux-mock-store';
import { act } from 'react-dom/test-utils';
import * as api from '../../api';

const mockStore = configureStore();

describe('Login Screen', ()=> {

  let store;
  let loginScreen;
  let props;

  beforeEach(() => {
    store = mockStore({
      setAccountDetails: jest.fn()
    })
    props = {
      navigation: {
        navigate: jest.fn()
      }
    }
    loginScreen = render(<LoginScreen store={store} {...props}/>);
  })

  test('Login screen should render required elements', () => {

    const usernameField = loginScreen.getByTestId('usernameField');
    expect(usernameField).toBeTruthy();

    const passwordField = loginScreen.getByTestId('passwordField');
    expect(passwordField).toBeTruthy();

    const loginButtonText = loginScreen.getByTestId('loginButtonText');
    expect(loginButtonText).toBeTruthy();

    const registerButtonText = loginScreen.getByTestId('registerButtonText');
    expect(registerButtonText).toBeTruthy();

  })

  test('Login screen should validate for empty inputs',async () => {
    const loginButtonText = loginScreen.getByTestId('loginButtonText');
    expect(loginButtonText).toBeTruthy();

     act( () => {
      fireEvent.press(loginButtonText);
    })

    await waitFor(() => {
      const usernameErrorMessage = loginScreen.getByTestId('usernameErrorMessage');
      expect(usernameErrorMessage).toBeTruthy();
      const passwordErrorMessage = loginScreen.getByTestId('passwordErrorMessage');
      expect(passwordErrorMessage).toBeTruthy();
    })
  })

  test('Login screen should show message for invalid credentials',async () => {

    const usernameField = loginScreen.getByTestId('usernameField');
    fireEvent.changeText(usernameField, 'test')
    const passwordField = loginScreen.getByTestId('passwordField');
    fireEvent.changeText(passwordField, 'test')
    const loginButtonText = loginScreen.getByTestId('loginButtonText');
    expect(loginButtonText).toBeTruthy();

    act( () => {
      fireEvent.press(loginButtonText);
      const mockLoginRequest = jest.spyOn(api, 'loginRequest');
      mockLoginRequest.mockResolvedValue(Promise.resolve({
            status: 'failed',
            error: 'invalid login credentials',
      }))
    })

    await waitFor(() => {
      const apiErrorMessage = loginScreen.getByTestId('apiErrorMessage');
      expect(apiErrorMessage).toBeTruthy();
      expect(apiErrorMessage.props.children).toEqual('Invalid login credentials');
    })

  })

  test('Login screen should navigate to Dashboard for successful login',async () => {

    const usernameField = loginScreen.getByTestId('usernameField');
    fireEvent.changeText(usernameField, 'test')
    const passwordField = loginScreen.getByTestId('passwordField');
    fireEvent.changeText(passwordField, 'asdasd')
    const loginButtonText = loginScreen.getByTestId('loginButtonText');

    act( () => {
      fireEvent.press(loginButtonText);
      const mockLoginRequest = jest.spyOn(api, 'loginRequest');
      mockLoginRequest.mockResolvedValue(Promise.resolve({
        status: 'success',
      }))
    })

    await waitFor(() => {
      const apiErrorMessage = loginScreen.queryByText('Invalid login credentials');
      expect(apiErrorMessage).toBeFalsy();
    })

  })
})