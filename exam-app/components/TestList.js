import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
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
        const response = await axios.get('http://192.168.1.203:5000/tests');
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
      navigation.navigate('ViewTestAnswers', { testId });
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
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
          <TouchableOpacity onPress={() => handlePress(item._id)}>
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.testTitle}>ID: {item.name}</Text>
                <Text style={styles.testDescription}>
                  Number of questions: {item.questions.length}
                </Text>
              </Card.Content>
              <Card.Actions>
                <IconButton icon="chevron-right" size={20} />
              </Card.Actions>
            </Card>
          </TouchableOpacity>
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
    color: '#DC3545',
    textAlign: 'center',
  },
});

export default TestList;
