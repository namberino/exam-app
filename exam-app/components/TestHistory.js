import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Appbar, Card, ActivityIndicator } from 'react-native-paper';
import { UserContext } from './UserContext';
import axios from 'axios';

const TestHistory = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestHistory = async () => {
      try {
        const response = await axios.get(`http://192.168.1.203:5000/test_history/${user.userId}`);
        setHistory(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch test history:', error);
        setLoading(false);
      }
    };

    fetchTestHistory();
  }, [user._id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" />
        <Text>Loading Test History...</Text>
      </View>
    );
  }

  if (history.length === 0) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Test History" />
        </Appbar.Header>
        <View style={styles.content}>
          <Text>No test history available.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Test History" />
      </Appbar.Header>
      <FlatList
        data={history}
        keyExtractor={(item) => item.test_id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={item.test_name || 'Test'} />
            <Card.Content>
              <Text>Score: {item.score} / 100</Text>
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
  },
  content: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TestHistory;
