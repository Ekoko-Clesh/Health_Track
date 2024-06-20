// src/components/Input/InputField.js

import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

const InputField = ({ placeholder, keyboardType, secureTextEntry, value, onChangeText, required }) => {
  const handleTextChange = (text) => {
    onChangeText(text);
  };

  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      placeholderTextColor="#8fa3ad"
      value={value}
      onChangeText={handleTextChange}
      required={required}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 20,
    borderColor: '#8fa3ad',
    borderWidth: 1,
  },
});

export default InputField;
