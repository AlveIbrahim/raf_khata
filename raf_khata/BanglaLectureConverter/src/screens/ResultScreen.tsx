import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import NoteViewer from '../components/NoteViewer';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type ResultScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Result'>;
type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;

interface ResultScreenProps {
  navigation: ResultScreenNavigationProp;
  route: ResultScreenRouteProp;
}

const ResultScreen: React.FC<ResultScreenProps> = ({navigation, route}) => {
  const {notes, originalTranscript, translatedText} = route.params;

  const goToHome = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <NoteViewer
        notes={notes}
        originalTranscript={originalTranscript}
        translatedText={translatedText}
      />
      
      <Button
        mode="contained"
        onPress={goToHome}
        style={styles.homeButton}
        icon="home"
      >
        Back to Home
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  homeButton: {
    marginTop: 20,
    paddingVertical: 8,
  },
});

export default ResultScreen;