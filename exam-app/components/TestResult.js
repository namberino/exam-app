import React, { useContext, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { UserContext } from './UserContext';

const TestResult = ({ route, navigation }) => {
  const { score } = route.params;
  const {user, setUser} = useContext(UserContext);

  return (
    <View style={{ padding: 20 }}>
      <Text>Your Score: {score}</Text>
      <Button title="Go Back to Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

export default TestResult;
