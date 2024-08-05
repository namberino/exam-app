import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserProvider } from './components/UserContext';
import Login from './components/Login';
import QuestionUpload from './components/QuestionUpload';
import TestCreation from './components/TestCreation';
import Home from './components/Home';
import TestList from './components/TestList';
import TakeTest from './components/TakeTest';
import TestResult from './components/TestResult';

const Stack = createStackNavigator();

const App = () => {
  return (
    <UserProvider>
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="QuestionUpload" component={QuestionUpload} />
                <Stack.Screen name="TestCreation" component={TestCreation} />
                <Stack.Screen name="TestList" component={TestList} />
                <Stack.Screen name="TakeTest" component={TakeTest} />
                <Stack.Screen name="TestResult" component={TestResult} />
            </Stack.Navigator>
        </NavigationContainer>
    </UserProvider>
  );
};

export default App;
