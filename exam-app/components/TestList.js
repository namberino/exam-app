import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
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
    <View style={{ padding: 20 }}>
      {message ? <Text>{message}</Text> : null}
      <FlatList
        data={tests}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View>
            <Text>Test ID: {item._id}</Text>
            <Text>Questions: {item.questions.length}</Text>
            <Button title="Take Test" onPress={() => navigation.navigate('TakeTest', { testId: item._id })} />
          </View>
        )}
      />
    </View>
  );
};

export default TestList;
