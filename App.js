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
import RNPickerSelect from 'react-native-picker-select';

// Import components
import Dotw from './components/Dotw';

// Import utilities
import * as AsyncStorageUtils from './utils/AsyncStorage';

/*
 * =================================================================================================
 * APP MANAGEMENT
 * =================================================================================================
 */

// Create the stack and tab navigators
const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

// Stack manager component
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={({ navigation }) => ({
            headerStyle: { height: 100 },
            headerRight: () => (
              <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
                <View style={styles.profileCircle}></View>
              </TouchableOpacity>
            ),
          })} />
        <Stack.Screen name="Logger" component={Logger} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/*
 * =================================================================================================
 * HOME PAGE
 * =================================================================================================
 */

function Home({ navigation }){

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
            onPress = {() => navigation.navigate('Logger', { fullDate: day.fullDate })}
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

function Logger({ route, navigation }) {
  const { name, fullDate } = route.params;

  // State variable workouts stores our resistance exercises in an array
  const [workouts, setWorkouts] = useState([]);

  // State variable cardio stores our cardio exercises in an array
  const [cardios, setCardios] = useState([]);

  // Use state to track personal records (PRs)
  const [prs, setPRs] = useState({});

  // Load workouts and PRs from async storage when the component mounts
  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const storedWorkouts = await AsyncStorageUtils.getItem(`workouts-${fullDate}`);
        if (storedWorkouts) {
          setWorkouts(JSON.parse(storedWorkouts));          // Set to retrieved workout
        }
      } catch (error) {
        console.error('Failed to load workouts:', error);
      }
    };

    const loadCardios = async () => {
      try {
        const storedCardios = await AsyncStorageUtils.getItem(`cardios-${fullDate}`);
        if (storedCardios) {
          setCardios(JSON.parse(storedCardios));          // Set to retrieved cardios
        }
      } catch (error) {
        console.error('Failed to load cardios:', error);
      }
    };


    const loadPRs = async () => {
      try {
        const storedPRs = await AsyncStorageUtils.getItem('prs');
        if (storedPRs) {
          setPRs(JSON.parse(storedPRs));                    // Set to retrieved PRs
        }
      } catch (error) {
        console.error('Failed to load PRs:', error);
      }
    };

    loadWorkouts();
    loadCardios();
    loadPRs();
  }, [fullDate]);

  // Save workouts and PRs to async storage whenever they change
  useEffect(() => {
    const saveWorkouts = async () => {
      try {
        await AsyncStorageUtils.setItem(`workouts-${fullDate}`, JSON.stringify(workouts));
      } catch (error) {
        console.error('Failed to save workouts:', error);
      }
    };

    const saveCardios = async () => {
      try {
        await AsyncStorageUtils.setItem(`cardios-${fullDate}`, JSON.stringify(cardios));
      } catch (error) {
        console.error('Failed to save cardios:', error);
      }
    };

    const savePRs = async () => {
      try {
        await AsyncStorageUtils.setItem('prs', JSON.stringify(prs));
      } catch (error) {
        console.error('Failed to save PRs:', error);
      }
    };

    saveWorkouts();
    saveCardios();
    savePRs();
  }, [workouts, cardios, fullDate, prs]);

  // Creates a new workout object (exerciseName, sets, reps, weight) to store in our array
  const addWorkout = () => {
    setWorkouts([...workouts, { exerciseName: '', sets: '', reps: '', weight: '' }]);
  };

  // Function to add a new cardio entry
  const addCardio = () => {
    setCardios([...cardios, { cardioName: '', time: '', distance: '', unit: 'miles' }]);
  };

  // Handles when a value in a workout object is changed
  const handleResistanceChange = (index, field, value) => {
    const newWorkouts = [...workouts];
    newWorkouts[index][field] = value;

    const exerciseName = newWorkouts[index].exerciseName;
    const currentPR = prs[exerciseName] || { weight: 0, reps: 0 };

    const weight = parseInt(newWorkouts[index].weight, 10);
    const reps = parseInt(newWorkouts[index].reps, 10);

    // New resistance PR has been set if either...
    if (weight > currentPR.weight ||                             // New weight > current PR's weight OR
       (weight === currentPR.weight && reps > currentPR.reps)) { // New weight = PR's weight but there were more reps
      setPRs({
        ...prs,
        [exerciseName]: {
          weight: newWorkouts[index].weight,
          reps: newWorkouts[index].reps
        }
      });
      newWorkouts[index].pr = true;
    } else {
      newWorkouts[index].pr = false;
    }

    setWorkouts(newWorkouts);
  };

  // Handles when a value in a cardio object is changed
  const handleCardioChange = (index, field, value) => {
    const newCardios = [...cardios];
    newCardios[index][field] = value;
  
    const cardioName = newCardios[index].cardioName;
    const distance = roundDistance(parseFloat(newCardios[index].distance));
    const currentPR = prs[`${cardioName}-${distance}m`] || { time: '99:99' }; // Use a large default time to ensure any time is better
  
    const time = newCardios[index].time;
  
    // Convert time to minutes and seconds for comparison
    const [currentMinutes, currentSeconds] = currentPR.time.split(':').map(Number);
    const [newMinutes, newSeconds] = time.split(':').map(Number);
  
    const currentTotalSeconds = currentMinutes * 60 + currentSeconds;
    const newTotalSeconds = newMinutes * 60 + newSeconds;
  
    // New cardio PR has been set if new time is less than current PR time
    if (newTotalSeconds < currentTotalSeconds) {
      setPRs({
        ...prs,
        [`${cardioName}-${distance}m`]: {
          time: newCardios[index].time,
          distance: newCardios[index].distance
        }
      });
      newCardios[index].pr = true;
    } else {
      newCardios[index].pr = false;
    }
  
    setCardios(newCardios);
  };  

  // Handles time formatting for cardio section
  const handleTime = (index, value, cardios, setCardios) => {
    const formattedValue = value.replace(/[^0-9]/g, '').slice(0, 4); // Limit to 4 digits
    let minutes = formattedValue.slice(0, 2);                        // First two digits = minutes
    let seconds = formattedValue.slice(2, 4);                        // Second two digits =
  
    if (seconds && parseInt(seconds, 10) > 59) {
      seconds = '59';
    }
  
    const time = `${minutes}:${seconds}`;
  
    const newCardios = [...cardios];
    newCardios[index].time = time;
    setCardios(newCardios);
  };

  // Rounding function
  function roundDistance(distance) {
    const integerPart = Math.floor(distance);
    const decimalPart = distance - integerPart;
    if (decimalPart >= 0.8) {
      return integerPart + 1;
    } else {
      return integerPart;
    }
  };

  // Deletes resistance entry
  const deleteResistance = (index) => {
    const newWorkouts = [...workouts];
    newWorkouts.splice(index, 1); 
    setWorkouts(newWorkouts);
  };

  // Deletes cardio entry
  const deleteCardio = (index) => {
    const newCardios = [...cardios];
    newCardios.splice(index, 1); 
    setCardios(newCardios);
  };
  
  // Tab manager
  return (
    <Tab.Navigator>
      <Tab.Screen name="Resistance" component={ResistanceScreen} />
      <Tab.Screen name="Cardio" component={CardioScreen} />
    </Tab.Navigator>
  );

  function ResistanceScreen() {
    const defaultCurrInput = {i: -1, t: "", f: ""};
    const [currInput, setCurrInput] = useState(defaultCurrInput);
  
    return (
      <ScrollView>
        <TouchableOpacity style={styles.addWorkoutButton} onPress={addWorkout}>
          <Text style={{ fontSize: 36, textAlign: 'center' }}>+</Text>
        </TouchableOpacity>
        {workouts.map((workout, index) => (
          <View key={index} style={styles.workoutEntry}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Enter exercise name..."
                value={currInput.f === "name" && index === currInput.i ? currInput.t : workout.exerciseName}
                onFocus={() => {
                  setCurrInput({i: index, t: workout.exerciseName, f: "name"});
                }}
                onBlur={() => {
                  handleResistanceChange(index, 'exerciseName', currInput.t);
                  setCurrInput(defaultCurrInput);
                }}
                onChangeText={(text) => setCurrInput({i: index, t: text, f: "name"})}
              />
              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteResistance(index)}>
                <Text style={styles.deleteButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
  
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <TextInput
                style={[styles.input2, { flex: 1, marginRight: 5 }]}
                placeholder="Sets"
                value={currInput.f === "sets" && index === currInput.i ? currInput.t : workout.sets}
                onFocus={() => {
                  setCurrInput({i: index, t: workout.sets, f: "sets"});
                }}
                onBlur={() => {
                  handleResistanceChange(index, 'sets', currInput.t);
                  setCurrInput(defaultCurrInput);
                }}
                onChangeText={(text) => setCurrInput({i: index, t: text, f: "sets"})}
                keyboardType="numeric"
              />
              <Text style={{ fontSize: 14, paddingRight: 15 }}>sets</Text>
              <TextInput
                style={[styles.input2, { flex: 1, marginRight: 5 }]}
                placeholder="Reps"
                value={currInput.f === "reps" && index === currInput.i ? currInput.t : workout.reps}
                onFocus={() => {
                  setCurrInput({i: index, t: workout.reps, f: "reps"});
                }}
                onBlur={() => {
                  handleResistanceChange(index, 'reps', currInput.t);
                  setCurrInput(defaultCurrInput);
                }}
                onChangeText={(text) => setCurrInput({i: index, t: text, f: "reps"})}
                keyboardType="numeric"
              />
              <Text style={{ fontSize: 14, paddingRight: 15 }}>reps</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1.5 }}>
                <TextInput
                  style={[styles.input2, { flex: 1 }]}
                  placeholder="Weight"
                  value={currInput.f === "weight" && index === currInput.i ? currInput.t : workout.weight}
                  onFocus={() => {
                    setCurrInput({i: index, t: workout.weight, f: "weight"});
                  }}
                  onBlur={() => {
                    handleResistanceChange(index, 'weight', currInput.t);
                    setCurrInput(defaultCurrInput);
                  }}
                  onChangeText={(text) => setCurrInput({i: index, t: text, f: "weight"})}
                  keyboardType="numeric"
                />
                <Text style={{ fontSize: 14, paddingLeft: 5 }}>lb</Text>
              </View>
            </View>
            {workout.pr && <Text style={styles.prBadge}>𓆩🜲𓆪 PR set today!</Text>}
          </View>
        ))}
      </ScrollView>
    );
  }
  
  function CardioScreen() {
    const defaultCurrInput = { i: -1, t: "", f: "" };
    const [currInput, setCurrInput] = useState(defaultCurrInput);
  
    return (
      <ScrollView>
        <TouchableOpacity style={styles.addWorkoutButton} onPress={addCardio}>
          <Text style={{ fontSize: 36, textAlign: 'center' }}>+</Text>
        </TouchableOpacity>
  
        {cardios.map((cardio, index) => (
          <View key={index} style={styles.workoutEntry}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Enter exercise name..."
                value={currInput.f === "name" && index === currInput.i ? currInput.t : cardio.cardioName}
                onFocus={() => {
                  setCurrInput({ i: index, t: cardio.cardioName, f: "name" });
                }}
                onBlur={() => {
                  handleCardioChange(index, 'cardioName', currInput.t);
                  setCurrInput(defaultCurrInput);
                }}
                onChangeText={(text) => setCurrInput({ i: index, t: text, f: "name" })}
              />
              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteCardio(index)}>
                <Text style={styles.deleteButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <TextInput
                style={[styles.input2, { flex: 0.8 }]}
                placeholder="MM:SS"
                value={currInput.f === "time" && index === currInput.i ? currInput.t : cardio.time}
                onFocus={() => {
                  setCurrInput({ i: index, t: cardio.time, f: "time" });
                }}
                onBlur={() => {
                  handleTime(index, currInput.t, cardios, setCardios);
                  setCurrInput(defaultCurrInput);
                }}
                onChangeText={(text) => setCurrInput({ i: index, t: text, f: "time" })}
                keyboardType="numeric"
              />
              <Text style={{ fontSize: 14, paddingRight: 20 }}>min</Text>
              <TextInput
                style={[styles.input2, { width: '30%' }]}
                placeholder="Distance"
                value={currInput.f === "distance" && index === currInput.i ? currInput.t : cardio.distance}
                onFocus={() => {
                  setCurrInput({ i: index, t: cardio.distance, f: "distance" });
                }}
                onBlur={() => {
                  handleCardioChange(index, 'distance', currInput.t);
                  setCurrInput(defaultCurrInput);
                }}
                onChangeText={(text) => setCurrInput({ i: index, t: text, f: "distance" })}
                keyboardType="numeric"
              />
              <RNPickerSelect
                onValueChange={(value) => handleCardioChange(index, 'unit', value)}
                items={[
                  { label: 'mi', value: 'miles' },
                  { label: 'k', value: 'kilometers' },
                  { label: 'm', value: 'meters' },
                ]}
                value={cardio.unit || 'miles'}
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
              />
            </View>
            {cardio.pr && <Text style={styles.prBadge}>𓆩🜲𓆪 PR set for {roundDistance(parseFloat(cardio.distance))} {cardio.unit}!</Text>}
          </View>
        ))}
      </ScrollView>
    );
  }

}  

/*
 * =================================================================================================
 * PROFILE PAGE
 * =================================================================================================
 */

const Profile = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
    </View>
  );
};

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
    paddingVertical: 15
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
  },
  profileButton: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#a6a6a6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButtonText: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
  }, 
  deleteButton: {
    backgroundColor: '#9e212e',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12
  }
});

// Style for the drop-down menu. Used in unit selection
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 40,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 4,
    color: 'black',
    paddingLeft: 5,
    paddingRight: 30
  },
  inputAndroid: {
    height: 40,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 4,
    color: 'black',
    paddingLeft: 5,
    paddingRight: 30
  }
});