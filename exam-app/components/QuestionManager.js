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
        const uniqueSubjects = [...new Set(questionsData.map(q => q.subject))];
        const uniqueDifficulties = [...new Set(questionsData.map(q => q.difficulty))];

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

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Question Manager" />
      </Appbar.Header>
      <View style={styles.filterContainer}>
        <Picker
          selectedValue={selectedChapter}
          onValueChange={(itemValue) => setSelectedChapter(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Chapter" value="" />
          {chapters.map((chapter, index) => (
            <Picker.Item key={index} label={chapter} value={chapter} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedSubject}
          onValueChange={(itemValue) => setSelectedSubject(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Subject" value="" />
          {subjects.map((subject, index) => (
            <Picker.Item key={index} label={subject} value={subject} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedDifficulty}
          onValueChange={(itemValue) => setSelectedDifficulty(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Difficulty" value="" />
          {difficulties.map((difficulty, index) => (
            <Picker.Item key={index} label={difficulty} value={difficulty} />
          ))}
        </Picker>
      </View>
      <FlatList
        data={filteredQuestions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => openEditModal(item)}
            style={styles.questionItem}
          >
            <Text style={styles.questionContent}>{item.content}</Text>
          </TouchableOpacity>
        )}
      />
      {editModalVisible && currentQuestion && (
        <Modal
          transparent={true}
          visible={editModalVisible}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <ScrollView style={styles.scrollView}>
              <View style={styles.modalContent}>
                <TextInput
                  value={currentQuestion.content}
                  onChangeText={(text) => setCurrentQuestion({ ...currentQuestion, content: text })}
                  style={styles.input}
                  placeholder="Edit Question Content"
                />
                <Picker
                  selectedValue={currentQuestion.chapter}
                  onValueChange={(itemValue) => setCurrentQuestion({ ...currentQuestion, chapter: itemValue })}
                  style={styles.picker}
                >
                  {chapters.map((chapter, index) => (
                    <Picker.Item key={index} label={chapter} value={chapter} />
                  ))}
                </Picker>
                <Picker
                  selectedValue={currentQuestion.subject}
                  onValueChange={(itemValue) => setCurrentQuestion({ ...currentQuestion, subject: itemValue })}
                  style={styles.picker}
                >
                  {subjects.map((subject, index) => (
                    <Picker.Item key={index} label={subject} value={subject} />
                  ))}
                </Picker>
                <Picker
                  selectedValue={currentQuestion.difficulty}
                  onValueChange={(itemValue) => setCurrentQuestion({ ...currentQuestion, difficulty: itemValue })}
                  style={styles.picker}
                >
                  {difficulties.map((difficulty, index) => (
                    <Picker.Item key={index} label={difficulty} value={difficulty} />
                  ))}
                </Picker>
                {currentQuestion.choices && currentQuestion.choices.map((choice, index) => (
                  <View key={index} style={styles.choiceContainer}>
                    <TextInput
                      value={choice.text}
                      onChangeText={(text) => handleChoiceChange(index, text)}
                      style={styles.choiceInput}
                      placeholder={`Edit Choice ${index + 1}`}
                    />
                    <IconButton
                      icon={choice.is_correct ? 'check-circle' : 'circle'}
                      color={choice.is_correct ? '#28A745' : '#212529'}
                      size={24}
                      onPress={() => handleChoiceCorrectnessChange(index, !choice.is_correct)}
                    />
                  </View>
                ))}
                {/* <TextInput
                  value={currentQuestion.correct_answer}
                  onChangeText={(text) => setCurrentQuestion({ ...currentQuestion, correct_answer: text })}
                  style={styles.input}
                  placeholder="Edit Correct Answer"
                /> */}
                <Button mode="contained" onPress={handleSaveQuestion} style={styles.button}>
                  Save
                </Button>
              </View>
            </ScrollView>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  filterContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  picker: {
    flex: 1,
    height: 50,
    color: '#495057',
  },
  questionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CED4DA',
  },
  questionContent: {
    fontSize: 16,
    color: '#212529',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scrollView: {
    width: '100%',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 8,
    alignSelf: 'center',
  },
  input: {
    height: 50,
    borderColor: '#CED4DA',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
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
  button: {
    marginTop: 20,
  },
});

export default QuestionManager;
