import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
import {Button, Card, Divider} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

interface NoteViewerProps {
  notes: string;
  originalTranscript: string;
  translatedText: string;
}

interface NoteData {
  id: string;
  notes: string;
  originalTranscript: string;
  translatedText: string;
  timestamp: string;
}

const NoteViewer: React.FC<NoteViewerProps> = ({notes, originalTranscript, translatedText}) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'transcript' | 'translation'>('notes');

  const saveNotes = async (): Promise<void> => {
    try {
      const timestamp = new Date().toISOString();
      const noteData: NoteData = {
        id: timestamp,
        notes,
        originalTranscript,
        translatedText,
        timestamp,
      };
      
      // Get existing notes
      const existingNotesJSON = await AsyncStorage.getItem('savedNotes');
      const existingNotes: NoteData[] = existingNotesJSON ? JSON.parse(existingNotesJSON) : [];
      
      // Add new note to existing notes
      const updatedNotes = [...existingNotes, noteData];
      
      // Save back to storage
      await AsyncStorage.setItem('savedNotes', JSON.stringify(updatedNotes));
      
      Alert.alert('Notes saved successfully!');
    } catch (error) {
      console.error('Error saving notes:', error);
      Alert.alert('Failed to save notes. Please try again.');
    }
  };

  const shareNotes = async (): Promise<void> => {
    try {
      const contentToShare = activeTab === 'notes' 
        ? notes 
        : activeTab === 'transcript' 
          ? originalTranscript 
          : translatedText;
      
      await Share.share({
        message: contentToShare,
        title: 'Lecture Notes',
      });
    } catch (error) {
      console.error('Error sharing notes:', error);
      Alert.alert('Failed to share notes. Please try again.');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'notes':
        return (
          <ScrollView style={styles.contentContainer}>
            <Text style={styles.notesText}>{notes}</Text>
          </ScrollView>
        );
      case 'transcript':
        return (
          <ScrollView style={styles.contentContainer}>
            <Text style={styles.transcriptText}>{originalTranscript}</Text>
          </ScrollView>
        );
      case 'translation':
        return (
          <ScrollView style={styles.contentContainer}>
            <Text style={styles.translationText}>{translatedText}</Text>
          </ScrollView>
        );
      default:
        return null;
    }
  };

  return (
    <Card style={styles.container}>
      <Card.Content>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'notes' && styles.activeTab]}
            onPress={() => setActiveTab('notes')}
          >
            <Text style={[styles.tabText, activeTab === 'notes' && styles.activeTabText]}>
              Notes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'transcript' && styles.activeTab]}
            onPress={() => setActiveTab('transcript')}
          >
            <Text style={[styles.tabText, activeTab === 'transcript' && styles.activeTabText]}>
              Transcript
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'translation' && styles.activeTab]}
            onPress={() => setActiveTab('translation')}
          >
            <Text style={[styles.tabText, activeTab === 'translation' && styles.activeTabText]}>
              Translation
            </Text>
          </TouchableOpacity>
        </View>

        <Divider style={styles.divider} />

        {renderTabContent()}

        <View style={styles.actionsContainer}>
          <Button 
            mode="contained" 
            onPress={saveNotes} 
            style={[styles.button, {marginRight: 10}]}
            icon="content-save"
          >
            Save
          </Button>
          <Button 
            mode="outlined" 
            onPress={shareNotes} 
            style={styles.button}
            icon="share-variant"
          >
            Share
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    elevation: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#6200ee',
  },
  tabText: {
    color: '#666',
  },
  activeTabText: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    marginBottom: 15,
  },
  contentContainer: {
    maxHeight: 400,
    marginBottom: 15,
  },
  notesText: {
    fontSize: 16,
    lineHeight: 24,
  },
  transcriptText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  translationText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  button: {
    minWidth: 100,
  },
});

export default NoteViewer;