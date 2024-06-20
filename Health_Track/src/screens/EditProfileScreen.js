import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config/config';

const EditProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [healthGoals, setHealthGoals] = useState('');
  const [userType, setUserType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setName(parsedUser.name);
          setBirthDate(parsedUser.birthDate);
          setGender(parsedUser.gender);
          setWeight(parsedUser.weight);
          setHeight(parsedUser.height);
          setActivityLevel(parsedUser.activityLevel);
          setHealthGoals(parsedUser.healthGoals);
          setUserType(parsedUser.userType);
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        const updatedUser = {
          ...parsedUser,
          name,
          birthDate,
          gender,
          weight,
          height,
          activityLevel,
          healthGoals,
          userType
        };

        await axios.put(`${config.API_BASE_URL}/users/${parsedUser.id}`, updatedUser, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000 // Tempo limite de 10 segundos
        });

        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

        alert('Perfil atualizado com sucesso!');
        navigation.navigate('Home', { user: updatedUser }); // Enviar os dados atualizados ao navegar de volta
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar perfil. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#388e3c" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Editar Perfil</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Data de Nascimento"
        value={birthDate}
        onChangeText={setBirthDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Gênero"
        value={gender}
        onChangeText={setGender}
      />
      <TextInput
        style={styles.input}
        placeholder="Peso (kg)"
        value={weight}
        onChangeText={setWeight}
      />
      <TextInput
        style={styles.input}
        placeholder="Altura (cm)"
        value={height}
        onChangeText={setHeight}
      />
      <TextInput
        style={styles.input}
        placeholder="Nível de Atividade"
        value={activityLevel}
        onChangeText={setActivityLevel}
      />
      <TextInput
        style={styles.input}
        placeholder="Objetivos de Saúde"
        value={healthGoals}
        onChangeText={setHealthGoals}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#388e3c',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default EditProfileScreen;
