import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

import Dotw from './components/Dotw'

export default function App() {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Dotw day="Monday" goal="My goal" />
        <Dotw day="Tuesday" goal="My goal" />
        <Dotw day="Wednesday" goal="My goal" />
        <Dotw day="Thursday" goal="My goal" />
        <Dotw day="Friday" goal="My goal" />
        <Dotw day="Saturday" goal="My goal" />
        <Dotw day="Sunday" goal="My goal" />
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
});
