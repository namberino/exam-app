import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button, Text, Appbar, IconButton } from 'react-native-paper';
import axios from 'axios';

const QuestionManager = () => {
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
        const response = await axios.get('http://192.168.1.203:5000/questions');
        const questionsData = response.data;
        setQuestions(questionsData);
        setFilteredQuestions(questionsData);

        const uniqueChapters = [...new Set(questionsData.map(q => q.chapter))];
        setChapters(uniqueChapters);

        const subjectsResponse = await axios.get('http://192.168.1.203:5000/subjects');
        setSubjects(subjectsResponse.data);

        const uniqueDifficulties = [...new Set(questionsData.map(q => q.difficulty))];
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
      filtered = filtered.filter(q => q.subject_id === selectedSubject);
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
        <Appbar.Content title="Question Manager" />
      </Appbar.Header>
      <View style={styles.filtersContainer}>
        <Picker
          selectedValue={selectedChapter}
          onValueChange={(itemValue) => setSelectedChapter(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Chapter" value="" />
          {chapters.map((chapter) => (
            <Picker.Item key={chapter} label={chapter} value={chapter} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedSubject}
          onValueChange={(itemValue) => setSelectedSubject(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Subject" value="" />
          {subjects.map((subject) => (
            <Picker.Item key={subject._id} label={subject.name} value={subject._id} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedDifficulty}
          onValueChange={(itemValue) => setSelectedDifficulty(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Difficulty" value="" />
          {difficulties.map((difficulty) => (
            <Picker.Item key={difficulty} label={difficulty} value={difficulty} />
          ))}
        </Picker>
        <Button mode="outlined" onPress={clearFilters}>
          Clear Filters
        </Button>
      </View>
      <FlatList
        data={filteredQuestions}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.questionContainer} onPress={() => openEditModal(item)}>
            <Text>{item.content}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
      />
      <Modal visible={editModalVisible} onRequestClose={() => setEditModalVisible(false)}>
        <ScrollView style={styles.modalContainer}>
          {currentQuestion && (
            <>
              <TextInput
                label="Question Content"
                value={currentQuestion.content}
                onChangeText={(text) => setCurrentQuestion({ ...currentQuestion, content: text })}
                style={styles.input}
              />
              <TextInput
                label="Difficulty"
                value={currentQuestion.difficulty}
                onChangeText={(text) => setCurrentQuestion({ ...currentQuestion, difficulty: text })}
                style={styles.input}
              />
              <TextInput
                label="Chapter"
                value={currentQuestion.chapter}
                onChangeText={(text) => setCurrentQuestion({ ...currentQuestion, chapter: text })}
                style={styles.input}
              />
              <Picker
                selectedValue={currentQuestion.subject_id}
                onValueChange={(itemValue) =>
                  setCurrentQuestion({ ...currentQuestion, subject_id: itemValue })
                }
                style={styles.picker}
              >
                <Picker.Item label="Select Subject" value="" />
                {subjects.map((subject) => (
                  <Picker.Item key={subject._id} label={subject.name} value={subject._id} />
                ))}
              </Picker>
              {currentQuestion.choices.map((choice, index) => (
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
                Save Question
              </Button>
            </>
          )}
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
  filtersContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  picker: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    height: 50,
  },
  questionContainer: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  modalContainer: {
    flex: 1,
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
    marginTop: 20,
  },
});

export default QuestionManager;
