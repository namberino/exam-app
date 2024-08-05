import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { UserContext } from './UserContext';

const Home = ({ navigation }) => {
  const { user, setUser } = useContext(UserContext);

  return (
    <View style={{ padding: 20 }}>
      <Text>Welcome, {user.name}!</Text>
      <Text>User Type: {user.user_type}</Text>
      <Button title="Upload Question" onPress={() => navigation.navigate('QuestionUpload')} />
      <Button title="Create Test" onPress={() => navigation.navigate('TestCreation')} />
      <Button title="View Tests" onPress={() => navigation.navigate('TestList')} />
    </View>
  );
};

export default Home;
