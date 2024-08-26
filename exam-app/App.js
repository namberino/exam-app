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
import AdminAccountCreation from './components/AdminAccountCreation';
import EditUserPassword from './components/EditUserPassword';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user } = useContext(UserContext);

  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="QuestionUpload" component={QuestionUpload} options={{ headerShown: false }} />
          <Stack.Screen name="TestCreation" component={TestCreation} options={{ headerShown: false }} />
          <Stack.Screen name="TestList" component={TestList} options={{ headerShown: false }} />
          <Stack.Screen name="TakeTest" component={TakeTest} options={{ headerShown: false }} />
          <Stack.Screen name="TestResult" component={TestResult} options={{ headerShown: false }} />
          <Stack.Screen name="ViewTestAnswers" component={ViewTestAnswers} options={{ headerShown: false }} />
          <Stack.Screen name="QuestionManager" component={QuestionManager} options={{ headerShown: false }} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ headerShown: false }} />
          <Stack.Screen name="TestHistory" component={TestHistory} options={{ headerShown: false }} />
          <Stack.Screen name="ViewTestScores" component={ViewTestScores} options={{ headerShown: false }} />
          <Stack.Screen name="AdminAccountCreation" component={AdminAccountCreation} options={{ headerShown: false }} />
          <Stack.Screen name="EditUserPassword" component={EditUserPassword} options={{ headerShown: false }} />
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
