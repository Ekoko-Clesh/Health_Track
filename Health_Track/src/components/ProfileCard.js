// src/components/ProfileCard.js

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProfileCard = ({ user }) => {
  const navigation = useNavigation();

  const handleLogout = () => {
    // Aqui você pode implementar a lógica para logout, como limpar o estado do usuário
    alert('Logged out successfully!');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.details}>Age: {user.age} | Gender: {user.gender}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    color: '#777',
  },
  actions: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#388e3c',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
  },
});

export default ProfileCard;
