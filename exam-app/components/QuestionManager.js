import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, ScrollView, LayoutAnimation, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button, Text, Appbar, Card, IconButton } from 'react-native-paper';
import axios from 'axios';
import Constants from 'expo-constants';
import { MaterialIcons } from '@expo/vector-icons'; // Import Material Icons

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
  const [filtersVisible, setFiltersVisible] = useState(true); // State to toggle filters

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://192.168.1.203:5000/questions');
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
    setFilteredQuestions(questions); // Reset the filtered questions to the full list
  };

  const toggleFilters = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFiltersVisible(!filtersVisible);
  };

  const handleDeleteQuestion = async (id) => {
    Alert.alert(
      'Delete Question',
      'Are you sure you want to delete this question?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await axios.delete(`http://192.168.1.203:5000/questions/${id}`);
              setQuestions(prevQuestions => prevQuestions.filter(q => q._id !== id));
              setFilteredQuestions(prevFilteredQuestions => prevFilteredQuestions.filter(q => q._id !== id));
            } catch (error) {
              console.error('Error deleting question', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Question Manager" titleStyle={styles.appbarTitle} />
        <Appbar.Action 
          icon={filtersVisible ? "filter-outline" : "filter-remove-outline"} 
          onPress={toggleFilters} 
        />
      </Appbar.Header>

      {filtersVisible && (
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
            style={styles.picker}
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
      )}

      <FlatList
        data={filteredQuestions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openEditModal(item)}>
            <Card style={styles.questionCard}>
              <Card.Content>
                <Text style={styles.questionText}>{item.content}</Text>
                <Text style={styles.questionDetail}>Chapter: {item.chapter}</Text>
                <Text style={styles.questionDetail}>Subject: {item.subject}</Text>
                <Text style={styles.questionDetail}>Difficulty: {item.difficulty}</Text>
              </Card.Content>
              <Card.Actions>
                <IconButton
                  icon="pencil"
                  color="#0D47A1"
                  size={24}
                  onPress={() => openEditModal(item)}
                />
                <IconButton
                  icon="delete"
                  color="#FF5252"
                  size={24}
                  onPress={() => handleDeleteQuestion(item._id)}
                />
              </Card.Actions>
            </Card>
          </TouchableOpacity>
        )}
      />

      <Modal visible={editModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Appbar.Header style={styles.modalAppbar}>
            <Appbar.BackAction onPress={() => setEditModalVisible(false)} />
            <Appbar.Content title="Edit Question" titleStyle={styles.modalTitle} />
          </Appbar.Header>

          <ScrollView style={styles.modalBody}>
            <TextInput
              label="Question Content"
              value={currentQuestion?.content || ''}
              onChangeText={(text) => setCurrentQuestion({ ...currentQuestion, content: text })}
              style={styles.input}
              mode="outlined"
              theme={{ colors: { primary: '#0D47A1' } }} // Blue primary color for border and label
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
              mode="outlined"
              theme={{ colors: { primary: '#0D47A1' } }} // Blue primary color for border and label
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
                  mode="outlined"
                  theme={{ colors: { primary: '#0D47A1' } }} // Blue primary color for border and label
                />
                <IconButton
                  icon={choice.is_correct ? 'check-circle' : 'circle'}
                  color={choice.is_correct ? '#28A745' : '#B0BEC5'}
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
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD', // Light blue background similar to home page
  },
  appbar: {
    backgroundColor: '#2196F3', // Primary light blue for app bar
  },
  appbarTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  filterContainer: {
    padding: 10,
    backgroundColor: '#BBDEFB', // Light blue filter container background
    margin: 10,
    borderRadius: 8,
    elevation: 3,
  },
  picker: {
    marginVertical: 8,
    backgroundColor: '#E3F2FD', // Light blue picker background
    borderRadius: 8,
  },
  clearButton: {
    marginTop: 10,
    backgroundColor: '#007BFF', // Red clear button
  },
  questionCard: {
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: '#BBDEFB', // Light blue card background
    borderRadius: 8,
    elevation: 3,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D47A1', // Darker blue for question text
  },
  questionDetail: {
    fontSize: 14,
    color: '#1976D2', // Slightly darker blue for details
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#E3F2FD', // Light blue background
  },
  modalAppbar: {
    backgroundColor: '#2196F3', // Dark blue for modal app bar
  },
  modalTitle: {
    color: '#FFFFFF', // White text color for modal title
  },
  modalBody: {
    padding: 20,
  },
  input: {
    marginVertical: 8,
    backgroundColor: '#BBDEFB', // Light blue background for inputs
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  choiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  choiceInput: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#BBDEFB', // Light blue background for choices
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#2196F3', // Dark blue for save button
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: '#1976D2',
  },
//   pickerWrapper: {
//     borderWidth: 1,
//     borderColor: '#0D47A1', // Blue border for picker container
//     borderRadius: 5,
//     marginBottom: 10,
//     overflow: 'hidden',
//   },
//   picker: {
//     height: 50,
//     backgroundColor: '#E3F2FD', // Light blue background for Picker
//     color: '#0D47A1', // Blue text color for Picker items
//   },
});

export default QuestionManager;
