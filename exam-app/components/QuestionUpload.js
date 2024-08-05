import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import axios from 'axios';

const QuestionUpload = () => {
  const [content, setContent] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [chapter, setChapter] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateQuestion = async () => {
    try {
      const response = await axios.post('http://192.168.1.203:5000/questions', {
        content,
        difficulty,
        chapter,
        subject
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Content" value={content} onChangeText={setContent} />
      <TextInput placeholder="Difficulty" value={difficulty} onChangeText={setDifficulty} />
      <TextInput placeholder="Chapter" value={chapter} onChangeText={setChapter} />
      <TextInput placeholder="Subject" value={subject} onChangeText={setSubject} />
      <Button title="Create Question" onPress={handleCreateQuestion} />
      {message ? <Text>{message}</Text> : null}
    </View>
  );
};

export default QuestionUpload;
