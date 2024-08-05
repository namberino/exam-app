import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const TestCreation = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://192.168.1.203:5000/questions');
        setQuestions(response.data);
      } catch (error) {
        setMessage('Error fetching questions');
      }
    };
    fetchQuestions();
  }, []);

  const handleSelectQuestion = (question) => {
    const isSelected = selectedQuestions.some(q => q._id === question._id);
    if (isSelected) {
      setSelectedQuestions(selectedQuestions.filter(q => q._id !== question._id));
    } else {
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };

  const handleCreateTest = async () => {
    try {
      const response = await axios.post('http://192.168.1.203:5000/tests', {
        questions: selectedQuestions.map(q => q._id)
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error creating test');
    }
  };

  const isSelected = (questionId) => selectedQuestions.some(q => q._id === questionId);

  return (
    <View style={styles.container}>
      <FlatList
        data={questions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelectQuestion(item)}
            style={[styles.questionItem, isSelected(item._id) && styles.selectedItem]}
          >
            <Text style={[styles.questionContent, isSelected(item._id) && styles.selectedContent]}>
              {item.content}
            </Text>
          </TouchableOpacity>
        )}
      />
      <Button title="Create Test" onPress={handleCreateTest} color="#28A745" />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  questionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CED4DA',
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedItem: {
    backgroundColor: '#E9ECEF',
  },
  questionContent: {
    fontSize: 16,
    color: '#212529',
  },
  selectedContent: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  message: {
    marginTop: 10,
    color: '#DC3545',
    textAlign: 'center',
  },
});

export default TestCreation;
