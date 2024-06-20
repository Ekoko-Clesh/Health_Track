import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { TextInput, Text, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

const Step2 = ({ birthDate, gender, weight, height, setBirthDate, setGender, setWeight, setHeight, prevStep, nextStep }) => {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isGenderPickerVisible, setGenderPickerVisible] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthDate;
    setDatePickerVisible(false);
    setBirthDate(currentDate);
  };

  return (
    <View style={styles.contentContainer}>
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.header}>Cadastro - Etapa 2</Text>
      <Text style={styles.label}>Data de Nascimento</Text>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setDatePickerVisible(true)}
      >
        <Text style={styles.pickerButtonText}>
          {birthDate ? birthDate.toLocaleDateString() : 'Selecionar Data'}
        </Text>
      </TouchableOpacity>
      {isDatePickerVisible && (
        <DateTimePicker
          value={birthDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setGenderPickerVisible(true)}
      >
        <Text style={styles.pickerButtonText}>
          {gender ? gender : 'Selecionar Gênero'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isGenderPickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setGenderPickerVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.pickerWrapper}>
            <TouchableOpacity onPress={() => { setGender('Masculino'); setGenderPickerVisible(false); }}>
              <Text style={styles.pickerOption}>Masculino</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setGender('Feminino'); setGenderPickerVisible(false); }}>
              <Text style={styles.pickerOption}>Feminino</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setGenderPickerVisible(false)}>
              <Text style={styles.pickerOption}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TextInput
        label="Peso (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        label="Altura (cm)"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button mode="contained" onPress={prevStep} style={styles.button}>
        Voltar
      </Button>
      <Button mode="contained" onPress={nextStep} style={[styles.button, styles.nextButton]}>
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
  label: {
    fontSize: 16,
    color: '#777',
    marginBottom: 5,
  },
  input: {
    marginBottom: 7,
    marginTop:7,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    height:45,
  },
  pickerButton: {
    marginTo:7,
    marginBottom:7,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 10,
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
  button: {
    marginTop: 10,
  },
  nextButton: {
    backgroundColor: 'green',
  },
});

export default Step2;