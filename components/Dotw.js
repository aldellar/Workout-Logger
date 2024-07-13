/*
 * =================================================================================================
 * DEPENDENCIES
 * =================================================================================================
 */

// Import packages
import { StyleSheet, Text, View, Pressable, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import RNPickerSelect from 'react-native-picker-select';

// Import utilities
import * as AsyncStorageUtils from '../utils/AsyncStorage';

/*
 * =================================================================================================
 * COMPONENTS
 * =================================================================================================
 */

export default function Dotw({ day, date, fullDate, goal, isToday,  onSelect, isSelected }) {

  // State to keep track of the selected goal for this day
  const [selectedGoal, setGoal] = useState(goal);

  // Load the selected goal from async storage when the component mounts or the day changes
  useEffect(() => {
    const loadSelectedGoal = async () => {
      const savedGoal = await AsyncStorageUtils.getItem(fullDate);  // Retrieve the saved goal for this date
      if (savedGoal) {
        setGoal(savedGoal);                                         // Set the goal as the goal from storage
      } else {
        setGoal(null);                                              // Keep the goal clear
      }
    };
    loadSelectedGoal();
  }, [fullDate]);                                                   // Runs when component mounts or fullDate changes

  const handleValueChange = async (value) => {
    //set goal is updated the selected goal state this is just a change to the original
    //code without changing to much functionality
    setGoal(value);
    //set the items using the set item function with the key being hte day and date
    //the value being the goal
    await AsyncStorageUtils.setItem(fullDate, value);
    //on select is a callback it is called with the new selection
    if (onSelect) {
      //if onselect is defined it passed an object containing day date and goal value as an argument
      //to onselect
      onSelect({ day, date, fullDate, goal: value });
    }
  };

  // Goal placeholder text
  const placeholder = {
    label: 'Select an option...',
    value: null
  };

  const options = [
    { label: 'Arms', value: 'Arms' },
    { label: 'Chest', value: 'Chest' },
    { label: 'Back', value: 'Back' },
    { label: 'Legs', value: 'Legs' },
    { label: 'Core', value: 'Core' },
    { label: 'Rest', value: 'Rest' },
    { label: 'Other', value: 'Other' },
  ];

  // Render the UI
  return (
    <View style={[styles.buttonContainer, isSelected && styles.selected]}  >
      <View style={[styles.actualButton, isToday && styles.todayButton]}>
        <View style={styles.dayDateContainer}>
          <Text style={[styles.day, isToday && styles.todayText]}>{day}</Text>
          <Text style={[styles.date, isToday && styles.todayText]}>{date}</Text>
        </View>
        <RNPickerSelect
          placeholder={placeholder}
          items={options}
          // When the selected value is changed we are calling the handle value change function
          onValueChange={handleValueChange}
          value={selectedGoal}
        />
      </View>
    </View >
  );
}

/*
 * =================================================================================================
 * STYLES
 * =================================================================================================
 */

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
    backgroundColor: '#ffeb3b',
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
    fontWeight: 'bold',
    color: '#d32f2f'
  },
  goal: {
    marginTop: 10
  },
  goalText: {
    color: '#000'
  },
  selected: {
    backgroundColor: '#d3d3d3'
  }
});
