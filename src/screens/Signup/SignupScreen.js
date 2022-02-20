import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView
} from 'react-native'
import CustomInput from '../../components/CustomInput/CustomInput'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { signupRequest } from '../../api'
import { Icon } from 'react-native-elements';

const SignupScreen = ({ navigation }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [signupStatus, setSignupStatus] = useState({});

  const validationSchema = yup.object().shape({
    username: yup.string()
      .required('Username is required'),
    password: yup.string()
      .required('Password is required'),
    confirmPassword: yup.string()
      .required('Confirm password is required')
  })

  const formik = useFormik({
    initialValues : {
      username: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema,
    onSubmit: values => {

      if(values.password !== values.confirmPassword) {
        formik.setFieldError('confirmPassword', `Password didn't match`)
      } else {
        setIsLoading(true);
        const requestBody = {
          username: values.username,
          password: values.password
        }
        signupRequest(requestBody).then(response => {

          setSignupStatus({
            status: response.status,
            message: response.error ? response.error.charAt(0).toUpperCase() + response.error.slice(1) : 'Signup successfully'
          })
          setIsLoading(false);

        });
      }
    }
  })

  return (
    <KeyboardAvoidingView
  behavior={Platform.OS === "ios" ? "padding" : "height"}
  keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
  enabled={Platform.OS === "ios"}
  style={styles.container} style={styles.container}>
      <View
        style={{
          paddingVertical: 5,
          alignItems: 'flex-start',
        }}>
        <Icon testID='backArrow' name='arrow-back' onPress={() => navigation.navigate('Login')}/>
      </View>
      <Text style={styles.registerText}>Register</Text>
      <View style={styles.inputView}>
        <CustomInput
          dataTestID='signupUsername'
          placeHolder='Username'
          value={formik.values.username}
          handleTextChange={formik.handleChange('username')}
          handleBlur={formik.handleBlur('username')}/>
        {formik.touched.username && formik.errors.username &&
          <Text testID='usernameErrorMessage' style={styles.errorMessage}>{formik.errors.username}</Text>}
        <CustomInput
          dataTestID='signupPassword'
          placeHolder='Password'
          value={formik.values.password}
          secureTextEntry={true}
          handleTextChange={formik.handleChange('password')}
          handleBlur={formik.handleBlur('password')}/>
        {formik.errors.password && formik.touched.password &&
          <Text testID='passwordErrorMessage' style={styles.errorMessage}>{formik.errors.password}</Text>}
        <CustomInput
          dataTestID='confirmPassword'
          placeHolder='Confirm Password'
          value={formik.values.confirmPassword}
          secureTextEntry={true}
          handleTextChange={formik.handleChange('confirmPassword')}
          handleBlur={formik.handleBlur('confirmPassword')}/>
        {formik.touched.confirmPassword && formik.errors.confirmPassword &&
          <Text testID='confirmPasswordErrorMessage' style={styles.errorMessage}>{formik.errors.confirmPassword}</Text>}

        {isLoading ? <View style={{ textAlign: 'center', marginTop: 30, alignItems: 'center'}}>
          <ActivityIndicator size="large" color="gray" />
          <Text>Signing up...</Text>
        </View> :
          signupStatus.status &&
          <Text
            testID='apiErrorMessage'
            style={[styles.signupStatusMessage, signupStatus.status === 'success' ?
              styles.signupStatusSuccessMessage : styles.signupStatusErrorMessage]}>
            {signupStatus.message}
          </Text>}
      </View>

      <TouchableOpacity  style={styles.buttonRegister} onPress={formik.handleSubmit}>
        <Text testID='registerButtonText' style={styles.registerButtonText}>REGISTER</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    padding: 20,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  registerText : {
    fontWeight: 'bold',
    fontSize: 30
  },
  inputView: {
    flex: 1,
    justifyContent: 'center'
  },
  errorMessage: {
    color: 'red',
    marginLeft: 5,
    marginBottom: 5
  },
  buttonRegister: {
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 10,
    marginBottom: 20
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signupStatusMessage : {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 30
  },
  signupStatusSuccessMessage: {
    backgroundColor: '#ccffcd',
    borderColor: 'green',
    color: 'green',
  },
  signupStatusErrorMessage: {
    backgroundColor: '#ffcccc',
    borderColor: 'red',
    color: 'red',
  }
})

export default SignupScreen;