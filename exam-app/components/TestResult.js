import React, { useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Appbar, Button, IconButton } from 'react-native-paper';
import { UserContext } from './UserContext';

const TestResult = ({ route, navigation }) => {
  const { score, correctAnswers, totalQuestions } = route.params;
  const { user } = useContext(UserContext);

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content title="Test Result" titleStyle={styles.appbarTitle} />
      </Appbar.Header>
      <View style={styles.resultContainer}>
        <IconButton
          icon="trophy"
          size={80}
          color="#FFD700"
          style={styles.trophyIcon}
        />
        <Text style={styles.resultText}>Your Score</Text>
        <Text style={styles.score}>{score}</Text>
        <Text style={styles.correctAnswersText}>
           {correctAnswers} / {totalQuestions} correct answers
        </Text>
        <Button mode="contained" onPress={() => navigation.navigate('TestList')} style={styles.button}>
          Back to Test List
        </Button>
      </View>
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
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  trophyIcon: {
    marginBottom: 20,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    // marginBottom: 10,
  },
  score: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#28A745',
    marginVertical: 20,
  },
  correctAnswersText: {
    fontSize: 18,
    color: '#212529',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    marginTop: 20,
    paddingHorizontal: 30,
    borderRadius: 8,
    backgroundColor: '#2196F3',
  },
});

export default TestResult;
