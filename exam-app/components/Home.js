import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Appbar } from 'react-native-paper';
import { UserContext } from './UserContext';

const Home = ({ navigation }) => {
  const { user, setUser } = useContext(UserContext);

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Home" />
      </Appbar.Header>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome, {user.name}!</Text>
        <Text style={styles.userType}>User Type: {user.user_type}</Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('QuestionUpload')}
          style={styles.button}
        >
          Upload Question
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('TestCreation')}
          style={styles.button}
        >
          Create Test
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('TestList')}
          style={styles.button}
        >
          View Tests
        </Button>
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
