import React, { useContext, useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { UserContext } from './UserContext';

const Login = ({ navigation }) => {
  const {user, setUser} = useContext(UserContext);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://192.168.1.203:5000/register', {
        name,
        password,
        user_type: 'student'
      });
      console.log('Register response:', response);
      setMessage(response.data.message);
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
      const response = await axios.post('http://192.168.1.203:5000/login', {
        name,
        password
      });
      console.log('Login response:', response);
      setMessage(response.data.message);
      if (response.data.user) {
        setUser(response.data.user);
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.data) {
        setMessage(error.response.data.error);
      } else {
        setMessage('An error occurred during login.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Register" onPress={handleRegister} color="#007BFF" />
      <Button title="Login" onPress={handleLogin} color="#28A745" />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#F8F9FA',
    },
    input: {
      height: 40,
      borderColor: '#CED4DA',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 15,
      backgroundColor: '#FFFFFF',
    },
    message: {
      marginTop: 10,
      color: '#DC3545',
      textAlign: 'center',
    },
});

export default Login;
