import React, { useContext, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { UserContext } from './UserContext';

const TestResult = ({ route, navigation }) => {
  const { score } = route.params;
  const {user, setUser} = useContext(UserContext);

  return (
    <View style={styles.container}>
      <Text style={styles.scoreText}>Your Score: {score}</Text>
      <Button title="Go Back to Home" onPress={() => navigation.navigate('Home')} color="#007BFF" />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#F8F9FA',
    },
    scoreText: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#212529',
    },
});

export default TestResult;
