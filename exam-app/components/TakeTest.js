import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
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

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const submitTest = async () => {
    try {
      const response = await axios.post(`http://192.168.1.203:5000/tests/${testId}/submit`, { answers });
      const { score } = response.data;
      navigation.navigate('Home', { score });
    } catch (error) {
      setMessage('Error submitting test');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {message ? <Text>{message}</Text> : null}
      <FlatList
        data={questions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.content}</Text>
            <TextInput
              placeholder="Your answer"
              onChangeText={(text) => handleAnswerChange(item._id, text)}
            />
          </View>
        )}
      />
      <Button title="Submit Test" onPress={submitTest} />
    </View>
  );
};

export default TakeTest;
