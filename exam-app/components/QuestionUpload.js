import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
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
    <ScrollView style={{ padding: 20 }}>
      <Text>Question Content:</Text>
      <TextInput
        placeholder="Enter question content"
        value={content}
        onChangeText={setContent}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />

      <Text>Difficulty:</Text>
      <TextInput
        placeholder="Enter difficulty level"
        value={difficulty}
        onChangeText={setDifficulty}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />

      <Text>Chapter:</Text>
      <TextInput
        placeholder="Enter chapter"
        value={chapter}
        onChangeText={setChapter}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />

      <Text>Subject:</Text>
      <TextInput
        placeholder="Enter subject"
        value={subject}
        onChangeText={setSubject}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />

      {choices.map((choice, index) => (
        <View key={index} style={{ marginBottom: 10 }}>
          <Text>Choice {index + 1}:</Text>
          <TextInput
            placeholder="Enter choice text"
            value={choice.text}
            onChangeText={(text) => handleChoiceChange(index, text)}
            style={{ borderBottomWidth: 1, marginBottom: 5 }}
          />
          <Button
            title={`Set Choice ${index + 1} as Correct`}
            onPress={() => handleChoiceCorrectnessChange(index, true)}
            color={choice.is_correct ? 'green' : 'blue'}
          />
        </View>
      ))}

      <Button title="Add Choice" onPress={addChoice} />
      <Button title="Submit Question" onPress={handleSubmit} />
    </ScrollView>
  );
};

export default QuestionUpload;
