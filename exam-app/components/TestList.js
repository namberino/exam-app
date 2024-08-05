import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const TestList = ({ navigation }) => {
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

  return (
    <View style={styles.container}>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <FlatList
        data={tests}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.testItem}>
            <Text style={styles.testId}>Test ID: {item._id}</Text>
            <Text style={styles.questionCount}>Questions: {item.questions.length}</Text>
            <Button title="Take Test" onPress={() => navigation.navigate('TakeTest', { testId: item._id })} color="#007BFF" />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: '#F8F9FA',
    },
    testItem: {
      marginBottom: 20,
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#CED4DA',
    },
    testId: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#212529',
    },
    questionCount: {
      fontSize: 14,
      color: '#6C757D',
    },
    message: {
      marginBottom: 10,
      color: '#DC3545',
      textAlign: 'center',
    },
});

export default TestList;
