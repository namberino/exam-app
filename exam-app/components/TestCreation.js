import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Button, Text, Appbar } from 'react-native-paper';
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
      <Appbar.Header>
        <Appbar.Content title="Create Test" />
      </Appbar.Header>
      <FlatList
        data={questions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelectQuestion(item)}
            style={[
              styles.questionItem,
              selectedQuestions.includes(item) && styles.selectedQuestion
            ]}
          >
            <Text style={styles.questionContent}>{item.content}</Text>
          </TouchableOpacity>
        )}
      />
      <Button mode="contained" onPress={handleCreateTest} style={styles.button}>
        Create Test
      </Button>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8F9FA',
    },
    questionItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#CED4DA',
    },
    selectedQuestion: {
      backgroundColor: '#E9F5E9',
    },
    questionContent: {
      fontSize: 16,
      color: '#212529',
    },
    button: {
      margin: 20,
    },
    message: {
      marginTop: 10,
      color: '#DC3545',
      textAlign: 'center',
    },
});

export default TestCreation;
