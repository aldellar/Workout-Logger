import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

export default function Dotw({ day, date, goal }) {
  return (
    <View style={styles.buttonContainer}>
      <View style={styles.actualButton}>
        <View style={styles.dayDateContainer}>
          <Text style={styles.day}>{day}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <Pressable style={styles.goal} onPress={() => alert("You pressed me")}>
          <Text style={styles.goalText}>{goal}</Text>
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
  goal: {
    marginTop: 10
  },
  goalText: {
    color: '#000'
  }
});
