import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserProvider, UserContext } from './components/UserContext';
import Login from './components/Login';
import QuestionUpload from './components/QuestionUpload';
import TestCreation from './components/TestCreation';
import Home from './components/Home';
import TestList from './components/TestList';
import TakeTest from './components/TakeTest';
import TestResult from './components/TestResult';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user } = useContext(UserContext);

  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Home" component={Home} />
        <>
          <Stack.Screen name="QuestionUpload" component={QuestionUpload} />
          <Stack.Screen name="TestCreation" component={TestCreation} />
        </>
        <>
          <Stack.Screen name="TestList" component={TestList} />
          <Stack.Screen name="TakeTest" component={TakeTest} />
          <Stack.Screen name="TestResult" component={TestResult} />
        </>
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <UserProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
