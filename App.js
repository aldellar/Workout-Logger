/*
 * =================================================================================================
 * DEPENDENCIES
 * =================================================================================================
 */

// Import packages
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { startOfWeek, addDays, format, parseISO } from 'date-fns';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// Import components
import Dotw from './components/Dotw';

// Import utilities
import * as AsyncStorageUtils from './utils/AsyncStorage';

// Create the navigation stack
const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

/*
 * =================================================================================================
 * HOME SCREEN PAGE
 * =================================================================================================
 */

function HomeScreen({ navigation }){

  // Use state to track the currently selected item
  const [selectedItem, setSelectedItem] = useState(null);

  // Use state to change starting date of the week, initialized to the most recent Monday
  const [weekStartDate, setWeekStartDate] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  // Load the selected item from async storage when the component mounts
  useEffect(() => {
    const loadSelectedItem = async () => {
      const item = await AsyncStorageUtils.getItem('selectedItem');   // Retrieve the value associated with the key
      if (item) {
        setSelectedItem(item);                                        // Update state with the retrieved item
      }
    };
    loadSelectedItem();
  }, []);                                                             // Runs only once when the component mounts

  // Handle item selection
  const handleSelectItem = async (item) => {
    setSelectedItem(item);                                    // Update selected item
    await AsyncStorageUtils.setItem('selectedItem', item);    // Store selected item in async storage
  }

  // Generate week dates starting from a given date
  const generateWeekDates = (startDate) => {
    let week = [];
    let currentDate = startDate;

    for (let i = 0; i < 7; i++) {
      week.push({
        dayOfWeek: format(currentDate, 'EEEE'),
        date: format(currentDate, 'd'),
        fullDate: format(currentDate, 'yyyy-MM-dd')
      });
      currentDate = addDays(currentDate, 1);
    }

    return week;
  };

  // Generate the dates for the current week, format the dates
  const weekDates = generateWeekDates(weekStartDate);
  const currentMonthYear = format(weekStartDate, 'MMMM yyyy');
  const today = format(new Date(), 'yyyy-MM-dd')

  // Function to calculate previous week dates
  const prevWeek = () => {
    setWeekStartDate(currentDate => addDays(currentDate, -7));  // Shift the start date to 7 days earlier
  }

  // Function to calculate next week dates
  const nextWeek = () => {
    setWeekStartDate(currentDate => addDays(currentDate, 7));   // Shift the start date to 7 days later
  }

  // Render the UI
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>

        <View style={styles.header}>
          <TouchableOpacity style={styles.button} onPress={prevWeek}>
            <Text style={styles.buttonText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.monthYear}>{currentMonthYear}</Text>
          <TouchableOpacity style={styles.button} onPress={nextWeek}>
            <Text style={styles.buttonText}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        {weekDates.map((day, index) => (
          <TouchableOpacity
            key = {index}
            style = {styles.buttonContainer}
            onPress = {() => navigation.navigate('Logger', { name: 'Logger' })}
          >
            <Dotw
              day = {day.dayOfWeek}
              date = {day.date}
              fullDate = {day.fullDate}
              goal = {`Goal for ${day.dayOfWeek}`}
              isToday = {day.fullDate === today}
            />
          </TouchableOpacity>
        ))}

        <StatusBar style="auto" />
      </View>
    </ScrollView>
  );
}

/*
 * =================================================================================================
 * LOGGER PAGE
 * =================================================================================================
 */

function Logger({ route, navigation }){
  const {name} = route.params;

  // State variable workouts stores our exercises in an array
  const [workouts, setWorkouts] = useState([]);

  // Creates a new workout object(name,sets,reps) to store in our array
  // Values in the object are initially empty
  const addWorkout = () => {
    setWorkouts([...workouts, { exerciseName: '', sets: '', reps: '', weight: '' }]);
  };

  // Handles when a value in a workout object is changed
  // Creates a copy of our workout list, editing the object's value based on the index and field given
  // Then updates our original array with setWorkouts()
  const changeWorkout = (index, field, value) => {
    const newWorkout = [...workouts];
    newWorkout[index][field] = value;
    setWorkouts(newWorkout);
  }

  
  return(
    // Structure very similar to stack navigation below
    <Tab.Navigator>
      <Tab.Screen name="Resistance" component={ResistanceScreen} />
      <Tab.Screen name="Cardio" component={CardioScreen} />
    </Tab.Navigator>
  )

function ResistanceScreen() {
  return (
    <ScrollView>
      {/* Adds a new workout; appends to our array a new exercise with blank values initialized */}
      <TouchableOpacity style={styles.addWorkoutButton} onPress={addWorkout}> 
        <Text style={{fontSize: 36, textAlign: 'center'}}>+</Text>
      </TouchableOpacity>
      {/* Iterates over workouts array with the View below for each workout */}
      {workouts.map((workout, index) => ( 
        <View key={index} style={styles.workoutEntry}>
          <TextInput 
          style = {styles.input}
          placeholder = "Enter exercise name..."
          value = {workout.exercise}
          onChangeText={(text) => changeWorkout(index, 'exercise', text)}
          />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TextInput 
          style = {styles.input2}
          placeholder = "Sets"
          value = {workout.sets}
          onChangeText={(text) => changeWorkout(index, 'sets', text)}
          keyboardType = "numeric"
          />
          <TextInput 
          style = {styles.input2}
          placeholder = "Reps"
          value = {workout.reps}
          onChangeText={(text) => changeWorkout(index, 'reps', text)}
          keyboardType = "numeric"
          />
          <TextInput 
          style = {styles.input2}
          placeholder = "Weight"
          value = {workout.weight}
          onChangeText={(text) => changeWorkout(index, 'weight', text)}
          keyboardType = "numeric"
          />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function CardioScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Cardio</Text>
    </View>
  );
}

}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Logger" component={Logger} />
      </Stack.Navigator>
    </NavigationContainer>
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
    width: '100%'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 0
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 10
  },
  monthYear: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  weekChangeButtons: {
    flex: 1
  },
  button: {
    padding: 15,
    backgroundColor: '#a6a6a6'
  },
  buttonText: {
    color: '#fff',
    fontSize: 24
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  addWorkoutButton: {
    backgroundColor: '#a6a6a6',
    padding: 30,
    borderRadius: 20,
    marginBottom: 10,
    marginHorizontal: 10,
    marginTop: 10
  },
  workoutEntry: {
    width: '100%',
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  input2: {
    width: '30%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  }
});
