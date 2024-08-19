import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Button, Text, Appbar } from 'react-native-paper';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://192.168.1.203:5000/users');  // Adjust the URL as needed
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const suspendUser = async (userId) => {
    try {
      await axios.put(`http://192.168.1.203:5000/users/${userId}/suspend`);
      Alert.alert('Success', 'User account suspended');
      fetchUsers();  // Refresh the list after suspending the user
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to suspend user account');
    }
  };

  const unsuspendUser = async (userId) => {
    try {
      await axios.put(`http://192.168.1.203:5000/users/${userId}/unsuspend`);
      Alert.alert('Success', 'User account unsuspended');
      fetchUsers();  // Refresh the list after suspending the user
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
