import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Button, Text, Appbar, List } from 'react-native-paper';
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

  const renderItem = ({ item }) => (
    <List.Item
      title={item.name}
      description={`User Type: ${item.user_type}`}
      right={() => (
        <Button
          mode="contained"
          onPress={() => suspendUser(item._id)}
          style={styles.suspendButton}
        >
          Suspend
        </Button>
      )}
    />
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Admin Dashboard" />
      </Appbar.Header>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 20,
  },
  suspendButton: {
    marginLeft: 10,
  },
});

export default AdminDashboard;
