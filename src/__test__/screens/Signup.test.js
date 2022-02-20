import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import SignupScreen from '../../screens/Signup/SignupScreen'
import { act } from 'react-dom/test-utils';
import * as api from '../../api'

describe('Signup Screen', () => {

  let signupScreen;
  let props;

  beforeEach(() => {
    props = {
      navigation: {
        navigate: jest.fn()
      }
    }
    signupScreen = render(<SignupScreen {...props}/>);
  })

  test('Signup screen should render required elements', () => {

    const signupUsername = signupScreen.getByTestId('signupUsername');
    expect(signupUsername).toBeTruthy();

    const signupPassword = signupScreen.getByTestId('signupPassword');
    expect(signupPassword).toBeTruthy();

    const confirmPassword = signupScreen.getByTestId('confirmPassword');
    expect(confirmPassword).toBeTruthy();

    const registerButtonText = signupScreen.getByTestId('registerButtonText');
    expect(registerButtonText).toBeTruthy();

  })

  test('Signup screen should validate empty fields', async () => {
    const registerButtonText = signupScreen.getByTestId('registerButtonText');

    act(() => {
      fireEvent.press(registerButtonText);
    })

    await waitFor(() => {
      const usernameErrorMessage = signupScreen.getByTestId('usernameErrorMessage');
      expect(usernameErrorMessage).toBeTruthy();
      const passwordErrorMessage = signupScreen.getByTestId('passwordErrorMessage');
      expect(passwordErrorMessage).toBeTruthy();
      const confirmPasswordErrorMessage = signupScreen.getByTestId('confirmPasswordErrorMessage');
      expect(confirmPasswordErrorMessage).toBeTruthy();
    })
  })

  test('Signup screen should validate password match', async () => {
    const signupUsername = signupScreen.getByTestId('signupUsername');
    const signupPassword = signupScreen.getByTestId('signupPassword');
    const confirmPassword = signupScreen.getByTestId('confirmPassword');
    const registerButtonText = signupScreen.getByTestId('registerButtonText');
    fireEvent.changeText(signupUsername, 'test');
    fireEvent.changeText(signupPassword, 'asdasd');
    fireEvent.changeText(confirmPassword, 'asd123');

    act(() => {
      fireEvent.press(registerButtonText);
    })

    await waitFor(() => {
      const confirmPasswordErrorMessage = signupScreen.getByTestId('confirmPasswordErrorMessage');
      expect(confirmPasswordErrorMessage).toBeTruthy();
      expect(confirmPasswordErrorMessage.props.children).toEqual('Password didn\'t match');
    })
  })

  test('Signup screen should validate existing username', async () => {
    const signupUsername = signupScreen.getByTestId('signupUsername');
    const signupPassword = signupScreen.getByTestId('signupPassword');
    const confirmPassword = signupScreen.getByTestId('confirmPassword');
    const registerButtonText = signupScreen.getByTestId('registerButtonText');
    fireEvent.changeText(signupUsername, 'test');
    fireEvent.changeText(signupPassword, 'asdasd');
    fireEvent.changeText(confirmPassword, 'asdasd');

    act(() => {
      fireEvent.press(registerButtonText);
      const mockLoginRequest = jest.spyOn(api, 'signupRequest');
      mockLoginRequest.mockResolvedValue(Promise.resolve({
        status: 'failed',
        error: 'Username already exists',
      }))
    })

    await waitFor(() => {
      const apiErrorMessage = signupScreen.getByTestId('apiErrorMessage');
      expect(apiErrorMessage).toBeTruthy();
      expect(apiErrorMessage.props.children).toEqual('Username already exists');
    })
  })

  test('Signup screen should handle successful signup', async () => {
    const signupUsername = signupScreen.getByTestId('signupUsername');
    const signupPassword = signupScreen.getByTestId('signupPassword');
    const confirmPassword = signupScreen.getByTestId('confirmPassword');
    const registerButtonText = signupScreen.getByTestId('registerButtonText');
    fireEvent.changeText(signupUsername, 'test');
    fireEvent.changeText(signupPassword, 'asdasd');
    fireEvent.changeText(confirmPassword, 'asdasd');

    act(() => {
      fireEvent.press(registerButtonText);
      const mockLoginRequest = jest.spyOn(api, 'signupRequest');
      mockLoginRequest.mockResolvedValue(Promise.resolve({
        status: 'success',
      }))
    })

    await waitFor(() => {
      const apiErrorMessage = signupScreen.getByTestId('apiErrorMessage');
      expect(apiErrorMessage).toBeTruthy();
      expect(apiErrorMessage.props.children).toEqual('Signup successfully');
    })
  })
})