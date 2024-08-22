import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button, Text, Appbar, IconButton } from 'react-native-paper';
import axios from 'axios';
import Constants from 'expo-constants';

const QuestionManager = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
        try {
            const response = await axios.get(`http://192.168.1.203:5000/questions`);
            const questionsData = response.data;
            setQuestions(questionsData);
            setFilteredQuestions(questionsData);

            const uniqueChapters = [...new Set(questionsData.map(q => q.chapter))];
            const uniqueSubjects = [...new Set(questionsData.map(q => q.subject))];
            const uniqueDifficulties = ['Easy', 'Medium', 'Hard'];

            setChapters(uniqueChapters);
            setSubjects(uniqueSubjects);
            setDifficulties(uniqueDifficulties);
        } catch (error) {
            console.error('Error fetching questions', error);
        }
    };
    fetchQuestions();
  }, []);

  const filterQuestions = () => {
    let filtered = questions;
    if (selectedChapter) {
      filtered = filtered.filter(q => q.chapter === selectedChapter);
    }
    if (selectedSubject) {
      filtered = filtered.filter(q => q.subject === selectedSubject);
    }
    if (selectedDifficulty) {
      filtered = filtered.filter(q => q.difficulty === selectedDifficulty);
    }
    setFilteredQuestions(filtered);
  };

  useEffect(() => {
    filterQuestions();
  }, [selectedChapter, selectedSubject, selectedDifficulty]);

  const openEditModal = (question) => {
    setCurrentQuestion({ ...question });
    setEditModalVisible(true);
  };

  const handleSaveQuestion = async () => {
    try {
      await axios.put(`http://192.168.1.203:5000/questions/${currentQuestion._id}`, currentQuestion);
      setEditModalVisible(false);
      filterQuestions();
    } catch (error) {
      console.error('Error saving question', error);
    }
  };

  const handleChoiceChange = (index, newChoice) => {
    if (currentQuestion && currentQuestion.choices) {
      const updatedChoices = [...currentQuestion.choices];
      updatedChoices[index].text = newChoice;
      setCurrentQuestion({ ...currentQuestion, choices: updatedChoices });
    }
  };

  const handleChoiceCorrectnessChange = (index, isCorrect) => {
    if (currentQuestion && currentQuestion.choices) {
      const updatedChoices = currentQuestion.choices.map((choice, i) => ({
        ...choice,
        is_correct: i === index ? isCorrect : false
      }));
      setCurrentQuestion({ ...currentQuestion, choices: updatedChoices });
    }
  };

  const clearFilters = () => {
    setSelectedChapter('');
    setSelectedSubject('');
    setSelectedDifficulty('');
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Question Manager" />
      </Appbar.Header>
      <View style={styles.filterContainer}>
        <Picker
          selectedValue={selectedChapter}
          onValueChange={(itemValue) => setSelectedChapter(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Filter by Chapter" value="" />
          {chapters.map((chapter, index) => (
            <Picker.Item key={index} label={chapter} value={chapter} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedSubject}
          onValueChange={(itemValue) => setSelectedSubject(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Filter by Subject" value="" />
          {subjects.map((subject, index) => (
            <Picker.Item key={index} label={subject} value={subject} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedDifficulty}
          onValueChange={(itemValue) => setSelectedDifficulty(itemValue)}
          style={styles.ppicker}
        >
          <Picker.Item label="Filter by Difficulty" value="" />
          {difficulties.map((difficulty, index) => (
            <Picker.Item key={index} label={difficulty} value={difficulty} />
          ))}
        </Picker>

        <Button mode="contained" onPress={clearFilters} style={styles.clearButton}>
          Clear Filters
        </Button>
      </View>

      <FlatList
        data={filteredQuestions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openEditModal(item)}>
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>{item.content}</Text>
              <Text style={styles.questionDetail}>Chapter: {item.chapter}</Text>
              <Text style={styles.questionDetail}>Subject: {item.subject}</Text>
              <Text style={styles.questionDetail}>Difficulty: {item.difficulty}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal visible={editModalVisible} animationType="slide">
        <ScrollView style={styles.modalContainer}>
          <TextInput
            label="Question Content"
            value={currentQuestion?.content || ''}
            onChangeText={(text) => setCurrentQuestion({ ...currentQuestion, content: text })}
            style={styles.input}
          />

          <Picker
            selectedValue={currentQuestion?.difficulty || ''}
            onValueChange={(itemValue) => setCurrentQuestion({ ...currentQuestion, difficulty: itemValue })}
            style={styles.picker}
          >
            <Picker.Item label="Select Difficulty" value="" />
            <Picker.Item label="Easy" value="Easy" />
            <Picker.Item label="Medium" value="Medium" />
            <Picker.Item label="Hard" value="Hard" />
          </Picker>

          <TextInput
            label="Chapter"
            value={currentQuestion?.chapter || ''}
            onChangeText={(text) => setCurrentQuestion({ ...currentQuestion, chapter: text })}
            style={styles.input}
          />

          <Picker
            selectedValue={currentQuestion?.subject || ''}
            onValueChange={(itemValue) => setCurrentQuestion({ ...currentQuestion, subject: itemValue })}
            style={styles.picker}
          >
            <Picker.Item label="Select Subject" value="" />
            {subjects.map((subject, index) => (
              <Picker.Item key={index} label={subject} value={subject} />
            ))}
          </Picker>

          {currentQuestion?.choices?.map((choice, index) => (
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

          <Button mode="contained" onPress={handleSaveQuestion} style={styles.saveButton}>
            Save Changes
          </Button>

          <Button mode="contained" onPress={() => setEditModalVisible(false)} style={styles.cancelButton}>
            Cancel
          </Button>
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  filterContainer: {
    padding: 10,
    backgroundColor: '#FFF',
  },
  picker: {
    marginBottom: 10,
  },
  questionContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#E9ECEF',
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  questionDetail: {
    fontSize: 14,
    color: '#6C757D',
  },
  modalContainer: {
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
  saveButton: {
    marginVertical: 10,
  },
  cancelButton: {
    marginVertical: 10,
  },
  clearButton: {
    marginTop: 10,
  },
});

export default QuestionManager;
