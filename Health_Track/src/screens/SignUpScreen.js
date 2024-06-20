import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-paper';
import axios from 'axios';
import config from '../../config/config';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

const SignUpScreen = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [healthGoals, setHealthGoals] = useState('');
  const [userType, setUserType] = useState('Paciente');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success');

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    let day = `${d.getDate()}`.padStart(2, '0');
    let month = `${d.getMonth() + 1}`.padStart(2, '0');
    let year = d.getFullYear();
    let hours = `${d.getHours()}`.padStart(2, '0');
    let minutes = `${d.getMinutes()}`.padStart(2, '0');
    let seconds = `${d.getSeconds()}`.padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword || !birthDate || !gender || !weight || !height || !activityLevel || !healthGoals) {
      showMessage('Todos os campos são obrigatórios', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showMessage('As senhas não coincidem', 'error');
      return;
    }

    const userData = {
      name,
      email,
      password,
      birthDate: formatDate(birthDate),
      gender,
      weight,
      height,
      activityLevel,
      healthGoals,
      userType,
    };

    setLoading(true);

    try {
      const response = await axios.post(`${config.API_BASE_URL}/users`, userData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      showMessage('Usuário cadastrado com sucesso', 'success');
    } catch (error) {
      showMessage('Erro ao cadastrar usuário', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (message, type) => {
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {step === 1 && (
          <Step1
            name={name}
            email={email}
            password={password}
            confirmPassword={confirmPassword}
            setName={setName}
            setEmail={setEmail}
            setPassword={setPassword}
            setConfirmPassword={setConfirmPassword}
            nextStep={nextStep}
          />
        )}
        {step === 2 && (
          <Step2
            birthDate={birthDate}
            gender={gender}
            weight={weight}
            height={height}
            setBirthDate={setBirthDate}
            setGender={setGender}
            setWeight={setWeight}
            setHeight={setHeight}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        )}
        {step === 3 && (
          <Step3
            activityLevel={activityLevel}
            healthGoals={healthGoals}
            userType={userType}
            setActivityLevel={setActivityLevel}
            setHealthGoals={setHealthGoals}
            setUserType={setUserType}
            prevStep={prevStep}
            handleSignUp={handleSignUp}
            loading={loading}
          />
        )}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 60,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
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

export default SignUpScreen;
