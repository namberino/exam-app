import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Appbar } from 'react-native-paper';
import { UserContext } from './UserContext';

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const Home = ({ navigation }) => {
  const { user, setUser } = useContext(UserContext);

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Home" />
      </Appbar.Header>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome, {user.name}!</Text>
        <Text style={styles.userType}>User type: {capitalizeFirstLetter(user.userType)}</Text>

        {user.userType === 'admin' && (
        <Button
            mode="contained"
            onPress={() => navigation.navigate('AdminDashboard')}
            style={styles.button}
        >
            Admin Dashboard
        </Button>
        )}

        {user.userType === 'teacher' && (
        <Button
          mode="contained"
          onPress={() => navigation.navigate('QuestionUpload')}
          style={styles.button}
        >
          Upload Question
        </Button>
        )}
        {user.userType === 'teacher' && (
        <Button
          mode="contained"
          onPress={() => navigation.navigate('QuestionManager')}
          style={styles.button}
        >
          Manage Questions
        </Button>
        )}

        {user.userType === 'teacher' && (
        <Button
          mode="contained"
          onPress={() => navigation.navigate('TestCreation')}
          style={styles.button}
        >
          Create Test
        </Button>
        )}

        {user.userType === 'student' && (
        <Button
          mode="contained"
          onPress={() => navigation.navigate('TestList')}
          style={styles.button}
        >
          View Tests
        </Button>
        )}

        {user.userType === 'student' && (
        <Button
            mode="contained"
            onPress={() => navigation.navigate('TestHistory')}
            style={styles.button}
        >
            Test History
        </Button>
        )}
      </View>
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
    },
    welcomeText: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    userType: {
      fontSize: 18,
      marginBottom: 20,
    },
    button: {
      marginBottom: 10,
    },
});

export default Home;
