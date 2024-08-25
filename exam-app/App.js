import React, { useContext } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserProvider, UserContext } from './context/UserContext';
import Login from './components/Login';
import QuestionUpload from './components/QuestionUpload';
import TestCreation from './components/TestCreation';
import Home from './components/Home';
import TestList from './components/TestList';
import TakeTest from './components/TakeTest';
import TestResult from './components/TestResult';
import ViewTestAnswers from './components/ViewTestAnswers';
import QuestionManager from './components/QuestionManager';
import AdminDashboard from './components/AdminDashboard';
import TestHistory from './components/TestHistory';
import ViewTestScores from './components/ViewTestScores';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user } = useContext(UserContext);

  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="QuestionUpload" component={QuestionUpload} />
          <Stack.Screen name="TestCreation" component={TestCreation} />
          <Stack.Screen name="TestList" component={TestList} />
          <Stack.Screen name="TakeTest" component={TakeTest} />
          <Stack.Screen name="TestResult" component={TestResult} />
          <Stack.Screen name="ViewTestAnswers" component={ViewTestAnswers} />
          <Stack.Screen name="QuestionManager" component={QuestionManager} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          <Stack.Screen name="TestHistory" component={TestHistory} />
          <Stack.Screen name="ViewTestScores" component={ViewTestScores} />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <UserProvider>
      <PaperProvider>
        <NavigationContainer>
            <AppNavigator />
        </NavigationContainer>
      </PaperProvider>
    </UserProvider>
  );
};

export default App;
