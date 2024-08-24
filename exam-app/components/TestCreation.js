import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, SectionList, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Button, Text, Appbar, Card, IconButton, Modal, Portal, Provider } from 'react-native-paper';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { UserContext } from '../context/UserContext';

const TestCreation = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [message, setMessage] = useState('');
  const [testName, setTestName] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [studentQuery, setStudentQuery] = useState('');
  const [studentResults, setStudentResults] = useState([]);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false); // State to control filter visibility
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [difficultyLevels, setDifficultyLevels] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://192.168.1.203:5000/questions');
        setQuestions(response.data);
        // Extract unique subjects, chapters, and difficulties from questions
        const uniqueSubjects = [...new Set(response.data.map(q => q.subject))];
        const uniqueChapters = [...new Set(response.data.map(q => q.chapter))];
        const uniqueDifficulties = [...new Set(response.data.map(q => q.difficulty))];
        setSubjects(uniqueSubjects);
        setChapters(uniqueChapters);
        setDifficultyLevels(uniqueDifficulties);
      } catch (error) {
        setMessage('Error fetching questions');
      }
    };
    fetchQuestions();
  }, []);

  const handleSelectQuestion = (question) => {
    const isSelected = selectedQuestions.some(q => q._id === question._id);
    if (isSelected) {
      setSelectedQuestions(selectedQuestions.filter(q => q._id !== question._id));
    } else {
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };

  const searchStudents = async () => {
    if (!studentQuery.trim()) return;
    try {
      const response = await axios.get(`http://192.168.1.203:5000/search_students?query=${studentQuery}`);
      setStudentResults(response.data);
    } catch (error) {
      console.error('Error searching students', error);
    }
  };

  const handleAddStudent = (student) => {
    if (!assignedStudents.some(s => s._id === student._id)) {
      setAssignedStudents([...assignedStudents, student]);
    }
    setModalVisible(false);
    setStudentQuery('');
    setStudentResults([]);
  };

  const handleRemoveStudent = (studentId) => {
    setAssignedStudents(assignedStudents.filter(s => s._id !== studentId));
  };

  const handleCreateTest = async () => {
    if (!testName.trim()) {
      setMessage('Test name is required');
      return;
    }

    if (!timeLimit.trim() || isNaN(timeLimit) || parseFloat(timeLimit) <= 0) {
      setMessage('A valid time limit is required');
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.203:5000/tests', {
        name: testName,
        time_limit: parseInt(parseFloat(timeLimit) * 60),
        questions: selectedQuestions.map(q => q._id),
        user_id: user.userId,
        assigned_students: assignedStudents.map(s => s._id),
      });
      setMessage(response.data.message);
      setTestName('');
      setTimeLimit('');
      setSelectedQuestions([]);
      setAssignedStudents([]);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error creating test');
    }
  };

  const renderStudentItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleAddStudent(item)} style={styles.studentItem}>
      <Text style={styles.studentText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const filterQuestions = () => {
    let filteredQuestions = questions;
    if (selectedSubject) {
      filteredQuestions = filteredQuestions.filter(q => q.subject === selectedSubject);
    }
    if (selectedChapter) {
      filteredQuestions = filteredQuestions.filter(q => q.chapter === selectedChapter);
    }
    if (selectedDifficulty) {
      filteredQuestions = filteredQuestions.filter(q => q.difficulty === selectedDifficulty);
    }
    return filteredQuestions;
  };

  const clearFilters = () => {
    setSelectedSubject('');
    setSelectedChapter('');
    setSelectedDifficulty('');
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Appbar.Header style={styles.appbar}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Create Test" titleStyle={styles.appbarTitle} />
          <IconButton
            icon={formVisible ? "eye-off" : "eye"}
            color="#FFFFFF"
            size={24}
            onPress={() => setFormVisible(!formVisible)}
          />
          <IconButton
            icon={filterVisible ? "filter-remove-outline" : "filter"}
            color="#FFFFFF"
            size={24}
            onPress={() => setFilterVisible(!filterVisible)}
          />
        </Appbar.Header>

        {formVisible && (
          <View style={styles.form}>
            <TextInput
              label="Test Name"
              placeholder="Enter test name"
              value={testName}
              onChangeText={setTestName}
              style={styles.input}
            />
            <TextInput
              label="Time Limit"
              placeholder="Enter time limit (in minutes)"
              value={timeLimit}
              onChangeText={setTimeLimit}
              keyboardType="numeric"
              style={styles.input}
            />
            <Button mode="contained" onPress={() => setModalVisible(true)} style={styles.button}>
              Assign Students
            </Button>

            {assignedStudents.length > 0 && (
              <FlatList
                data={assignedStudents}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <Card style={styles.card}>
                    <View style={styles.cardContent}>
                      <Text>{item.name}</Text>
                      <IconButton
                        icon="minus-circle"
                        color="#FF5252"
                        size={20}
                        onPress={() => handleRemoveStudent(item._id)}
                      />
                    </View>
                  </Card>
                )}
                style={styles.assignedStudentsList}
              />
            )}
          </View>
        )}

        {filterVisible && (
          <View style={styles.filterContainer}>
            <Picker
              selectedValue={selectedSubject}
              onValueChange={(itemValue) => setSelectedSubject(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Subject" value="" />
              {subjects.map(subject => (
                <Picker.Item key={subject} label={subject} value={subject} />
              ))}
            </Picker>
            <Picker
              selectedValue={selectedChapter}
              onValueChange={(itemValue) => setSelectedChapter(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Chapter" value="" />
              {chapters.map(chapter => (
                <Picker.Item key={chapter} label={chapter} value={chapter} />
              ))}
            </Picker>
            <Picker
              selectedValue={selectedDifficulty}
              onValueChange={(itemValue) => setSelectedDifficulty(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Difficulty" value="" />
              {difficultyLevels.map(difficulty => (
                <Picker.Item key={difficulty} label={difficulty} value={difficulty} />
              ))}
            </Picker>
            <Button mode="contained" onPress={clearFilters} style={styles.button}>
              Clear Filters
            </Button>
          </View>
        )}

        <SectionList
          sections={[{ title: 'Questions', data: filterQuestions() }]}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelectQuestion(item)}
              style={[
                styles.listItem,
                selectedQuestions.some(q => q._id === item._id) && styles.selectedItem
              ]}
            >
              <Text style={styles.itemText}>{item.content}</Text>
              <IconButton
                icon={selectedQuestions.some(q => q._id === item._id) ? "check-circle" : "circle-outline"}
                color={selectedQuestions.some(q => q._id === item._id) ? "#28A745" : "#007BFF"}
                size={24}
                onPress={() => handleSelectQuestion(item)}
              />
            </TouchableOpacity>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          style={styles.sectionList}
        />

        <Button mode="contained" onPress={handleCreateTest} style={styles.button}>
          Create Test
        </Button>
        {message && <Text style={styles.message}>{message}</Text>}

        <Portal>
          <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modal}>
            <TextInput
              label="Search Students"
              placeholder="Enter student name or ID"
              value={studentQuery}
              onChangeText={setStudentQuery}
              onSubmitEditing={searchStudents}
              style={styles.input}
            />
            {studentResults.length > 0 && (
              <FlatList
                data={studentResults}
                keyExtractor={(item) => item._id}
                renderItem={renderStudentItem}
                style={styles.studentList}
              />
            )}
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  appbar: {
    backgroundColor: '#2196F3',
  },
  appbarTitle: {
    color: '#FFFFFF',
  },
  form: {
    padding: 16,
  },
  input: {
    height: 48,
    borderColor: '#007BFF', // Use the primary color for the border
    borderWidth: 1.5,
    borderRadius: 25, // Rounded corners
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  button: {
    marginBottom: 16,
    backgroundColor: '#007BFF',
  },
  assignedStudentsList: {
    marginTop: 16,
  },
  card: {
    marginBottom: 8,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionList: {
    margin: 16,
  },
  sectionHeader: {
    fontWeight: 'bold',
    fontSize: 18,
    marginVertical: 8,
  },
  listItem: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: '#E3F2FD',
  },
  itemText: {
    fontSize: 16,
    flexShrink: 1,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  studentList: {
    marginTop: 16,
    backgroundColor: '#007BFF',
  },
  studentItem: {
    padding: 12,
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  studentText: {
    fontSize: 16,
  },
  message: {
    color: '#FF0000',
    textAlign: 'center',
    marginVertical: 8,
  },
  filterContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  picker: {
    marginBottom: 16,
  },
});

export default TestCreation;
