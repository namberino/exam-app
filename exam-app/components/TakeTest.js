import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Text, Button, Appbar, IconButton } from 'react-native-paper';
import axios from 'axios';
import { UserContext } from './UserContext';

const TakeTest = ({ route, navigation }) => {
  const { testId } = route.params;
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState('');
  const { user } = useContext(UserContext);
  const user_id = user.userId;

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

    let correctAnswers = 0;
    questions.forEach((question) => {
      const correctChoice = question.choices.find(choice => choice.is_correct);
      if (answers[question._id] === correctChoice.text) {
        correctAnswers += 1;
      }
    });

    const totalQuestions = questions.length;
    const score = (correctAnswers / totalQuestions) * 100;

    try {
      await axios.post(`http://192.168.1.203:5000/tests/${testId}/submit`, { answers, user_id, score });
      navigation.navigate('TestResult', { score, correctAnswers, totalQuestions });
    } catch (error) {
      setMessage('Error submitting test');
    }
  };

  const renderItem = ({ item }) => (
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
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Take Test" titleStyle={styles.appbarTitle} />
        <IconButton
          icon="help-circle"
          size={24}
          onPress={() => Alert.alert('Help', 'Select the correct answer for each question.')}
        />
      </Appbar.Header>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <FlatList
        data={questions}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      <Button mode="contained" onPress={submitTest} style={styles.submitButton}>
        Submit Test
      </Button>
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
  list: {
    padding: 16,
  },
  questionContainer: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#BBDEFB',
    elevation: 2,
  },
  questionContent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 10,
  },
  choice: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
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
  submitButton: {
    marginHorizontal: 10,
    marginBottom: 5,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#2196F3',
  },
  message: {
    margin: 10,
    color: '#DC3545',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default TakeTest;
