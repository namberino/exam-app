import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Appbar } from 'react-native-paper';
import axios from 'axios';

const ViewTestAnswers = ({ route, navigation }) => {
  const { testId } = route.params;
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchTestAnswers = async () => {
      try {
        const response = await axios.get(`http://192.168.1.203:5000/tests/${testId}`);
        setQuestions(response.data.questions);
      } catch (error) {
        console.error('Error fetching test answers', error);
      }
    };
    fetchTestAnswers();
  }, [testId]);

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Test Answers" />
      </Appbar.Header>
      <FlatList
        data={questions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.questionContent}>{item.content}</Text>
              {item.choices.map((choice, index) => (
                <Text key={index} style={choice.is_correct ? styles.correctAnswer : styles.answer}>
                  {choice.text}
                </Text>
              ))}
            </Card.Content>
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
  questionContent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
  },
  answer: {
    fontSize: 14,
    color: '#6C757D',
    paddingLeft: 10,
  },
  correctAnswer: {
    fontSize: 14,
    color: '#28A745',
    paddingLeft: 10,
  },
});

export default ViewTestAnswers;
