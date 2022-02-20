import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import { getBalance, getTransactions } from '../../api'
import {connect} from 'react-redux';
import { formatTransactionDates } from '../../utils'

const DashboardScreen = ({ navigation, accountDetails, updateAccountDetails, updateTransactionHistory, transactionHistory }) => {

  const {
    token,
    username,
    accountNo,
    balance
  } = accountDetails;

  const {
    transactionList,
    transactionIsLoading
  } = transactionHistory

  const [groupedTransaction, setGroupedTransaction] = useState({});

  //This will group transaction list by transaction date
  const groupByTransactionDate = (array, key) => {
    return array
      .reduce((hash, obj) => {
        if(obj[key] === undefined) return hash;
        return Object.assign(hash, { [obj[key]]:( hash[obj[key]] || [] ).concat(obj)})
      }, {})
  }

  useEffect(() => {
    getBalance(token).then(response => {
      updateAccountDetails(response.balance);
    });
  }, [transactionHistory])

  useEffect(() => {
    getTransactions(token).then(response => {
      updateTransactionHistory({
        transactionIsLoading: false,
        transactionList: formatTransactionDates(response)
      });

    })
  }, []);

  useEffect(() => {
    setGroupedTransaction(groupByTransactionDate(transactionList, 'transactionDate'));
  }, [transactionHistory])

  const renderTransactionList = () => {
    return <View style={{ width: '100%', marginTop: 30, flex: 1}}>
      <Text style={{ fontWeight: 'bold', marginLeft: '10%', marginBottom: 10 }}>Your transaction history</Text>
      {transactionIsLoading ?
        <View style={{ height: '100%', justifyContent: 'center'}}>
          <ActivityIndicator testID='activityIdicator' size="large" color="gray" />
        </View>
        :
        <ScrollView>
          <View testID='transactionHistoryList' style={{ width: '100%', alignItems: 'center'}}>
            {Object.keys(groupedTransaction).map(transactionHistoryDate => {
              return <View testID='transactionHistoryItem' key={transactionHistoryDate} style={[styles.transactionCard, styles.shadowProp]}>
                <Text style={{ fontWeight: 'bold', color: 'gray'}}>{transactionHistoryDate}</Text>
                {groupedTransaction[transactionHistoryDate].map(transaction =>
                  <View key={transaction.transactionId} style={styles.senderView}>
                    <View style={{ flex: 1}}>
                      <Text style={{fontWeight: 'bold'}}>{transaction.receipient.accountHolder}</Text>
                      <Text style={{ color: 'gray', fontSize: 12}}>{transaction.receipient.accountNo}</Text>
                    </View>
                    <Text>{`- ${transaction.amount}`}</Text>
                  </View>)}
              </View>
            })}
          </View>
        </ScrollView>
      }
    </View>
  }


  return (
    <SafeAreaView style={styles.dashboardContainer}>
      <Text style={styles.logoutText} onPress={() => navigation.navigate('Login')}>Logout</Text>
      <View style={[ styles.ownerDetailsView, styles.shadowProp]}>
        <Text style={{ fontWeight: 'bold' }}>You have</Text>
        <Text testID='balance' style={{ fontWeight: 'bold', fontSize: 25 }}>SGD {balance}</Text>
        <Text style={{ color: 'gray', fontSize: 12, marginTop: 5 }}>Account No</Text>
        <Text testID='accountNo' style={{ fontWeight: 'bold' }}>{accountNo}</Text>
        <Text style={{ color: 'gray', fontSize: 12, marginTop: 5 }}>Account Holder</Text>
        <Text testID='username' style={{ fontWeight: 'bold' }}>{username}</Text>
      </View>

      {renderTransactionList()}

      <TouchableOpacity  style={styles.buttonTransfer} onPress={() => navigation.navigate('Transfer')}>
        <Text style={styles.buttonTransferText}>Make Transfer</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  dashboardContainer: {
    width: '100%',
    height: '100%',
    padding: 20,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  senderView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10
  },
  logoutText : {
    textAlign: 'right',
    paddingHorizontal: 20,
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 10
  },
  buttonTransfer: {
    width: '80%',
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
    marginBottom: 30,
    alignSelf: 'center'
  },
  buttonTransferText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  ownerDetailsView: {
    backgroundColor: 'white',
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 25,
    width: '70%',
    marginVertical: 10,
  },
  transactionCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 25,
    width: '80%',
    marginVertical: 7,
  },
  shadowProp: {
    elevation: 15,
    shadowColor: 'black',
  }
})

const mapStateToProps = (state) => {
  return {
    accountDetails: state.accountDetails,
    transactionHistory: state.transactionHistory
  }
}

const mapDispatchToProps = (dispatch) => {
  return{
    updateAccountDetails: (balance) => dispatch({
      type: 'UPDATE_ACCOUNT_DETAILS',
      balance
    }),
    updateTransactionHistory: (transactionHistory) => dispatch({
      type: 'UPDATE_TRANSACTION_HISTORY',
      transactionHistory
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);