import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
  StatusBar,
  KeyboardAvoidingView
} from 'react-native'
import { loginRequest } from '../../api'
import CustomInput from '../../components/CustomInput/CustomInput'
import { useFormik } from 'formik'
import * as yup from 'yup'
import {connect} from 'react-redux';

const LoginScreen = ({ navigation, setAccountDetails}) => {

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handlePressRegister = () => {
    navigation.navigate('Signup');
  }

  const validationSchema = yup.object().shape({
    username: yup.string()
      .required('Username is required'),
    password: yup.string()
      .required('Password is required')
  })

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      setIsLoading(true);
      const requestBody = {
        username: values.username,
        password: values.password
      }
      loginRequest(requestBody).then(response => {
        setIsLoading(false);

        if (response.status === 'success') {
          setAccountDetails({
            token: response.token,
            username: response.username,
            accountNo : response.accountNo
          })
          navigation.navigate('Dashboard');
          setApiError(null);
        } else {
          setApiError(response.error.charAt(0).toUpperCase() + response.error.slice(1))
        }
      });
    }
  });

  return(
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      enabled={Platform.OS === "ios"}
      style={styles.viewContainer}>
      <Text style={styles.loginHeader}>Login </Text>
      <View style={styles.textView}>
        <CustomInput
          dataTestID='usernameField'
          placeHolder='Username'
          value={formik.values.username}
          handleTextChange={formik.handleChange('username')}
          handleBlur={formik.handleBlur('username')}/>
        {formik.errors.username && formik.touched.username && <Text testID='usernameErrorMessage' style={styles.validationMessage}>{formik.errors.username}</Text>}
        <CustomInput
          dataTestID='passwordField'
          placeHolder='Password'
          value={formik.values.password}
          handleTextChange={formik.handleChange('password')}
          handleBlur={formik.handleBlur('password')}
          secureTextEntry={true}
        />
        {formik.errors.password && formik.touched.password && <Text testID='passwordErrorMessage' style={styles.validationMessage}>{formik.errors.password}</Text>}
        {isLoading ? <View style={{ textAlign: 'center', marginTop: 30, alignItems: 'center'}}>
          <ActivityIndicator size="large" color="gray" />
          <Text>Logging in...</Text>
        </View> : apiError && <Text testID='apiErrorMessage' style={styles.loginErrorMessage}>{apiError}</Text>}
      </View>

      <View style={styles.buttonView}>
        <TouchableOpacity onPress={formik.handleSubmit} style={[styles.buttons, styles.loginButton]}>
          <Text testID='loginButtonText' style={[styles.buttonText, styles.loginButtonText]}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePressRegister} style={[styles.buttons, styles.registerButton]}>
          <Text testID='registerButtonText' style={[styles.buttonText, styles.registerButtonText]}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  viewContainer: {
    width: '100%',
    height: '100%',
    padding: 20,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },

  loginHeader: {
    fontWeight: 'bold',
    fontSize: 30
  },

  textView: {
    flex: 1,
    justifyContent: 'center'
  },

  buttonView: {
    marginBottom: 20
  },

  buttons : {
    borderRadius: 20,
    padding: 10,
    marginVertical: 7
  },

  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center'
  },

  loginButton : {
    backgroundColor: 'black',
  },

  loginButtonText: {
    color: 'white'
  },

  registerButton: {
    borderColor: 'black',
    borderWidth: 3,
  },

  registerButtonText: {
    color: 'black'
  },

  validationMessage: {
    color: 'red',
    marginTop: 3,
    marginLeft: 5
  },

  loginErrorMessage: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlign: 'center',
    marginTop: 30,
    backgroundColor: '#ffcccc',
    borderColor: 'red',
    color: 'red',
  }

});

const mapDispatchToProps = (dispatch) => {
  return {
    setAccountDetails: (accountDetails) => dispatch({
      type: 'SET_ACCOUNT_DETAILS',
      accountDetails
    })
  }
}

export default connect(null, mapDispatchToProps)(LoginScreen)