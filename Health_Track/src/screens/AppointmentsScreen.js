import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config/config';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';

const AppointmentsScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [editAppointment, setEditAppointment] = useState(null);
  const [newAppointment, setNewAppointment] = useState({
    doctorId: '',
    patientId: '',
    date: new Date(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchDoctors();
    setPatientId();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchAppointments();
    }, [])
  );

const fetchAppointments = async () => {
  try {
    const userData = await AsyncStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      const response = await axios.get(`${config.API_BASE_URL}/appointments`, {
        params: {
          patientId: parsedUser.id,
        },
      });
      setAppointments(response.data);
    }
  } catch (error) {
    Alert.alert('Erro ao obter agendamentos:', error.message);
  }
};


  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/doctors`);
      setDoctors(response.data);
    } catch (error) {
      console.error('Erro ao obter médicos:', error);
    }
  };

  const setPatientId = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setNewAppointment((prevState) => ({
          ...prevState,
          patientId: parsedUser.id,
        }));
      }
    } catch (error) {
      console.error('Erro ao definir ID do paciente:', error);
    }
  };

  const createAppointment = async () => {
    const appointmentData = { ...newAppointment, doctorId: selectedDoctorId };

    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/appointments`,
        appointmentData
      );
      setAppointments([...appointments, response.data]);
      setIsModalVisible(false);
      Alert.alert('Consulta agendada com sucesso');
    } catch (error) {
      Alert.alert('Erro ao criar agendamento, verifica se selecionou Médico');
    }
  };

  const updateAppointment = async () => {
    try {
      const response = await axios.put(
        `${config.API_BASE_URL}/appointments/${editAppointment.id}`,
        editAppointment
      );
      const updatedAppointments = appointments.map((appointment) =>
        appointment.id === editAppointment.id ? response.data : appointment
      );
      setAppointments(updatedAppointments);
      setIsEditModalVisible(false);
      Alert.alert('Consulta atualizada com sucesso');
    } catch (error) {
      Alert.alert('Erro ao atualizar agendamento', error.message);
    }
  };

  const deleteAppointment = async (id) => {
    try {
      const response = await axios.delete(`${config.API_BASE_URL}/appointments/${id}`);
      const filteredAppointments = appointments.filter(
        (appointment) => appointment.id !== id
      );
      setAppointments(filteredAppointments);
      Alert.alert('Agendamento apagada com sucesso');
    } catch (error) {
      Alert.alert('Erro ao apagar agendamento', error.response ? error.response.data : error.message);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || newAppointment.date;
    setShowDatePicker(false);
    setNewAppointment((prevState) => ({
      ...prevState,
      date: currentDate,
    }));
  };

const onChangeEditDate = (event, selectedDate) => {
  const currentDate = selectedDate || new Date(editAppointment.date); // Garantindo que currentDate é um objeto Date
  setShowDatePicker(false);
  setEditAppointment((prevState) => ({
    ...prevState,
    date: currentDate,
  }));
};

 const openEditModal = (appointment) => {
  setEditAppointment({
    ...appointment,
    date: new Date(appointment.date) // Garantindo que date é um objeto Date
  });
  setIsEditModalVisible(true);
};
  return (
    <View style={styles.container}>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.appointmentCard}>
            <Text>Data: {new Date(item.date).toLocaleDateString()}</Text>
            <Text>Status: {item.status}</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => openEditModal(item)}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteAppointment(item.id)}
              >
                <Text style={styles.buttonText}>Apagar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

    <TouchableOpacity style={styles.editButton} onPress={() => setIsModalVisible(true)}>
      <Text style={styles.buttonText}>Adicionar Agendamento</Text>
    </TouchableOpacity>
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Picker
              selectedValue={selectedDoctorId}
              onValueChange={(itemValue) => {
                setSelectedDoctorId(itemValue);
                setNewAppointment((prevState) => ({
                  ...prevState,
                  doctorId: itemValue,
                }));
              }}
            >
              {doctors.map((doctor) => (
                <Picker.Item key={doctor.id} label={doctor.name} value={doctor.id} />
              ))}
            </Picker>
            <TextInput
              style={styles.input}
              value={`Paciente ID: ${newAppointment.patientId}`}
              editable={false}
            />
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerText}>
                {newAppointment.date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={newAppointment.date}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}
            <TouchableOpacity
                style={[styles.editButton, { marginBottom: 10 }]}
                onPress={(createAppointment)}
              >
                <Text style={styles.buttonText}>Adicionar</Text>
              </TouchableOpacity>

            <TouchableOpacity
              style={[styles.deleteButton, { marginBottom: 10 }]}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Picker
              selectedValue={editAppointment?.doctorId}
              onValueChange={(itemValue) =>
                setEditAppointment((prevState) => ({
                  ...prevState,
                  doctorId: itemValue,
                }))
              }
            >
              {doctors.map((doctor) => (
                <Picker.Item key={doctor.id} label={doctor.name} value={doctor.id} />
              ))}
            </Picker>
            <TextInput
              style={styles.input}
              value={`Paciente ID: ${editAppointment?.patientId}`}
              editable={false}
            />
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerText}>
                {new Date(editAppointment?.date).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={editAppointment?.date || new Date()}
                mode="date"
                display="default"
                onChange={onChangeEditDate}
              />
            )}

            <TouchableOpacity
                style={[styles.editButton, { marginBottom: 10 }]}
                onPress={(updateAppointment)}
              >
                <Text style={styles.buttonText}>Actualizar</Text>
              </TouchableOpacity>

            <TouchableOpacity
              style={[styles.deleteButton, { marginBottom: 10 }]}
              onPress={() => setIsEditModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  appointmentCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#388e3c',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  editButtonText:{
    color:'#fff',
    textAlign: 'center',
  },
  agendarButton:{
    backgroundColor: '#388e3c',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center'
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  datePickerButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  datePickerText: {
    fontSize: 16,
  },
});


export default AppointmentsScreen;
