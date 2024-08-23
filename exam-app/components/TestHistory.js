import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Appbar, Card, ActivityIndicator, IconButton } from 'react-native-paper';
import { UserContext } from './UserContext';
import axios from 'axios';

const TestHistory = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchTestHistory();
  }, [user.userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" color="#1E88E5" />
        <Text style={styles.loadingText}>Loading Test History...</Text>
      </View>
    );
  }

  if (history.length === 0) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Test History" />
          <IconButton
            icon="refresh"
            size={24}
            onPress={() => fetchTestHistory()}
          />
        </Appbar.Header>
        <View style={styles.content}>
          <Text style={styles.noHistoryText}>No test history available.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Test History" titleStyle={styles.appbarTitle} />
        <IconButton
          icon="refresh"
          size={24}
          onPress={() => fetchTestHistory()}
        />
      </Appbar.Header>
      <FlatList
        data={history}
        keyExtractor={(item) => item.test_id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title 
              title={item.test_name || 'Test'} 
              subtitle={`Score: ${item.score} / 100`}
              left={() => <IconButton icon="file-document" size={24} />}
            />
            {/* <Card.Content>
              <Text style={styles.dateText}>{item.date}</Text>
            </Card.Content> */}
          </Card>
        )}
        contentContainerStyle={styles.list}
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
    backgroundColor: '#2196F3', // Primary light blue for app bar
  },
  appbarTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noHistoryText: {
    fontSize: 16,
    color: '#6C757D',
  },
  card: {
    margin: 10,
    borderRadius: 8,
    elevation: 3,
    backgroundColor: '#BBDEFB',
  },
  dateText: {
    fontSize: 14,
    color: '#6C757D',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6C757D',
  },
  list: {
    padding: 16,
  },
});

export default TestHistory;
