import FinanceScreen from './screens/FinanceScreen';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ImportScreen from './screens/ImportScreen';
import SearchScreen from './screens/SearchScreen';
import FinanceComparisonScreen from './screens/FinanceComparisonScreen';
import TestScreen from './screens/TestScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Test">
        <Stack.Screen name="Test" component={TestScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Import" component={ImportScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="Finance" component={FinanceScreen} />
          <Stack.Screen name="FinanceComparison" component={FinanceComparisonScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
