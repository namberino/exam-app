import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, SectionList, TouchableOpacity, TextInput } from 'react-native';
import { Button, Text, Appbar, Card, IconButton } from 'react-native-paper';
import axios from 'axios';
import { UserContext } from './UserContext';

const TestCreation = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [message, setMessage] = useState('');
  const [testName, setTestName] = useState('');
  const [timeLimit, setTimeLimit] = useState(''); // State for time limit
  const [studentQuery, setStudentQuery] = useState('');
  const [studentResults, setStudentResults] = useState([]);
  const [assignedStudents, setAssignedStudents] = useState([]);
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

  const searchStudents = async (query) => {
    try {
      const response = await axios.get(`http://192.168.1.203:5000/search_students?query=${query}`);
      setStudentResults(response.data);
    } catch (error) {
      console.error('Error searching students', error);
    }
  };

  useEffect(() => {
    if (studentQuery) {
      searchStudents(studentQuery);
    } else {
      setStudentResults([]);
    }
  }, [studentQuery]);

  const handleAddStudent = (student) => {
    if (!assignedStudents.some(s => s._id === student._id)) {
      setAssignedStudents([...assignedStudents, student]);
    }
  };

  const handleRemoveStudent = (studentId) => {
    setAssignedStudents(assignedStudents.filter(s => s._id !== studentId));
  };

  const handleCreateTest = async () => {
    if (!testName.trim()) {
      setMessage('Test name is required');
      return;
    }

    // Validate time limit
    if (!timeLimit.trim() || isNaN(timeLimit) || parseFloat(timeLimit) <= 0) {
      setMessage('A valid time limit is required');
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.203:5000/tests', {
        name: testName,
        time_limit: parseInt(parseFloat(timeLimit) * 60), // Pass time limit to the database
        questions: selectedQuestions.map(q => q._id),
        user_id: user.userId,
        assigned_students: assignedStudents.map(s => s._id),
      });
      setMessage(response.data.message);
      setTestName('');
      setTimeLimit(''); // Reset time limit
      setSelectedQuestions([]);
      setAssignedStudents([]);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error creating test');
    }
  };

  const isSelected = (questionId) => selectedQuestions.some(q => q._id === questionId);

  const renderItem = ({ item, section }) => {
    if (section.title === 'Student Search Results') {
      return (
        <TouchableOpacity
          onPress={() => handleAddStudent(item)}
          style={styles.listItem}
        >
          <Text style={styles.itemText}>{item.name}</Text>
          <IconButton
            icon="plus-circle"
            color="#007BFF"
            size={20}
            onPress={() => handleAddStudent(item)}
          />
        </TouchableOpacity>
      );
    }

    if (section.title === 'Assigned Students') {
      return (
        <Card key={item._id} style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.itemText}>{item.name}</Text>
            <IconButton
              icon="minus-circle"
              color="#FF5252"
              size={20}
              onPress={() => handleRemoveStudent(item._id)}
            />
          </View>
        </Card>
      );
    }

    if (section.title === 'Questions') {
      return (
        <TouchableOpacity
          onPress={() => handleSelectQuestion(item)}
          style={[
            styles.listItem,
            isSelected(item._id) && styles.selectedItem
          ]}
        >
          <Text style={styles.itemText}>{item.content}</Text>
          <IconButton
            icon={isSelected(item._id) ? "check-circle" : "circle-outline"}
            color={isSelected(item._id) ? "#28A745" : "#007BFF"}
            size={20}
          />
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Appbar.Header style={styles.appbar}>
            <Appbar.BackAction onPress={() => navigation.goBack()} />
            <Appbar.Content title="Create Test" titleStyle={styles.appbarTitle} />
        </Appbar.Header>
      </View>
      <SectionList
        sections={[
          { title: 'Student Search Results', data: studentResults },
          { title: 'Assigned Students', data: assignedStudents },
          { title: 'Questions', data: questions },
        ]}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListHeaderComponent={() => (
          <View style={styles.headerContainer}>
            <TextInput
              placeholder="Enter test name"
              value={testName}
              onChangeText={setTestName}
              style={styles.input}
            />
            <TextInput
              placeholder="Enter time limit (in minutes)"
              value={timeLimit}
              onChangeText={setTimeLimit}
              keyboardType="numeric" // Ensure numeric input
              style={styles.input}
            />
            {/* <Text style={styles.sectionTitle}>Search for students:</Text> */}
            <TextInput
              placeholder="Search for students"
              value={studentQuery}
              onChangeText={setStudentQuery}
              style={styles.input}
            />
            {assignedStudents.length === 0 && <Text style={styles.noItemsText}>No students assigned yet.</Text>}
          </View>
        )}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
        )}
      />
      <Button mode="contained" onPress={handleCreateTest} style={styles.button}>
        Create Test
      </Button>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
  },
  appbar: {
    backgroundColor: '#2196F3', // Primary light blue for app bar
  },
  appbarTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerWrapper: {
    marginHorizontal: -16,
    marginVertical: -16,
    marginBottom: 16,
  },
  headerContainer: {
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#007BFF',
    borderRadius: 4,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  listItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: '#e3f2fd',
  },
  itemText: {
    fontSize: 14,
    color: '#333',
  },
  card: {
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    elevation: 1,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  button: {
    marginVertical: 16,
    backgroundColor: '#2196F3',
  },
  message: {
    textAlign: 'center',
    marginVertical: 8,
    fontSize: 16,
    color: '#dc3545', // Red color for error messages
  },
  noItemsText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
});

export default TestCreation;
