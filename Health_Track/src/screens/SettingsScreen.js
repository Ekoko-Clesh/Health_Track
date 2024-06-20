// src/screens/SettingsScreen.js
import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { List, Divider } from 'react-native-paper';

const SettingsScreen = () => {
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  return (
    <View style={styles.container}>
      <List.Section>
        <List.Subheader>Configurações Gerais</List.Subheader>
        <Divider />
        <List.Item
          title="Notificações"
          left={() => <List.Icon icon="bell" />}
          right={() => <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />}
        />
        <Divider />
        <List.Item
          title="Tema Escuro"
          left={() => <List.Icon icon="theme-light-dark" />}
          right={() => <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />}
        />
        <Divider />
        <List.Item
          title="Idioma"
          left={() => <List.Icon icon="earth" />}
          right={() => <Text style={styles.languageText}>Português</Text>}
        />
        <Divider />
      </List.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  languageText: {
    marginRight: 16,
    fontSize: 16,
  },
});

export default SettingsScreen;
