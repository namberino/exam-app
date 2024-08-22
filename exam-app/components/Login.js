import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Appbar } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import Constants from 'expo-constants';
import { UserContext } from './UserContext';

const Login = ({ navigation }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [userType, setUserType] = useState('student');
  const [isRegistering, setIsRegistering] = useState(false);
  const { setUser } = useContext(UserContext);
  const [baseURL, setBaseURL] = useState('');

  useEffect(() => {
    const fetchExpoURL = () => {
      let apiURL = '';

      if (Constants.manifest && Constants.manifest.debuggerHost) {
        const expoURL = Constants.manifest.debuggerHost.split(':')[0];
        apiURL = `http://${expoURL}:5000`;
      } else if (Constants.manifest2?.extra?.expoGo?.debuggerHost) {
        const expoURL = Constants.manifest2.extra.expoGo.debuggerHost.split(':')[0];
        apiURL = `http://${expoURL}:5000`;
      } else {
        apiURL = 'http://localhost:5000';
      }

      setBaseURL(apiURL);
    };

    fetchExpoURL();
  }, []);

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${baseURL}/register`, {
        name,
        password,
        user_type: userType
      });
      console.log('Register response:', response);
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
      const response = await axios.post(`${baseURL}/login`, { name, password });
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
      <Appbar.Header>
        <Appbar.Content title={isRegistering ? 'Register' : 'Login'} />
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
          <Button mode="contained" onPress={handleRegister} style={styles.button}>
            Create Account
          </Button>
        )}

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
  picker: {
    marginBottom: 10,
  },
});

export default Login;
