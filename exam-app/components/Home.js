import React from 'react';
import { View, Text, Button } from 'react-native';

const Home = ({ route, navigation }) => {
  const { user } = route.params;

  return (
    <View style={{ padding: 20 }}>
      <Text>Welcome, {user.name}!</Text>
      <Text>User Type: {user.user_type}</Text>
      <Button title="Upload Question" onPress={() => navigation.navigate('QuestionUpload')} />
      <Button title="Create Test" onPress={() => navigation.navigate('TestCreation')} />
    </View>
  );
};

export default Home;
