import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {ProgressBar} from 'react-native-paper';

interface ProcessingIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepNames: string[];
  status?: string;
}

const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({
  currentStep, 
  totalSteps, 
  stepNames, 
  status
}) => {
  const progress = totalSteps > 0 ? currentStep / totalSteps : 0;

  const renderStepStatus = (step: string, index: number) => {
    const isCurrentStep = index === currentStep - 1;
    const isCompletedStep = index < currentStep - 1;

    return (
      <View key={index} style={styles.stepRow}>
        <View style={[
          styles.stepIndicator, 
          isCurrentStep && styles.currentStep,
          isCompletedStep && styles.completedStep,
        ]}>
          <Text style={[
            styles.stepNumber, 
            (isCurrentStep || isCompletedStep) && styles.activeStepNumber
          ]}>
            {index + 1}
          </Text>
        </View>
        <View style={styles.stepContent}>
          <Text style={[
            styles.stepName,
            isCurrentStep && styles.currentStepName,
            isCompletedStep && styles.completedStepName,
          ]}>
            {step}
          </Text>
          {isCurrentStep && (
            <View style={styles.statusContainer}>
              <ActivityIndicator size="small" color="#6200ee" />
              <Text style={styles.statusText}>
                {status || 'Processing...'}
              </Text>
            </View>
          )}
          {isCompletedStep && (
            <Text style={styles.completedText}>Completed</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ProgressBar progress={progress} color="#6200ee" style={styles.progressBar} />
      
      <View style={styles.stepsContainer}>
        {stepNames.map(renderStepStatus)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 20,
  },
  stepsContainer: {
    marginTop: 10,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  stepIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  currentStep: {
    backgroundColor: '#6200ee',
  },
  completedStep: {
    backgroundColor: '#4CAF50',
  },
  stepNumber: {
    color: '#757575',
    fontWeight: 'bold',
  },
  activeStepNumber: {
    color: '#fff',
  },
  stepContent: {
    flex: 1,
  },
  stepName: {
    fontSize: 16,
    color: '#757575',
  },
  currentStepName: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
  completedStepName: {
    color: '#4CAF50',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  statusText: {
    marginLeft: 10,
    color: '#6200ee',
    fontSize: 14,
  },
  completedText: {
    marginTop: 5,
    color: '#4CAF50',
    fontSize: 14,
  },
});

export default ProcessingIndicator;