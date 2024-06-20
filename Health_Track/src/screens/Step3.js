import React, { useState } from 'react';
import {View, StyleSheet, TouchableOpacity, Modal, Image} from 'react-native';
import { TextInput, Button, Text, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import config from '../../config/config';

const Step3 = ({ weight, height, activityLevel, healthGoals, userType, setWeight, setHeight, setActivityLevel, setHealthGoals, setUserType, prevStep, handleSignUp }) => {
  const [isActivityPickerVisible, setActivityPickerVisible] = useState(false);
  const [isGoalsPickerVisible, setGoalsPickerVisible] = useState(false);
  const [isUserTypePickerVisible, setUserTypePickerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success');

  const showMessage = (message, type) => {
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.contentContainer}>
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.header}>Cadastro - Passo 3</Text>

        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setActivityPickerVisible(true)}
        >
          <Text style={styles.pickerButtonText}>
            {activityLevel ? activityLevel : 'Selecionar Nível de Atividade'}
          </Text>
        </TouchableOpacity>

      <Modal
        visible={isActivityPickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setActivityPickerVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.pickerWrapper}>
            <TouchableOpacity onPress={() => { setActivityLevel('Sedentário'); setActivityPickerVisible(false); }}>
              <Text style={[styles.pickerOption, { color: 'green' }]}>Sedentário</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setActivityLevel('Ativo'); setActivityPickerVisible(false); }}>
              <Text style={[styles.pickerOption, { color: 'green' }]}>Ativo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setActivityLevel('Muito Ativo'); setActivityPickerVisible(false); }}>
              <Text style={[styles.pickerOption, { color: 'green' }]}>Muito Ativo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActivityPickerVisible(false)}>
              <Text style={[styles.pickerOption, { color: 'green' }]}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setGoalsPickerVisible(true)}
      >
        <Text style={styles.pickerButtonText}>
          {healthGoals ? healthGoals : 'Selecionar Objetivos de Saúde'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isGoalsPickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setGoalsPickerVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.pickerWrapper}>
            <TouchableOpacity onPress={() => { setHealthGoals('Perder Peso'); setGoalsPickerVisible(false); }}>
              <Text style={[styles.pickerOption, { color: 'green' }]}>Perder Peso</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setHealthGoals('Manter a Forma'); setGoalsPickerVisible(false); }}>
              <Text style={[styles.pickerOption, { color: 'green' }]}>Manter a Forma</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setHealthGoals('Ganho de Massa'); setGoalsPickerVisible(false); }}>
              <Text style={[styles.pickerOption, { color: 'green' }]}>Ganho de Massa</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setGoalsPickerVisible(false)}>
              <Text style={[styles.pickerOption, { color: 'green' }]}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setUserTypePickerVisible(true)}
      >
        <Text style={styles.pickerButtonText}>
          {userType ? userType : 'Tipo de Utilizador'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isUserTypePickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setUserTypePickerVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.pickerWrapper}>
            <TouchableOpacity onPress={() => { setUserType('Paciente'); setUserTypePickerVisible(false); }}>
              <Text style={[styles.pickerOption, { color: 'green' }]}>Paciente</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setUserType('Médico'); setUserTypePickerVisible(false); }}>
              <Text style={[styles.pickerOption, { color: 'green' }]}>Médico</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setUserTypePickerVisible(false)}>
              <Text style={[styles.pickerOption, { color: 'green' }]}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
            <Button
        mode="contained"
        onPress={prevStep}
        style={[styles.backButton, { borderColor: 'green', borderWidth: 1, backgroundColor: 'green' }]}
      >
        Voltar
      </Button>

      <Button
        mode="contained"
        onPress={handleSignUp}
        loading={loading}
        disabled={loading}
        style={[styles.signUpButton, { backgroundColor: 'green' }]}
      >
        {loading ? <ActivityIndicator color="#fff" /> : 'Cadastrar'}
      </Button>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={modalType === 'success' ? styles.modalTextSuccess : styles.modalTextError}>{modalMessage}</Text>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.closeButton}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: 10,
  },
  pickerButton: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    justifyContent: 'center',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#777',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 10,
    padding: 20,
  },
  pickerOption: {
    fontSize: 18,
    padding: 10,
  },
  signUpButton: {
    marginTop: 10,
  },
  backButton: {
    marginTop: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTextSuccess: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'green',
    fontSize: 18,
  },
  modalTextError: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'red',
    fontSize: 18,
  },
  closeButton: {
    fontSize: 18,
    color: 'blue',
  },
});

export default Step3;
