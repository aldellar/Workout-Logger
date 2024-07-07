import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { startOfWeek, addDays, format } from 'date-fns';
import Dotw from './components/Dotw';

export default function App() {
  const generateWeekDates = (startDate) => {
    let week = [];
    let currentDay = startOfWeek(startDate, { weekStartsOn: 1 }); // Week starts on Monday

    for (let i = 0; i < 7; i++) {
      week.push({
        dayOfWeek: format(currentDay, 'EEEE'),
        date: format(currentDay, 'd')
      });
      currentDay = addDays(currentDay, 1);
    }

    return week;
  };

  const weekDates = generateWeekDates(new Date());
  const currentMonthYear = format(new Date(), 'MMMM yyyy'); // Get current month and year

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Text style={styles.monthYear}>{currentMonthYear}</Text>
        {weekDates.map((day, index) => (
          <Dotw key={index} day={day.dayOfWeek} date={day.date} goal={`Goal for ${day.dayOfWeek}`} />
        ))}
        <StatusBar style="auto" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 60
  },
  monthYear: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  }
});
