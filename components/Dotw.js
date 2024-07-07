import {StyleSheet, Text, View, Pressable} from 'react-native';

export default function Dotw({day, goal}) {
  return (
    <View style={styles.buttonContainer}>
      <View style={styles.actualButton}>
        <Text style={styles.day}>{day}</Text>
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
  day: {
    fontSize: 50,
    color: '#000'
  },
  goal: {
    color: '#fff'
  },
  goalText: {
    color: '#000'
  }
});
