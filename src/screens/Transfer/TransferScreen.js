import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Platform, StatusBar, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView } from 'react-native'
import CustomInput from '../../components/CustomInput/CustomInput'
import { Picker } from '@react-native-picker/picker'
import { getPayees, getTransactions, transferAmount } from '../../api'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { Icon } from 'react-native-elements'
import {connect} from 'react-redux';
import { formatTransactionDates } from '../../utils'

const TransferScreen = ({ accountDetails, navigation, updateTransactionHistory }) => {

  const { token, balance } = accountDetails;

  const [payeesList, setPayeesList] = useState([]);
  const [transferStatus, setTransferStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getPayees(token).then(response => {
      if(response.message === 'jwt expired') {
        alert('Session expired. Please login again.');
       navigation.navigate('Login');
      } else {
        setPayeesList(response.data);
      }
    })
  }, [])

  const validationSchema = yup.object().shape({
    amount: yup.number()
      .positive()
      .required('Please put amount')
      .test('value', 'Amount must not greater than current balance', value => value <= balance)
  })

  const formik = useFormik({
    initialValues: {
      payeeAccountNo: 'select',
      amount: '',
      description: ''
    },
    validationSchema,
    onSubmit: values => {
      if (values.payeeAccountNo === 'select') {
        formik.setFieldError('payeeAccountNo', 'Please select payee');
      } else {

        setIsLoading(true);

        const requestBody = {
          receipientAccountNo: values.payeeAccountNo,
          amount: parseFloat(values.amount),
          description: values.description
        }

        transferAmount(token, requestBody).then(response => {

            if(response.status === 'failed' && response.error.message === 'jwt expired') {
              alert('Session expired. Please login again.');
              navigation.navigate('Login');
            } else {
              setTransferStatus({
                status: response.status,
                errorMessage: response.error && response.error.charAt(0).toUpperCase() + response.error.slice(1)
              });
              setIsLoading(false);

              if(response.status === 'success') {
                getTransactions(token).then(transactionHistoryResponse => {
                  updateTransactionHistory({
                    transactionIsLoading: false,
                    transactionList: formatTransactionDates(transactionHistoryResponse)
                  });

                })
              }
            }
        })
      }
    }
  })

  return (<KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    enabled={Platform.OS === "ios"}
    style={styles.container}>
    <View
      style={{
        paddingVertical: 5,
        alignItems: 'flex-start',
      }}
    ><Icon name='arrow-back' onPress={() => navigation.navigate('Dashboard', {reload: true})}/></View>
    <Text style={styles.transferHeader}>Transfer </Text>

    <View style={{ flex: 1 }}>
      <Picker testID='payeePicker'
              style={styles.payeesPicker}
              selectedValue={formik.values.payeeAccountNo}
              onValueChange={(itemValue => formik.setFieldValue('payeeAccountNo', itemValue))}>
        <Picker.Item key='select' label='Please Select Payee' value='select' />
        {payeesList.map(payee => {
          return <Picker.Item key={payee.id} label={payee.name} value={payee.accountNo} />
        })}
      </Picker>
      {formik.errors.payeeAccountNo && <Text testID='pickerErrorMessage' style={styles.validationMessage}>{formik.errors.payeeAccountNo}</Text>}
      <CustomInput
        dataTestID='amoutField'
        placeHolder='Amount'
        value={formik.values.amount}
        handleTextChange={formik.handleChange('amount')}
        handleBlur={formik.handleBlur('amount')}
        keyboardType='numeric'/>
      {formik.errors.amount && formik.touched.amount && <Text testID='amountErrorMessage' style={styles.validationMessage}>{formik.errors.amount}</Text>}
      <TextInput
        style={styles.textArea}
        multiline={true}
        placeholder='Description (optional)'
        value={formik.values.description}
        onChangeText={formik.handleChange('description')}
        onBlur={formik.handleBlur('description')}/>

      {isLoading ? <ActivityIndicator size="large" color="gray" /> : transferStatus.status &&
        <Text
          style={[
            styles.transferStatusMessage,
            transferStatus.status === 'success' ? styles.transferStatusSuccessMessage : styles.transferStatusErrorMessage
          ]}>{transferStatus.status === 'success' ? 'Amount transferred successfully.' : transferStatus.errorMessage}
        </Text>
      }
    </View>

    <TouchableOpacity  style={styles.buttonTransfer} onPress={formik.handleSubmit}>
      <Text testID='transferButtonText' style={styles.transferButtonText}>Transfer Now</Text>
    </TouchableOpacity>
  </KeyboardAvoidingView>);
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    padding: 20,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  transferHeader: {
    fontWeight: 'bold',
    fontSize: 30
  },
  textArea: {
    height: 200,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 5,
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlignVertical: 'top'
  },
  payeesPicker: {
    width: '100%',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonTransfer: {
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 10,
    marginBottom: 20
  },
  transferButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  validationMessage: {
    color: 'red',
    marginLeft: 5
  },
  transferStatusMessage : {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 50
  },
  transferStatusSuccessMessage: {
    backgroundColor: '#ccffcd',
    borderColor: 'green',
    color: 'green',
  },
  transferStatusErrorMessage: {
    backgroundColor: '#ffcccc',
    borderColor: 'red',
    color: 'red',
  }
})

const mapStateToProps = (state) => {
  return {
    accountDetails: state.accountDetails
  }
}

const mapDispatchToProps = (dispatch) => {
  return{
    updateTransactionHistory: (transactionHistory) => dispatch({
      type: 'UPDATE_TRANSACTION_HISTORY',
      transactionHistory
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransferScreen);