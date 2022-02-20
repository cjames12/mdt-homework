import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const CustomInput = ({placeHolder, value, handleTextChange, handleBlur, secureTextEntry = false, keyboardType = 'default', dataTestID }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder={placeHolder}
        value={value}
        onChangeText={handleTextChange}
        onBlur={handleBlur}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        testID={dataTestID}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
   width: '100%',
  },
  textInput: {
    width: '100%',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 5,
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 5
  }
})

export default CustomInput;