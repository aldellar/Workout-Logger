import { StyleSheet, Text, View, Pressable, TouchableOpacity } from 'react-native';
//importing this because we need to usestate and useeffect these are both for determinging
//if the user selected something on a day
//use effect is something that allows us to perform side effects such as data fetching in this case
//gather the async data storage in a more flexible way
import React, { useState, useEffect } from 'react';
import RNPickerSelect from 'react-native-picker-select';
//importing the storage methods
import * as AsyncStorageUtils from '../utils/AsyncStorage';
//added the onselect and isselcted fields for storage methods
export default function Dotw({ day, date, fullDate, goal, isToday, onSelect, isSelected }) {
  const [selectedGoal, setGoal] = useState(goal);

  //use effect is a hook that loads the selected goal from asyncstorage when the component mouunts
  //or the day or date changes
  //an effect is something outside the scope of the fuction component such as data fetching

  useEffect(() => {
    //defining load select goal an asynchronous function that retrieves the saves goal from 
    //asynchronous storage
    //this function has no paramaters
    const loadSelectedGoal = async () => {
      //store into saved goal using getitem function the key here is the day and the date
      const savedGoal = await AsyncStorageUtils.getItem(fullDate);
      //if the user has set a goal for this given day we will return what the goal is
      if (savedGoal) {
        // here we are setting the goal from the goal from storage
        setGoal(savedGoal);
      } else {
        // If no goal is set for the date, then clear it
        setGoal(null);
      }
    };
    loadSelectedGoal();
    //end load selected goal function declaration
  }, [fullDate]);
  //defining of handle value change a asynchronous function that has one paramter
  //value is the new goal that has been changed
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
    { label: 'Other', value: 'Other' },
  ];
 
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
          //when the selected value is changed we are calling the handle value change function
          onValueChange={handleValueChange}
          value={selectedGoal}
        />
      </View>
    </View >
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
