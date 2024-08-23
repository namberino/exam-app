import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, SectionList, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Button, Text, Appbar, Card, IconButton, Modal, Portal, Provider } from 'react-native-paper';
import axios from 'axios';
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
  const [formVisible, setFormVisible] = useState(true); // State to control form visibility
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://192.168.1.203:5000/questions');
        setQuestions(response.data);
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

  return (
    <Provider>
      <View style={styles.container}>
        <Appbar.Header style={styles.appbar}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Create Test" titleStyle={styles.appbarTitle} />
          <IconButton
            icon={formVisible ? "eye-off" : "eye"} // Toggle icon based on form visibility
            color="#FFFFFF"
            size={24}
            onPress={() => setFormVisible(!formVisible)} // Toggle form visibility
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

        <SectionList
          sections={[{ title: 'Questions', data: questions }]}
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
                size={20}
              />
            </TouchableOpacity>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionTitle}>{title}</Text>
          )}
          style={styles.questionList}
        />

        <Button mode="contained" onPress={handleCreateTest} style={styles.createButton}>
          Create Test
        </Button>
        {message ? <Text style={styles.message}>{message}</Text> : null}

        <Portal>
          <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modal}>
            <TextInput
              label="Search Students"
              placeholder="Search for students"
              value={studentQuery}
              onChangeText={setStudentQuery}
              style={styles.input}
              onSubmitEditing={searchStudents}
            />
            <FlatList
              data={studentResults}
              keyExtractor={(item) => item._id}
              renderItem={renderStudentItem}
              style={styles.studentSearchList}
            />
            <Button mode="contained" onPress={() => setModalVisible(false)} style={styles.closeButton}>
              Close
            </Button>
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  appbar: {
    backgroundColor: '#2196F3',
  },
  appbarTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
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
    backgroundColor: '#F0F4F8', // Light background color for contrast
    fontSize: 16,
    color: '#333', // Darker text color for readability
    shadowColor: '#000', // Subtle shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Elevation for Android shadow
  },
  inputFocused: {
    borderColor: '#0056b3', // Darker shade on focus
  },
  inputLabel: {
    marginBottom: 8,
    fontSize: 14,
    color: '#555', // Muted label color
  },
  button: {
    marginBottom: 16,
    backgroundColor: '#007BFF',
  },
  assignedStudentsList: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 8,
    backgroundColor: '#BBDEFB',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  questionList: {
    flex: 1,
  },
  listItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#E3F2FD',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: '#e3f2fd',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#007BFF',
    color: '#fff',
  },
  createButton: {
    margin: 16,
    backgroundColor: '#2196F3',
  },
  message: {
    textAlign: 'center',
    marginVertical: 8,
    fontSize: 16,
    color: '#dc3545',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#007BFF',
  },
  studentItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  studentText: {
    fontSize: 16,
  },
  studentSearchList: {
    maxHeight: 300,
  },
});

export default TestCreation;
