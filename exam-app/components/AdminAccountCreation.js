import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { Text, Card } from 'react-native-paper';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { Appbar } from 'react-native-paper';

const AdminAccountCreation = ({ navigation }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('student'); // Default user type

  const handleAccountCreation = async () => {
    if (!name || !password || !userType) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.203:5000/admin/create_account', {
        name: name,
        password: password,
        user_type: userType, // Include user type in the request
      });

      if (response.status === 201) { // Assuming 201 status code for successful creation
        Alert.alert('Success', 'Admin account created successfully.');
        setName('');
        setPassword('');
        setUserType('student'); // Reset user type to default
      } else {
        Alert.alert('Error', 'Failed to create account. Please try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while creating the account.');
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Test Scores" titleStyle={styles.appbarTitle} />
      </Appbar.Header>
      <Card style={styles.card}>
        <Card.Title title="Create Account" titleStyle={styles.cardTitle} />
        <Card.Content>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter name"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={styles.label}>User Type</Text>
          <Picker
            selectedValue={userType}
            style={styles.picker}
            onValueChange={(itemValue) => setUserType(itemValue)}
          >
            <Picker.Item label="Student" value="student" />
            <Picker.Item label="Teacher" value="teacher" />
            <Picker.Item label="Admin" value="admin" />
          </Picker>

          <Button
            title="Create Account"
            onPress={handleAccountCreation}
            color="#1E88E5"
          />
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Light grey background for consistency
  },
  appbar: {
    backgroundColor: '#2196F3', // Primary light blue
  },
  appbarTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  card: {
    padding: 20,
    margin: 20,
    backgroundColor: '#E3F2FD', // Light blue card background for a fresh look
    borderRadius: 10,
    elevation: 3, // Add shadow for a modern effect
  },
  cardTitle: {
    color: '#1E88E5', // Darker blue for card title
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 20,
  },
  label: {
    color: '#455A64', // Greyish blue for text
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    height: 50,
    borderColor: '#1976D2', // Border color matching theme
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF', // White background for input field
  },
  picker: {
    height: 50,
    borderColor: '#1976D2',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
});

export default AdminAccountCreation;
