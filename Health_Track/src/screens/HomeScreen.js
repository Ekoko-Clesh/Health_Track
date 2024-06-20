// HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  Modal,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config/config';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Configuration, OpenAIApi } from 'openai';
import { Hercai } from "hercai";

const herc = new Hercai();

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [patientsPerPage] = useState(3);
  const [isModalVisible, setIsModalVisible] = useState(false);
const [notificationMessage, setNotificationMessage] = useState('');
const [selectedPatientId, setSelectedPatientId] = useState(null);
const [notifications, setNotifications] = useState([]);


const openModal = (patientId) => {
  setSelectedPatientId(patientId);
  setIsModalVisible(true);
};

const sendNotification = async () => {
  try {
    const response = await axios.post(`${config.API_BASE_URL}/notifications`, {
      userId: selectedPatientId,
      message: notificationMessage,
    });
    setIsModalVisible(false);
    setNotificationMessage('');
    Alert.alert('sucesso', 'Notificação enviada com sucesso.')
  } catch (error) {
    Alert.alert('Erro', 'Erro ao enviar notificação.');
  }
};


  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }

    return age;
  };

useEffect(() => {
  const fetchUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        parsedUser.age = calculateAge(parsedUser.birthDate);
        setUser(parsedUser);

        if (parsedUser.userType === 'Médico') {
          const response = await axios.get(`${config.API_BASE_URL}/patients`);
          setPatients(response.data);
        } else if (parsedUser.userType === 'Paciente') {
          const response = await axios.get(`${config.API_BASE_URL}/notifications?userId=${parsedUser.id}`);
          setNotifications(response.data);
        }
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);

  const sendMessage = async () => {
    if (message.trim() === '') return;

    const updatedChatHistory = [...chatHistory, { role: 'user', content: message }];
    setChatHistory(updatedChatHistory);
    setMessage('');

    try {
    const response = await axios.get(`https://hercai.onrender.com/v3/hercai?question=${encodeURIComponent(message)}`);
      setChatHistory([...updatedChatHistory, { role: 'ai', content: response.data.reply }]);
    } catch (error) {

      Alert.alert('Erro ao enviar mensagem');
    }
  };
  const generateReport = () => {
    const doc = new jsPDF();

    doc.text('Relatório de Pacientes', 14, 20);

    const tableColumn = ['Nome', 'Idade', 'Gênero', 'Peso', 'Altura', 'Nível de Atividade', 'Objetivos de Saúde'];
    const tableRows = [];

    patients.forEach(patient => {
      const patientData = [
        patient.name,
        calculateAge(patient.birthDate),
        patient.gender,
        patient.weight,
        patient.height,
        patient.activityLevel,
        patient.healthGoals,
      ];
      tableRows.push(patientData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save('relatorio_pacientes.pdf');
  };

  const handleNextPage = () => {
    if ((page * patientsPerPage) < patients.length) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

 const renderPatient = ({ item }) => (
  <View key={item.id} style={styles.card}>
    <Image source={{ uri: item.avatar }} style={styles.avatar} />
    <View style={styles.info}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.details}>Idade: {calculateAge(item.birthDate)} | Gênero: {item.gender}</Text>
      {item.weight && <Text style={styles.details}>Peso: {item.weight} kg</Text>}
      {item.height && <Text style={styles.details}>Altura: {item.height} cm</Text>}
      {item.activityLevel && <Text style={styles.details}>Nível de Atividade: {item.activityLevel}</Text>}
      {item.healthGoals && <Text style={styles.details}>Objetivos de Saúde: {item.healthGoals}</Text>}
    </View>
    <TouchableOpacity style={styles.notifyButton} onPress={() => openModal(item.id)}>
      <Text style={styles.notifyButtonText}>Notificar</Text>
    </TouchableOpacity>
  </View>
);
 const renderNotifications = () => (
  <View style={styles.notificationsSection}>
    <Text style={styles.sectionTitle}>Notificações</Text>
    {notifications.length > 0 ? (
      notifications.map(notification => (
        <View key={notification.id} style={styles.notificationCard}>
          <Text style={styles.notificationText}>{notification.message}</Text>
        </View>
      ))
    ) : (
      <Text style={styles.noNotificationsText}>Nenhuma notificação encontrada.</Text>
    )}
  </View>
);


  const renderHeader = () => (
    <>
      <Text style={styles.header}>Home</Text>
      <View style={styles.card}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <View style={styles.info}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.details}>Idade: {user.age} | Gênero: {user.gender}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.editProfileButton}
        onPress={() => navigation.navigate('EditProfile', { user })}
      >
        <Text style={styles.editProfileButtonText}>Editar Perfil</Text>
      </TouchableOpacity>
    </>
  );

  const renderFooter = () => (
    <>
      <View style={styles.pagination}>
        <TouchableOpacity style={styles.pageButton} onPress={handlePrevPage} disabled={page === 1}>
          <Text style={styles.pageButtonText}>Anterior</Text>
        </TouchableOpacity>
        <Text style={styles.pageIndicator}>{page}</Text>
        <TouchableOpacity style={styles.pageButton} onPress={handleNextPage} disabled={(page * patientsPerPage) >= patients.length}>
          <Text style={styles.pageButtonText}>Próximo</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.reportButtonContainer}>
        <TouchableOpacity style={styles.reportButton} onPress={generateReport}>
          <Text style={styles.reportButtonText}>Gerar Relatório</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderPatientDetails = () => (
    <View style={styles.healthSection}>
      <Text style={styles.sectionTitle}>Informações de Saúde</Text>

      <View style={styles.healthCardsContainer}>
        <View style={styles.healthCard}>
          <Text style={styles.healthCardTitle}>Peso</Text>
          <Text style={styles.healthCardValue}>{user.weight} kg</Text>
        </View>
        <View style={styles.healthCard}>
          <Text style={styles.healthCardTitle}>Altura</Text>
          <Text style={styles.healthCardValue}>{user.height} cm</Text>
        </View>
        <View style={styles.healthCard}>
          <Text style={styles.healthCardTitle}>Nível de Atividade</Text>
          <Text style={styles.healthCardValue}>{user.activityLevel}</Text>
        </View>
        <View style={styles.healthCard}>
          <Text style={styles.healthCardTitle}>Objetivos de Saúde</Text>
          <Text style={styles.healthCardValue}>{user.healthGoals}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#388e3c" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Usuário não encontrado</Text>
      </View>
    );
  }

return (
  <>
    <FlatList
      data={user.userType === 'Médico' ? patients.slice((page - 1) * patientsPerPage, page * patientsPerPage) : []}
      renderItem={user.userType === 'Médico' ? renderPatient : null}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={user.userType === 'Médico' ? renderFooter : (
        <>
          {renderPatientDetails()}
          {renderNotifications()}
          <View style={styles.chatbotSection}>
            <Text style={styles.sectionTitle}>Chatbot</Text>
            <View style={styles.chatHistory}>
              {chatHistory.map((entry, index) => (
                <View key={index} style={[styles.chatMessage, entry.role === 'user' ? styles.userMessage : styles.aiMessage]}>
                  <Text style={styles.chatMessageText}>{entry.content}</Text>
                </View>
              ))}
            </View>
            <TextInput
              placeholder="Digite sua mensagem aqui"
              placeholderTextColor="#aaa"
              style={[styles.chatInput, { height: 100 }]} // Aumenta a altura da caixa de entrada
              multiline
              value={message}
              onChangeText={setMessage}
            />
            <View style={styles.chatButtonsContainer}>
              <TouchableOpacity style={styles.chatButton} onPress={sendMessage}>
                <Text style={styles.chatButtonText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
      contentContainerStyle={styles.container}
    />
    <Modal
      visible={isModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Enviar Notificação</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Digite a mensagem da notificação"
            value={notificationMessage}
            onChangeText={setNotificationMessage}
          />
          <TouchableOpacity style={styles.modalButton} onPress={sendNotification}>
            <Text style={styles.modalButtonText}>Enviar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modalButton, { backgroundColor: 'red' }]} onPress={() => setIsModalVisible(false)}>
            <Text style={styles.modalButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  </>
);


};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
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
  editProfileButton: {
    backgroundColor: '#388e3c',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginVertical: 10,
  },
  editProfileButtonText: {
    color: '#fff',
  },
  healthSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  healthCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  healthCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    width: '48%',
    marginBottom: 15,
  },
  healthCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  healthCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  trendsSection: {
    marginBottom: 20,
  },
  chatbotSection: {
    marginBottom: 20,
  },
  chatbotPrompt: {
    fontSize: 16,
    marginBottom: 10,
  },
  chatInput: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  chatButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chatButton: {
    backgroundColor: '#388e3c',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  chatButtonText: {
    color: '#fff',
  },
  notificationsSection: {
    marginBottom: 20,
  },
  settingsSection: {
    marginBottom: 20,
  },
  patientsSection: {
    marginBottom: 20,
  },
  noPatientsText: {
    color: '#777',
    textAlign: 'center',
    marginTop: 10,
  },
  reportButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  reportButton: {
    backgroundColor: '#388e3c',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  reportButtonText: {
    color: '#fff',
  },
  chatHistory: {
    marginBottom: 10,
  },
  chatMessage: {
    marginBottom: 5,
    padding: 10,
    borderRadius: 5,
  },
  userMessage: {
    backgroundColor: '#e1ffc7',
    alignSelf: 'flex-start',
  },
  aiMessage: {
    backgroundColor: '#f1f0f0',
    alignSelf: 'flex-end',
  },
  chatMessageText: {
    fontSize: 16,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  pageButton: {
    padding: 10,
    backgroundColor: '#388e3c',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  pageButtonText: {
    color: '#fff',
  },
  pageIndicator: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notifyButton: {
    backgroundColor: '#388e3c',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginVertical: 10,
  },
  notifyButtonText: {
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
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    width: '100%',
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  modalButton: {
    backgroundColor: '#388e3c',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  notificationCard: {
  backgroundColor: '#fff',
  padding: 15,
  borderRadius: 10,
  marginBottom: 10,
},
notificationText: {
  fontSize: 16,
},
noNotificationsText: {
  color: '#777',
  textAlign: 'center',
  marginTop: 10,
},

});

export default HomeScreen;
