import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider as PaperProvider} from 'react-native-paper';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import RecordScreen from './src/screens/RecordScreen';
import UploadScreen from './src/screens/UploadScreen';
import ProcessingScreen from './src/screens/ProcessingScreen';
import ResultScreen from './src/screens/ResultScreen';

// Define the stack navigator param list
export type RootStackParamList = {
  Home: undefined;
  Record: undefined;
  Upload: undefined;
  Processing: {
    audioPath: string;
    source: 'recording' | 'upload';
    fileName?: string;
  };
  Result: {
    notes: string;
    originalTranscript: string;
    translatedText: string;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{title: 'Bangla Lecture Converter'}}
          />
          <Stack.Screen 
            name="Record" 
            component={RecordScreen} 
            options={{title: 'Record Lecture'}}
          />
          <Stack.Screen 
            name="Upload" 
            component={UploadScreen} 
            options={{title: 'Upload Lecture'}}
          />
          <Stack.Screen 
            name="Processing" 
            component={ProcessingScreen} 
            options={{title: 'Processing Lecture'}}
          />
          <Stack.Screen 
            name="Result" 
            component={ResultScreen} 
            options={{title: 'Generated Notes'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;