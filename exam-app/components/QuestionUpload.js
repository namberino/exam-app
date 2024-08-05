import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
import axios from 'axios';

const QuestionUpload = () => {
  const [content, setContent] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [chapter, setChapter] = useState('');
  const [subject, setSubject] = useState('');
  const [choices, setChoices] = useState([{ text: '', is_correct: false }]);
  const [correctAnswer, setCorrectAnswer] = useState('');

  const handleChoiceChange = (index, text) => {
    const newChoices = [...choices];
    newChoices[index].text = text;
    setChoices(newChoices);
  };

  const handleChoiceCorrectnessChange = (index, isCorrect) => {
    const newChoices = choices.map((choice, i) => ({
      ...choice,
      is_correct: i === index ? isCorrect : false
    }));
    setChoices(newChoices);
    setCorrectAnswer(choices[index].text); // Set the correct answer
  };

  const addChoice = () => {
    setChoices([...choices, { text: '', is_correct: false }]);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://192.168.1.203:5000/questions', {
        content,
        difficulty,
        chapter,
        subject,
        choices,
        correct_answer: correctAnswer
      });
      alert('Question uploaded successfully!');
    } catch (error) {
      alert('Error uploading question');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Question Content"
        value={content}
        onChangeText={setContent}
        style={styles.input}
      />
      <TextInput
        label="Difficulty"
        value={difficulty}
        onChangeText={setDifficulty}
        style={styles.input}
      />
      <TextInput
        label="Chapter"
        value={chapter}
        onChangeText={setChapter}
        style={styles.input}
      />
      <TextInput
        label="Subject"
        value={subject}
        onChangeText={setSubject}
        style={styles.input}
      />
      {choices.map((choice, index) => (
        <View key={index} style={styles.choiceContainer}>
          <TextInput
            label={`Choice ${index + 1}`}
            value={choice.text}
            onChangeText={(text) => handleChoiceChange(index, text)}
            style={styles.choiceInput}
          />
          <IconButton
            icon={choice.is_correct ? 'check-circle' : 'circle'}
            color={choice.is_correct ? '#28A745' : '#212529'}
            size={24}
            onPress={() => handleChoiceCorrectnessChange(index, !choice.is_correct)}
          />
        </View>
      ))}
      <Button mode="contained" onPress={addChoice} style={styles.addButton}>
        Add Question
      </Button>
      <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
        Submit Question
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: '#F8F9FA',
    },
    input: {
      marginBottom: 10,
    },
    choiceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    choiceInput: {
      flex: 1,
      marginRight: 10,
    },
    addButton: {
      marginVertical: 10,
    },
    submitButton: {
      marginVertical: 20,
    },
});

export default QuestionUpload;
