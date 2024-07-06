import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import Dotw from './components/Dotw'

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Workout Logger</Text>
      <Dotw day="Example day" goal="Example goal" />
      <StatusBar style="auto" />
    </View>
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
