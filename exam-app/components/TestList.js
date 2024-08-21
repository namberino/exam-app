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
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Test List" />
        {user.userType === 'teacher' && (
          <Appbar.Action icon="plus" onPress={() => navigation.navigate('TestCreation')} />
        )}
      </Appbar.Header>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <FlatList
        data={tests}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <TouchableOpacity onPress={() => handlePress(item._id)}>
              <Card.Content>
                <Text style={styles.testTitle}>ID: {item.name}</Text>
                <Text style={styles.testDescription}>
                  Number of questions: {item.questions.length}
                </Text>
              </Card.Content>
            </TouchableOpacity>
            {user.userType === 'teacher' && (
              <Card.Actions>
                <IconButton
                  icon="delete"
                  size={20}
                  onPress={() => confirmDelete(item._id)}
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
    backgroundColor: '#F8F9FA',
  },
  card: {
    margin: 10,
    borderRadius: 8,
    elevation: 3,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  testDescription: {
    fontSize: 14,
    color: '#6C757D',
  },
  message: {
    margin: 10,
    color: '#28A745',
    textAlign: 'center',
  },
});

export default TestList;
