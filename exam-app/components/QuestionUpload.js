import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

const QuestionUpload = () => {
  const [content, setContent] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [chapter, setChapter] = useState('');
  const [subject, setSubject] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [choices, setChoices] = useState([{ text: '', is_correct: false }]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch subjects from back end
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('http://192.168.1.203:5000/subjects');
        setSubjects(response.data);
      } catch (error) {
        console.error('Error fetching subjects', error);
      }
    };
    fetchSubjects();
  }, []);

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
        subject_id: subject, // Use the selected subject ID
        choices,
        correct_answer: correctAnswer
      });
      setMessage('Question uploaded successfully!');
      // Clear the form fields
      setContent('');
      setDifficulty('');
      setChapter('');
      setSubject('');
      setChoices([{ text: '', is_correct: false }]);
      setCorrectAnswer('');
    } catch (error) {
      setMessage('Error uploading question');
    }
  };

  const handleCSVUpload = async () => {
    try {
      // Pick the CSV file
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/csv',
      });

      if (result.type === 'success') {
        const fileUri = result.uri;
        const formData = new FormData();
        formData.append('file', {
          uri: fileUri,
          name: result.name,
          type: 'text/csv',
        });

        // Upload the file
        const response = await axios.post('http://192.168.1.203:5000/upload_csv', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setMessage('CSV uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading CSV', error);
      setMessage('Error uploading CSV');
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
      <Picker
        selectedValue={difficulty}
        onValueChange={(itemValue) => setDifficulty(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Difficulty" value="" />
        <Picker.Item label="Easy" value="Easy" />
        <Picker.Item label="Medium" value="Medium" />
        <Picker.Item label="Hard" value="Hard" />
      </Picker>
      <TextInput
        label="Chapter"
        value={chapter}
        onChangeText={setChapter}
        style={styles.input}
      />
      <Picker
        selectedValue={subject}
        onValueChange={(itemValue) => setSubject(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Subject" value="" />
        {subjects.map((subject) => (
          <Picker.Item key={subject._id} label={subject.name} value={subject._id} />
        ))}
      </Picker>
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
        Add
      </Button>
      <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
        Submit Question
      </Button>
      <Button mode="contained" onPress={handleCSVUpload} style={styles.csvButton}>
        Upload
      </Button>
      {message ? <Text style={styles.message}>{message}</Text> : null}
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
  picker: {
    marginBottom: 10,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    height: 50,
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
  csvButton: {
    marginVertical: 10,
  },
  message: {
    marginTop: 10,
    color: '#28D46A',
    textAlign: 'center',
  },
});

export default QuestionUpload;
