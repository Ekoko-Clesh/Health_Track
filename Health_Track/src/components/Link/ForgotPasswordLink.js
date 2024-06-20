import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

const ForgotPasswordLink = () => {
  return (
    <TouchableOpacity>
      <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    color: '#4682b4', // Azul para links e textos interativos
    fontSize: 16,
    marginTop: 20,
  },
});

export default ForgotPasswordLink;
