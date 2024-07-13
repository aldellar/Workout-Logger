// Imported packages
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
  //adding a state introduces a new state variable to selected item to keep track
  //of the currently selected item
  //use state of the selectedItem is initialized to null meaning it has not been selected
  const [selectedItem, setSelectedItem] = useState(null);
  // State for changing the starting date of the week, initialized to current day
  const [weekStartDate, setWeekStartDate] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  //loading the selected items using useEffect no first or second argument needed in this code
  useEffect(() => {
    //defining an asynchronous function called loadSelected item which loads the
    //selected item from asynchronous starge this function has no parameters
    const loadSelectedItem = async () => {
      //call the getItem function to retrieve the value associated with the key
      const item = await AsyncStorageUtils.getItem('selectedItem');
      //verify again the data validity to make sure it was actually recieved from storage
      //so we dont set selectedItem to null
      if (item) {
        //calling setSelectedItem using the value we just got from the key
        //to update the state of selected item with the retrieved item
        //basically this is returning if the user selected a thing from the dropdown menu 
        //the actual item itself
        setSelectedItem(item);
      }
    };
    //end load selected item function declaration
    loadSelectedItem();
  }, []);

  //defining the handleSelected item function it is an aysnchronous funciton
  //it takes in one paramter named item which is representing the item being selected
  const handleSelectItem = async (item) => {
    //given them it calls set selected item function to update the state with the new value item
    //this is an updater function returned by the use state hoo
    setSelectedItem(item);
    //storing the selected item in the async storaage as selected item
    await AsyncStorageUtils.setItem('selectedItem', item);
  }
  //end handle select item function

  const generateWeekDates = (startDate) => {
    let week = [];
    let currentDay = startOfWeek(startDate, { weekStartsOn: 1 });

    for (let i = 0; i < 7; i++) {
      week.push({
        id: `${format(currentDay, 'yyyy-MM-dd')}-${i}`, // Add a unique id to each day object
        dayOfWeek: format(currentDay, 'EEEE'),
        date: format(currentDay, 'd'),
        fullDate: format(currentDay, 'yyyy-MM-dd')
      });
      currentDay = addDays(currentDay, 1);
    }

    return week;
  };

  const weekDates = generateWeekDates(weekStartDate);
  const currentMonthYear = format(weekStartDate, 'MMMM yyyy');
  const today = format(new Date(), 'yyyy-MM-dd')
  
  // Previous week function
  const prevWeek = () => {
    setWeekStartDate(prevDate => addDays(prevDate, -7));  // Changes start date to 7 days earlier
  }

  // Next week function
  const nextWeek = () => {
    setWeekStartDate(prevDate => addDays(prevDate, 7));  // Changes start date to 7 days later
  }


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
        {weekDates.map((day) => (
        //EXAMPLE OF HOW TO CALL A FUNCTION TO A DIFFERENT HOMESCREEN
        //added touchable days of the week to navigate to logger screen
         <TouchableOpacity key={day.id} style={styles.buttonContainer} onPress={() => navigation.navigate('Logger', { name: 'Logger' })}>
            <Dotw
              day={day.dayOfWeek}
              date={day.date}
              fullDate={day.fullDate}
              goal={`Goal for ${day.dayOfWeek}`}
              //error seemed to come here not parseISO'ing the day.full date caused error
              isToday= {format(parseISO((day.fullDate)), 'yyyy-MM-dd') === today}
              //this function is called when the user selectes a day and handles the selected
              //given the current day as its argument
              onSelect={() => handleSelectItem(day)}
              //this is the current state that holds the selected item
              //sets if it is selected so we know to display it
              isSelected={selectedItem && selectedItem.fullDate === day.fullDate}
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


// ------------------------------------------------------------------------------------------------

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

// ------------------------------------------------------------------------------------------------

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
