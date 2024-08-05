import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import axios from 'axios';

const Login = ({ navigation }) => {
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
        navigation.navigate('Home', { user: response.data.user });
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
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Register" onPress={handleRegister} />
      <Button title="Login" onPress={handleLogin} />
      {message ? <Text>{message}</Text> : null}
    </View>
  );
};

export default Login;
