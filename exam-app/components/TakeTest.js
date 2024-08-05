import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const TakeTest = ({ route, navigation }) => {
  const { testId } = route.params;
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get(`http://192.168.1.203:5000/tests/${testId}`);
        setQuestions(response.data.questions);
      } catch (error) {
        setMessage('Error fetching test questions');
      }
    };
    fetchTest();
  }, [testId]);

  const handleChoiceSelect = (questionId, choiceText) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: choiceText
    }));
  };

  const submitTest = async () => {
    const unansweredQuestions = questions.filter(q => !answers[q._id]);

    if (unansweredQuestions.length > 0) {
      Alert.alert(
        'Incomplete',
        `Please answer the following questions:\n${unansweredQuestions.map(q => q.content).join('\n')}`,
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      const response = await axios.post(`http://192.168.1.203:5000/tests/${testId}/submit`, { answers });
      const { score } = response.data;
      navigation.navigate('TestResult', { score });
    } catch (error) {
      setMessage('Error submitting test');
    }
  };

  return (
    <View style={styles.container}>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <FlatList
        data={questions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.questionContainer}>
            <Text style={styles.questionContent}>{item.content}</Text>
            {item.choices.map((choice, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleChoiceSelect(item._id, choice.text)}
                style={styles.choice}
              >
                <Text style={answers[item._id] === choice.text ? styles.selectedChoice : styles.choiceText}>
                  {choice.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      />
      <Button title="Submit Test" onPress={submitTest} color="#28A745" />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: '#F8F9FA',
    },
    questionContainer: {
      marginBottom: 20,
    },
    questionContent: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#212529',
    },
    choice: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#CED4DA',
    },
    choiceText: {
      fontSize: 16,
      color: '#212529',
    },
    selectedChoice: {
      fontSize: 16,
      color: '#28A745',
      fontWeight: 'bold',
    },
    message: {
      marginBottom: 10,
      color: '#DC3545',
      textAlign: 'center',
    },
});

export default TakeTest;
