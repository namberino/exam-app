import React, { useContext, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import { UserContext } from './UserContext';

const TestResult = ({ route, navigation }) => {
  const { score } = route.params;
  const {user, setUser} = useContext(UserContext);

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Test Result" />
      </Appbar.Header>
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>Your Score:</Text>
        <Text style={styles.score}>{score}</Text>
        <Button mode="contained" onPress={() => navigation.navigate('TestList')} style={styles.button}>
          Back to Test List
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8F9FA',
    },
    resultContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    resultText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#212529',
    },
    score: {
      fontSize: 48,
      fontWeight: 'bold',
      color: '#28A745',
      marginVertical: 20,
    },
    button: {
      marginTop: 20,
    },
});

export default TestResult;
