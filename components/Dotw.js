import { StyleSheet, Text, View, Pressable } from 'react-native';
import React, { useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';

export default function Dotw({ day, date, goal, isToday }) {
  const [selectedGoal, setGoal] = useState(goal);

  const placeholder = { //Placeholder value for unset goal
    label: 'Select an option...',
    value: null
  };

  const options = [     //Options for dropdown menu
    { label: 'Arms', value: 'Arms' },
    { label: 'Chest', value: 'Chest' },
    { label: 'Back', value: 'Back' },
    { label: 'Legs', value: 'Legs' },
    { label: 'Core', value: 'Core' },
    { label: 'Other', value: 'Other' },
  ];

  return (
    <View style={styles.buttonContainer}>
      <View style={[styles.actualButton, isToday && styles.todayButton]}>
        <View style={styles.dayDateContainer}>
          <Text style={[styles.day, isToday && styles.todayText]}>{day}</Text>
          <Text style={[styles.date, isToday && styles.todayText]}>{date}</Text>
        </View>
        <RNPickerSelect
          placeholder = {placeholder}
          items = {options}
          onValueChange = {(value) => setGoal(value)}
          value = {selectedGoal}
         />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignContent: 'left',
    padding: 10,
    width: '100%'
  },
  actualButton: {
    backgroundColor: '#eee',
    border: 'solid',
    padding: 12,
    borderRadius: 25,
    borderColor: '#000',
    borderWidth: 1
  },
  todayButton: {
    backgroundColor: '#ffeb3b', // Highlight color for today
  },
  dayDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  day: {
    fontSize: 24,
    color: '#000'
  },
  date: {
    fontSize: 24,
    color: '#000'
  },
  todayText: {
    fontWeight: 'bold', // Additional style for today's text
    color: '#d32f2f' // Change text color for today
  },
  goal: {
    marginTop: 10
  },
  goalText: {
    color: '#000'
  }
});
