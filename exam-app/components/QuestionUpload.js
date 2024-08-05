import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
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
      <Text style={styles.label}>Question Content:</Text>
      <TextInput
        placeholder="Enter question content"
        value={content}
        onChangeText={setContent}
        style={styles.input}
      />

      <Text style={styles.label}>Difficulty:</Text>
      <TextInput
        placeholder="Enter difficulty level"
        value={difficulty}
        onChangeText={setDifficulty}
        style={styles.input}
      />

      <Text style={styles.label}>Chapter:</Text>
      <TextInput
        placeholder="Enter chapter"
        value={chapter}
        onChangeText={setChapter}
        style={styles.input}
      />

      <Text style={styles.label}>Subject:</Text>
      <TextInput
        placeholder="Enter subject"
        value={subject}
        onChangeText={setSubject}
        style={styles.input}
      />

      {choices.map((choice, index) => (
        <View key={index} style={styles.choiceContainer}>
          <Text style={styles.label}>Choice {index + 1}:</Text>
          <TextInput
            placeholder="Enter choice text"
            value={choice.text}
            onChangeText={(text) => handleChoiceChange(index, text)}
            style={styles.input}
          />
          <Button
            title={`Set Choice ${index + 1} as Correct`}
            onPress={() => handleChoiceCorrectnessChange(index, true)}
            color={choice.is_correct ? '#28A745' : '#007BFF'}
          />
        </View>
      ))}

      <Button title="Add Choice" onPress={addChoice} color="#007BFF" />
      <Button title="Submit Question" onPress={handleSubmit} color="#28A745" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: '#F8F9FA',
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#212529',
    },
    input: {
      height: 40,
      borderColor: '#CED4DA',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 10,
      backgroundColor: '#FFFFFF',
    },
    choiceContainer: {
      marginBottom: 20,
    },
});

export default QuestionUpload;
