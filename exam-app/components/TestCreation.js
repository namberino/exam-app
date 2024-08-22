import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, SectionList, TouchableOpacity, TextInput } from 'react-native';
import { Button, Text, Appbar, Card } from 'react-native-paper';
import axios from 'axios';
import { UserContext } from './UserContext';

const TestCreation = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [message, setMessage] = useState('');
  const [testName, setTestName] = useState('');
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

    try {
      const response = await axios.post('http://192.168.1.203:5000/tests', {
        name: testName,
        questions: selectedQuestions.map(q => q._id),
        user_id: user.userId,
        assigned_students: assignedStudents.map(s => s._id),
      });
      setMessage(response.data.message);
      setTestName('');
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
        </TouchableOpacity>
      );
    }

    if (section.title === 'Assigned Students') {
      return (
        <Card key={item._id} style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Button onPress={() => handleRemoveStudent(item._id)} mode="contained" style={styles.removeButton}>
              Remove
            </Button>
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
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Appbar.Header>
            <Appbar.BackAction onPress={() => navigation.goBack()} />
            <Appbar.Content title="Create Test" />
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
            <Text style={styles.sectionTitle}>Search for students:</Text>
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
    borderColor: '#F8F9FA',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
  },
  sectionHeader: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  listItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
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
  removeButton: {
    backgroundColor: '#ff5252',
    borderRadius: 4,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#212529',
  },
  message: {
    marginTop: 16,
    color: '#ff5252',
    textAlign: 'center',
  },
  noItemsText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#999',
  },
});

export default TestCreation;
