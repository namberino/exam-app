import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Button, Text, Appbar } from 'react-native-paper';
import axios from 'axios';
import Constants from 'expo-constants';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [baseURL, setBaseURL] = useState('');

  useEffect(() => {
    const fetchExpoURL = () => {
      let apiURL = '';

      if (Constants.manifest && Constants.manifest.debuggerHost) {
        // Extract IP from the debuggerHost (development mode)
        const expoURL = Constants.manifest.debuggerHost.split(':')[0];
        apiURL = `http://${expoURL}:5000`;
      } else if (Constants.manifest2?.extra?.expoGo?.debuggerHost) {
        // Extract IP from the debuggerHost (new manifest version)
        const expoURL = Constants.manifest2.extra.expoGo.debuggerHost.split(':')[0];
        apiURL = `http://${expoURL}:5000`;
      } else {
        // Fallback IP address for production or undefined scenarios
        apiURL = 'http://localhost:5000'; // You can change this to a default production API URL
      }

      setBaseURL(apiURL);
    };

    fetchExpoURL();
  }, []);

  useEffect(() => {
    if (baseURL) {
      fetchUsers();
    }
  }, [baseURL]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${baseURL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const suspendUser = async (userId) => {
    try {
      await axios.put(`${baseURL}/users/${userId}/suspend`);
      Alert.alert('Success', 'User account suspended');
      fetchUsers();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to suspend user account');
    }
  };

  const unsuspendUser = async (userId) => {
    try {
      await axios.put(`${baseURL}/users/${userId}/unsuspend`);
      Alert.alert('Success', 'User account unsuspended');
      fetchUsers();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to unsuspend user account');
    }
  };

  const renderUser = ({ item }) => (
    <View style={styles.userContainer}>
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userType}>Type: {item.user_type}</Text>
      <View style={styles.statusContainer}>
        <Text style={styles.userStatusLabel}>Status:</Text>
        <Text
          style={[
            styles.userStatus,
            { color: item.suspended ? 'red' : 'green' },
          ]}
        >
          {item.suspended ? 'Suspended' : 'Active'}
        </Text>
      </View>

      {item.suspended ? (
        <Button mode="contained" onPress={() => unsuspendUser(item._id)} style={styles.button}>
          Unsuspend
        </Button>
      ) : (
        <Button mode="contained" onPress={() => suspendUser(item._id)} style={styles.button}>
          Suspend
        </Button>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Admin Dashboard" />
      </Appbar.Header>
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.content}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  userContainer: {
    marginBottom: 20,
    padding: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userType: {
    fontSize: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userStatusLabel: {
    fontSize: 16,
    marginRight: 5,
  },
  userStatus: {
    fontSize: 16,
  },
  button: {
    marginTop: 10,
  },
});

export default AdminDashboard;
