import React, { useContext, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { UserContext } from './UserContext';
import { MaterialIcons } from '@expo/vector-icons';

const Login = ({ navigation }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [userType, setUserType] = useState('student');
  const [isRegistering, setIsRegistering] = useState(false);
  const { setUser } = useContext(UserContext);

  const handleRegister = async () => {
    try {
      const response = await axios.post(`http://192.168.1.203:5000/register`, {
        name,
        password,
        user_type: userType,
      });
      setIsRegistering(false);
      setMessage(response.data.message);
      setName('');
      setPassword('');
    } catch (error) {
      console.error('Register error:', error);
      if (error.response && error.response.data) {
        setMessage(error.response.data.error);
      } else {
        setMessage('An error occurred during registration.');
      }
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`http://192.168.1.203:5000/login`, { name, password });
      setUser({
        name: response.data.user.name,
        userType: response.data.user.user_type,
        userId: response.data.user._id,
      });
      navigation.navigate('Home');
      setMessage('Logged in');
    } catch (err) {
      setMessage('Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Card.Title
            title={isRegistering ? 'Create an Account' : 'Welcome Back'}
            titleStyle={styles.cardTitle}
            left={(props) => <MaterialIcons name={isRegistering ? 'person-add' : 'login'} size={24} color="#0D47A1" />}
          />
          <Card.Content>
            <TextInput
              label="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              mode="outlined"
            />

            {isRegistering && (
              <Picker
                selectedValue={userType}
                onValueChange={(itemValue) => setUserType(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Student" value="student" />
                <Picker.Item label="Teacher" value="teacher" />
              </Picker>
            )}

            {!isRegistering ? (
              <>
                <Button mode="contained" onPress={handleLogin} style={styles.button}>
                  Login
                </Button>
                <Button mode="outlined" onPress={() => setIsRegistering(true)} style={styles.button}>
                  Register
                </Button>
              </>
            ) : (
              <>
                <Button mode="contained" onPress={handleRegister} style={styles.button}>
                  Create Account
                </Button>
                <Button mode="outlined" onPress={() => setIsRegistering(false)} style={styles.button}>
                  Back to Login
                </Button>
              </>
            )}
          </Card.Content>
        </Card>

        {message ? <Text style={styles.message}>{message}</Text> : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    paddingTop: 50,
    padding: 20,
    paddingBottom: 40, // Extra padding to prevent content from getting cut off at the bottom
  },
  card: {
    backgroundColor: '#BBDEFB', // Light blue card background
    borderRadius: 8,
    padding: 20,
  },
  cardTitle: {
    color: '#0D47A1', // Darker blue for card title
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#FFFFFF', // White background for input fields
  },
  button: {
    marginTop: 10,
    backgroundColor: '#2196F3', // Primary light blue for buttons
  },
  message: {
    marginTop: 10,
    color: '#D32F2F', // Red color for error messages
    textAlign: 'center',
  },
  picker: {
    marginBottom: 10,
  },
});

export default Login;
