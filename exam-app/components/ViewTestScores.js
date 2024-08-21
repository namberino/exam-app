import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';

const ViewTestScores = ({ route }) => {
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
  }, []);

  return (
    <View style={styles.container}>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <FlatList
        data={scores}
        keyExtractor={(item) => item.studentId}
        renderItem={({ item }) => (
          <View style={styles.scoreItem}>
            <Text style={styles.studentName}>{item.studentName}</Text>
            <Text style={[styles.score, item.score === 'No score' && styles.noScore]}>
              {item.score}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyMessage}>No students have been assigned to this test yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  scoreItem: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#F1F3F5',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28A745',
  },
  noScore: {
    color: '#DC3545',
  },
  message: {
    margin: 20,
    color: '#DC3545',
    textAlign: 'center',
    fontSize: 16,
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#6C757D',
  },
});

export default ViewTestScores;
