import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { UserContext } from './UserContext';

const Home = ({ navigation }) => {
  const { user, setUser } = useContext(UserContext);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {user.name}!</Text>
      <Text style={styles.userType}>User Type: {user.user_type}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Upload Question" onPress={() => navigation.navigate('QuestionUpload')} color="#007BFF" />
        <Button title="Create Test" onPress={() => navigation.navigate('TestCreation')} color="#28A745" />
        <Button title="View Tests" onPress={() => navigation.navigate('TestList')} color="#FFC107" />
      </View>
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
    welcomeText: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#212529',
    },
    userType: {
      fontSize: 18,
      marginBottom: 20,
      color: '#6C757D',
    },
    buttonContainer: {
      width: '100%',
      marginTop: 20,
    },
});

export default Home;
