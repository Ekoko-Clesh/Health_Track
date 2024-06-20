import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Text, Button } from 'react-native-paper';

const Step1 = ({ name, email, password, confirmPassword, setName, setEmail, setPassword, setConfirmPassword, nextStep }) => {
  return (
    <View style={styles.contentContainer}>
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.header}>Cadastro - Etapa 1</Text>
      <TextInput
        label="Nome"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        label="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        label="Confirmar Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button mode="contained" onPress={nextStep} style={styles.button}>
        Próxima Etapa
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#f8f9fa',
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 10, // Reduzido para diminuir a separação
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
      marginBottom: 7,
      marginTop:7,
      backgroundColor: '#ffffff',
      borderRadius: 5,
      borderColor: '#ddd',
      borderWidth: 1,
      justifyContent: 'center',
      height:45,
  },
  button: {
    marginTop: 10,
    backgroundColor: 'green',
  },
});

export default Step1;
