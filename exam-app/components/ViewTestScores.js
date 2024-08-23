import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Appbar, Card, Text, IconButton } from 'react-native-paper';

const ViewTestScores = ({ route, navigation }) => {
  const { testId } = route.params;
  const [scores, setScores] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await axios.get(`http://192.168.1.203:5000/tests/${testId}`);
        const students = response.data.assigned_students;
        const testScores = response.data.scores;

        const scoreList = students.map(student => ({
          studentId: student._id,
          studentName: student.name,
          score: testScores[student._id] || 'No score',
        }));

        setScores(scoreList);
      } catch (error) {
        setMessage('Error fetching scores');
      }
    };

    fetchScores();
  }, [testId]);

  const exportToCSV = async () => {
    if (scores.length === 0) {
      Alert.alert('No data', 'There are no scores to export.');
      return;
    }

    const csvContent = [
      ['Student ID', 'Student Name', 'Score'],
      ...scores.map(({ studentId, studentName, score }) => [studentId, studentName, score]),
    ]
      .map(e => e.join(','))
      .join('\n');

    const fileName = `${FileSystem.documentDirectory}test_scores.csv`;

    try {
      await FileSystem.writeAsStringAsync(fileName, csvContent);
      await Sharing.shareAsync(fileName);
    } catch (error) {
      Alert.alert('Error', 'An error occurred while exporting the file.');
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Test Scores" titleStyle={styles.appbarTitle} />
        <Appbar.Action icon="download" onPress={exportToCSV} />
      </Appbar.Header>

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <FlatList
        data={scores}
        keyExtractor={(item) => item.studentId}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={item.studentName} titleStyle={styles.studentName} />
            <Card.Content>
              <Text style={styles.scoreLabel}>
                Score: <Text style={styles.scoreValue}>{item.score}</Text>
              </Text>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  appbar: {
    backgroundColor: '#2196F3', // Primary light blue
  },
  appbarTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 3,
    backgroundColor: '#BBDEFB',
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  scoreLabel: {
    fontSize: 16,
    color: '#6C757D',
    marginVertical: 4,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
  },
  message: {
    margin: 10,
    color: '#DC3545',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default ViewTestScores;
