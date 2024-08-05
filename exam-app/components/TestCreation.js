import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';

const TestCreation = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await axios.get('http://192.168.1.203:5000/questions');
      setQuestions(response.data);
    };
    fetchQuestions();
  }, []);

  const handleSelectQuestion = (question) => {
    setSelectedQuestions([...selectedQuestions, question]);
  };

  const handleCreateTest = async () => {
    try {
      const response = await axios.post('http://192.168.1.203:5000/tests', {
        questions: selectedQuestions.map(q => q._id)
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <FlatList
        data={questions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectQuestion(item)}>
            <Text>{item.content}</Text>
          </TouchableOpacity>
        )}
      />
      <Button title="Create Test" onPress={handleCreateTest} />
      {message ? <Text>{message}</Text> : null}
    </View>
  );
};

export default TestCreation;
