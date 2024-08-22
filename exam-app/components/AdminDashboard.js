import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert, Dimensions, useWindowDimensions } from 'react-native';
import { Button, Text, Appbar, Card } from 'react-native-paper';
import axios from 'axios';

const AdminDashboard = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [numColumns, setNumColumns] = useState(2);
  const { width } = useWindowDimensions();

  useEffect(() => {
    fetchUsers();
    updateLayout(width);
  }, [width]);

  useEffect(() => {
    updateLayout(width);
  }, [width]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://192.168.1.203:5000/users`);
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const suspendUser = async (userId) => {
    try {
      await axios.put(`http://192.168.1.203:5000/users/${userId}/suspend`);
      Alert.alert('Success', 'User account suspended');
      fetchUsers();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to suspend user account');
    }
  };

  const unsuspendUser = async (userId) => {
    try {
      await axios.put(`http://192.168.1.203:5000/users/${userId}/unsuspend`);
      Alert.alert('Success', 'User account unsuspended');
      fetchUsers();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to unsuspend user account');
    }
  };

  const updateLayout = (width) => {
    const newNumColumns = width > 600 ? 3 : 2; // Adjust based on your layout requirements
    setNumColumns(newNumColumns);
  };

  const renderUser = ({ item }) => (
    <View style={styles.cardContainer}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userType}>Type: {item.user_type}</Text>
          <View style={styles.statusContainer}>
            <Text style={styles.userStatusLabel}>Status:</Text>
            <Text
              style={[
                styles.userStatus,
                { color: item.suspended ? '#DC3545' : '#28A745' },
              ]}
            >
              {item.suspended ? 'Suspended' : 'Active'}
            </Text>
          </View>
          <Button
            mode="contained"
            onPress={() =>
              item.suspended ? unsuspendUser(item._id) : suspendUser(item._id)
            }
            style={styles.button}
          >
            {item.suspended ? 'Unsuspend' : 'Suspend'}
          </Button>
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Admin Dashboard" titleStyle={styles.appbarTitle} />
        <Appbar.Action icon="refresh" onPress={fetchUsers} />
      </Appbar.Header>
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item._id}
        numColumns={numColumns}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.content}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  appbar: {
    backgroundColor: '#2196F3', // Primary light blue for app bar
  },
  appbarTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  cardContainer: {
    flex: 1,
    marginBottom: 15,
  },
  card: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
    elevation: 3,
    marginHorizontal: 3,
    backgroundColor: '#BBDEFB',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  userType: {
    fontSize: 16,
    color: '#6C757D',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  userStatusLabel: {
    fontSize: 16,
    color: '#6C757D',
    marginRight: 5,
  },
  userStatus: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    marginVertical: 10,
    borderRadius: 4,
    backgroundColor: '#2196F3',
  },
});

export default AdminDashboard;
