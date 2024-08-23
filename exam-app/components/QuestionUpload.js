import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, IconButton, Appbar } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons'; // Import icons

const QuestionUpload = ({ navigation }) => {
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

  const removeChoice = (index) => {
    setChoices(choices.filter((_, i) => i !== index));
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
    <>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Question Upload" titleStyle={styles.appbarTitle} />
      </Appbar.Header>
      <ScrollView style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            label="Question Content"
            value={content}
            onChangeText={setContent}
            style={styles.input}
            mode="outlined"
            // left={<TextInput.Icon name={() => <MaterialIcons name="question-answer" size={20} color="#0D47A1" />} />}
          />
        </View>
        <View style={styles.pickerContainer}>
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
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            label="Chapter"
            value={chapter}
            onChangeText={setChapter}
            style={styles.input}
            mode="outlined"
            // left={<TextInput.Icon name={() => <MaterialIcons name="chapter" size={20} color="#0D47A1" />} />}
          />
        </View>
        <View style={styles.pickerContainer}>
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
        </View>
        {choices.map((choice, index) => (
          <View key={index} style={styles.choiceContainer}>
            <TextInput
              label={`Choice ${index + 1}`}
              value={choice.text}
              onChangeText={(text) => handleChoiceChange(index, text)}
              style={styles.choiceInput}
              mode="outlined"
            //   left={<TextInput.Icon name={() => <MaterialIcons name="check-box-outline-blank" size={20} color="#0D47A1" />} />}
            />
            <View style={styles.choiceActions}>
              <IconButton
                icon={choice.is_correct ? 'check-circle' : 'circle'}
                color={choice.is_correct ? '#4CAF50' : '#B0BEC5'}
                size={24}
                onPress={() => handleChoiceCorrectnessChange(index, !choice.is_correct)}
              />
              <IconButton
                icon="delete"
                color="#F44336"
                size={24}
                onPress={() => removeChoice(index)}
              />
            </View>
          </View>
        ))}
        <Button
          mode="contained"
          onPress={addChoice}
          style={styles.addButton}
          icon={() => <MaterialIcons name="add" size={20} color="#FFFFFF" />}
        >
          Choice
        </Button>
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          icon={() => <MaterialIcons name="send" size={20} color="#FFFFFF" />}
        >
          Submit Question
        </Button>
        <Button
          mode="contained"
          onPress={handleCSVUpload}
          style={styles.csvButton}
          icon={() => <MaterialIcons name="file-upload" size={20} color="#FFFFFF" />}
        >
          CSV
        </Button>
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  appbar: {
    backgroundColor: '#2196F3', // Dark blue to match home page
  },
  appbarTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 15,
  },
  pickerContainer: {
    marginBottom: 15,
    backgroundColor: '#B3E5FC', // Light blue background for Picker
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#0D47A1',
  },
  input: {
    backgroundColor: '#B3E5FC', // Light blue background
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  picker: {
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
    backgroundColor: '#B3E5FC', // Light blue background
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  choiceActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    marginVertical: 10,
    backgroundColor: '#2196F3', // Darker green for Add button
  },
  submitButton: {
    marginVertical: 20,
    backgroundColor: '#2196F3', // Dark blue for Submit button
  },
  csvButton: {
    marginVertical: 10,
    backgroundColor: '#2196F3', // Red for CSV Upload button
  },
  message: {
    marginTop: 10,
    color: '#4CAF50', // Green for success message
    textAlign: 'center',
  },
});

export default QuestionUpload;
