import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image} from 'react-native';
import { TextInput, Button, Text, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config/config';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Email e senha são obrigatórios');
      return;
    }

    const userData = { email, password };

    setLoading(true);

    try {
      const response = await axios.post(`${config.API_BASE_URL}/login`, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Erro', error.response ? error.response.data.error : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.header}>Iniciar Sessão</Text>
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

      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
        contentStyle={{ backgroundColor: 'green' }}
        style={styles.loginButton}
      >
        {loading ? <ActivityIndicator color="#fff" /> : 'Iniciar Sessão'}
      </Button>

      <Button onPress={() => navigation.navigate('SignUp')} style={styles.signUpText}>
        Não tem uma conta? Cadastre-se
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  input: {
      marginBottom: 7,
      marginTop:7,
      backgroundColor: '#ffffff',
      borderRadius: 5,
      padding: 5,
      borderColor: '#ddd',
      borderWidth: 1,
      justifyContent: 'center',
      height:45,
  },
  loginButton: {
    marginTop: 10,
  },
  signUpText: {
    marginTop: 10,
    color: 'green',
  },
    logo: {
    width: 300,
    height: 300,
    alignSelf: 'center',
  },
});

export default LoginScreen;
