import React, { useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Appbar } from 'react-native-paper';
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
      <Appbar.Header>
        <Appbar.Content title="Login" />
      </Appbar.Header>
      <View style={styles.content}>
        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <Button mode="contained" onPress={handleLogin} style={styles.button}>
          Login
        </Button>
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      padding: 20,
      flex: 1,
      justifyContent: 'center',
    },
    input: {
      marginBottom: 10,
    },
    button: {
      marginTop: 10,
    },
    message: {
      marginTop: 10,
      color: '#28D46A',
      textAlign: 'center',
    },
});

export default Login;
