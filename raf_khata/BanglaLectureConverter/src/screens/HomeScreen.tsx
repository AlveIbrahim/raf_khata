import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import {Button, Card, Title, Paragraph} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationProp} from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

interface NoteData {
  id: string;
  notes: string;
  originalTranscript: string;
  translatedText: string;
  timestamp: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const [savedNotes, setSavedNotes] = useState<NoteData[]>([]);

  useEffect(() => {
    const loadSavedNotes = async () => {
      try {
        const notesJSON = await AsyncStorage.getItem('savedNotes');
        if (notesJSON) {
          setSavedNotes(JSON.parse(notesJSON));
        }
      } catch (error) {
        console.error('Error loading saved notes:', error);
      }
    };

    // Load notes when screen gains focus
    const unsubscribe = navigation.addListener('focus', loadSavedNotes);
    
    // Initial load
    loadSavedNotes();
    
    return unsubscribe;
  }, [navigation]);

  const renderNoteItem = ({item}: ListRenderItemInfo<NoteData>) => {
    const date = new Date(item.timestamp);
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    
    return (
      <Card style={styles.noteCard} onPress={() => viewSavedNote(item)}>
        <Card.Content>
        <Title numberOfLines={1}>{formattedDate}</Title>
          <Paragraph numberOfLines={2}>
            {item.notes.substring(0, 100)}...
          </Paragraph>
        </Card.Content>
      </Card>
    );
  };

  const viewSavedNote = (noteData: NoteData) => {
    navigation.navigate('Result', {
      notes: noteData.notes,
      originalTranscript: noteData.originalTranscript,
      translatedText: noteData.translatedText,
    });
  };

  return (
    <View style={styles.container}>
      <Card style={styles.welcomeCard}>
        <Card.Content>
          <Title>Welcome to Bangla Lecture Converter</Title>
          <Paragraph>
            Convert your Bangla lectures into English notes with just a few taps.
            Record directly or upload existing audio files.
          </Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.optionsContainer}>
        <Card style={styles.optionCard} onPress={() => navigation.navigate('Record')}>
          <Card.Content>
            <Title>Record</Title>
            <Paragraph>Record a live Bangla lecture</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.optionCard} onPress={() => navigation.navigate('Upload')}>
          <Card.Content>
            <Title>Upload</Title>
            <Paragraph>Upload an existing audio file</Paragraph>
          </Card.Content>
        </Card>
      </View>

      {savedNotes.length > 0 && (
        <View style={styles.savedNotesContainer}>
          <Title style={styles.sectionTitle}>Saved Notes</Title>
          <FlatList
            data={savedNotes.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())}
            renderItem={renderNoteItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.notesList}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  welcomeCard: {
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  optionCard: {
    width: '48%',
    height: 120,
    justifyContent: 'center',
  },
  savedNotesContainer: {
    flex: 1,
  },
  sectionTitle: {
    marginBottom: 10,
  },
  notesList: {
    paddingBottom: 20,
  },
  noteCard: {
    marginBottom: 10,
  },
});

export default HomeScreen;