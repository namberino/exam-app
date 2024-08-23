import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, Appbar, IconButton } from 'react-native-paper';
import axios from 'axios';
import { UserContext } from './UserContext';

const TestList = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [tests, setTests] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get(`http://192.168.1.203:5000/tests?user_id=${user.userId}`);
        setTests(response.data);
      } catch (error) {
        setMessage('Error fetching tests');
      }
    };
    fetchTests();
  }, []);

  const handlePress = (testId) => {
    if (user.userType === 'student') {
      navigation.navigate('TakeTest', { testId });
    } else if (user.userType === 'teacher') {
      Alert.alert(
        'Choose Action',
        'What would you like to do?',
        [
          {
            text: 'View Answers',
            onPress: () => navigation.navigate('ViewTestAnswers', { testId }),
          },
          {
            text: 'View Scores',
            onPress: () => navigation.navigate('ViewTestScores', { testId }),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    }
  };

  const handleDelete = async (testId) => {
    try {
      await axios.delete(`http://192.168.1.203:5000/tests/${testId}?user_id=${user.userId}`);
      setTests(tests.filter(test => test._id !== testId));
      setMessage('Test deleted successfully');
    } catch (error) {
      console.error('Error deleting test', error);
      setMessage('Error deleting test');
    }
  };

  const confirmDelete = (testId) => {
    Alert.alert(
      'Delete Test',
      'Are you sure you want to delete this test?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => handleDelete(testId) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>  
        <Appbar.Header style={styles.appbar}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Test List" titleStyle={styles.appbarTitle} />

          {user.userType === 'teacher' && (
            <Appbar.Action
              icon="plus-circle-outline"
              onPress={() => navigation.navigate('TestCreation')}
              color="#fff"
            />
          )}
        </Appbar.Header>
      </View>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <FlatList
        data={tests}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <TouchableOpacity onPress={() => handlePress(item._id)}>
              <Card.Content>
                <Text style={styles.testTitle}>{item.name}</Text>
                <Text style={styles.testDescription}>
                  {item.questions.length} Questions
                </Text>
              </Card.Content>
            </TouchableOpacity>
            {user.userType === 'teacher' && (
              <Card.Actions>
                <IconButton
                  icon="delete-outline"
                  size={24}
                  onPress={() => confirmDelete(item._id)}
                  color="#FF5252"
                />
              </Card.Actions>
            )}
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  appbar: {
    backgroundColor: '#2196F3', // Primary light blue for app bar
  },
  appbarTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerWrapper: {
    marginHorizontal: -16,
    marginVertical: -16,
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 3,
    backgroundColor: '#BBDEFB',
  },
  testTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  testDescription: {
    fontSize: 14,
    color: '#6C757D',
  },
  message: {
    marginVertical: 10,
    color: '#28A745',
    textAlign: 'center',
  },
});

export default TestList;
