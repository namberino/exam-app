import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { Button, Text, Appbar } from 'react-native-paper';
import axios from 'axios';

const EditUserPassword = ({ route, navigation }) => {
  const { userId, userName } = route.params;
  const [newPassword, setNewPassword] = useState('');

  const handlePasswordUpdate = async () => {
    if (!newPassword) {
      Alert.alert('Error', 'Please enter a new password.');
      return;
    }

    try {
      const response = await axios.put(`http://192.168.1.203:5000/users/${userId}/update_password`, {
        password: newPassword,
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Password updated successfully.');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to update password. Please try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while updating the password.');
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Edit Password" titleStyle={styles.appbarTitle} />
      </Appbar.Header>
      <View style={styles.content}>
        <Text style={styles.label}>Editing password for {userName}</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter new password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        <Button mode="contained" onPress={handlePasswordUpdate} style={styles.button}>
          Update Password
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  appbar: {
    backgroundColor: '#2196F3',
  },
  appbarTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 20,
    color: '#212529',
  },
  input: {
    height: 50,
    borderColor: '#1976D2',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
  },
  button: {
    marginTop: 20,
    borderRadius: 4,
    backgroundColor: '#2196F3',
  },
});

export default EditUserPassword;
