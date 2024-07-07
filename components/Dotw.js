import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

export default function Dotw({ day, date, goal, isToday }) {
  return (
    <View style={styles.buttonContainer}>
      <View style={[styles.actualButton, isToday && styles.todayButton]}>
        <View style={styles.dayDateContainer}>
          <Text style={[styles.day, isToday && styles.todayText]}>{day}</Text>
          <Text style={[styles.date, isToday && styles.todayText]}>{date}</Text>
        </View>
        <Pressable style={styles.goal} onPress={() => alert("You pressed me")}>
          <Text style={[styles.goalText, isToday && styles.todayText]}>{goal}</Text>
        </Pressable>
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
