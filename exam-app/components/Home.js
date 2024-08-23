import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Appbar, Avatar } from 'react-native-paper';
import { UserContext } from './UserContext';
import { MaterialIcons } from '@expo/vector-icons';

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const Home = ({ navigation }) => {
  const { user } = useContext(UserContext);

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content title="Home" titleStyle={styles.appbarTitle} />
        <Avatar.Icon size={40} icon="account-circle" color="#FFFFFF" style={styles.userIcon} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome, {user.name}!</Text>
          <Text style={styles.userType}>User type: {capitalizeFirstLetter(user.userType)}</Text>
        </View>

        {user.userType === 'admin' && (
          <Card style={styles.card} onPress={() => navigation.navigate('AdminDashboard')}>
            <Card.Title 
              title="Admin Dashboard" 
              titleStyle={styles.cardTitle}
              left={(props) => <MaterialIcons name="dashboard" size={24} color="#1E88E5" />}
            />
            <Card.Content>
              <Text style={styles.cardDescription}>Manage user accounts, view analytics, and control system settings.</Text>
            </Card.Content>
          </Card>
        )}

        {user.userType === 'teacher' && (
          <>
            <Card style={styles.card} onPress={() => navigation.navigate('QuestionUpload')}>
              <Card.Title 
                title="Upload Question" 
                titleStyle={styles.cardTitle}
                left={(props) => <MaterialIcons name="file-upload" size={24} color="#1E88E5" />}
              />
              <Card.Content>
                <Text style={styles.cardDescription}>Upload new questions for tests, including multiple choice and written responses.</Text>
              </Card.Content>
            </Card>
            <Card style={styles.card} onPress={() => navigation.navigate('QuestionManager')}>
              <Card.Title 
                title="Manage Questions" 
                titleStyle={styles.cardTitle}
                left={(props) => <MaterialIcons name="edit" size={24} color="#1E88E5" />}
              />
              <Card.Content>
                <Text style={styles.cardDescription}>Edit, delete, or search for existing questions to keep your test materials up to date.</Text>
              </Card.Content>
            </Card>
            <Card style={styles.card} onPress={() => navigation.navigate('TestCreation')}>
              <Card.Title 
                title="Create Test" 
                titleStyle={styles.cardTitle}
                left={(props) => <MaterialIcons name="playlist-add" size={24} color="#1E88E5" />}
              />
              <Card.Content>
                <Text style={styles.cardDescription}>Design new tests by selecting questions and setting parameters such as time limits.</Text>
              </Card.Content>
            </Card>
            <Card style={styles.card} onPress={() => navigation.navigate('TestList')}>
              <Card.Title 
                title="View Tests" 
                titleStyle={styles.cardTitle}
                left={(props) => <MaterialIcons name="list" size={24} color="#1E88E5" />}
              />
              <Card.Content>
                <Text style={styles.cardDescription}>View all tests you have created, and monitor student performance.</Text>
              </Card.Content>
            </Card>
          </>
        )}

        {user.userType === 'student' && (
          <>
            <Card style={styles.card} onPress={() => navigation.navigate('TestList')}>
              <Card.Title 
                title="View Tests" 
                titleStyle={styles.cardTitle}
                left={(props) => <MaterialIcons name="list" size={24} color="#1E88E5" />}
              />
              <Card.Content>
                <Text style={styles.cardDescription}>Browse and take available tests. Check due dates and attempt status.</Text>
              </Card.Content>
            </Card>
            <Card style={styles.card} onPress={() => navigation.navigate('TestHistory')}>
              <Card.Title 
                title="Test History" 
                titleStyle={styles.cardTitle}
                left={(props) => <MaterialIcons name="history" size={24} color="#1E88E5" />}
              />
              <Card.Content>
                <Text style={styles.cardDescription}>Review your past test results and analyze your performance over time.</Text>
              </Card.Content>
            </Card>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Light grey background for a modern look
  },
  appbar: {
    backgroundColor: '#1E88E5', // Slightly darker blue for a modern feel
  },
  appbarTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  userIcon: {
    marginRight: 16,
  },
  content: {
    padding: 20,
  },
  welcomeContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1565C0', // Dark blue for a modern look
  },
  userType: {
    fontSize: 18,
    color: '#1976D2',
  },
  card: {
    marginBottom: 15,
    backgroundColor: '#E3F2FD', // Light blue card background for a fresh look
    borderRadius: 10,
    elevation: 3, // Add shadow for a modern effect
  },
  cardTitle: {
    color: '#1E88E5', // Darker blue for card title
    fontWeight: 'bold',
  },
  cardDescription: {
    color: '#455A64', // Greyish blue for text
    marginTop: 8,
  },
});

export default Home;
