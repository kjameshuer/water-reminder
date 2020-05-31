import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, FlatList, View } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { addToDrinkTotalToday } from '../helpers/Database';

export default function InputScreen() {

  return (
    <View style={styles.container} contentContainerStyle={styles.contentContainer}>
      <FlatList
        data={DATA}
        renderItem={({ item }) => <Item name={item.name} amount={item.amount} type={item.type} />}
        keyExtractor={item => `${item.id}`}
      />
    </View>
  );
}
const handleOnDrinkPress = async (num, type) => {
  await addToDrinkTotalToday(num, type)

}
const Item = ({ name, amount, type }) => {
  // console.log("typeof", typeof(name), typeof(amount), typeof(type))
  return (
    <TouchableOpacity onPress={() => handleOnDrinkPress(amount, type)} style={styles.item}>
      <Text>{name}</Text>
      <Text>{`${amount}`}</Text>
    </TouchableOpacity>
  )
}

const DATA = [
  {
    id: 11313514643,
    amount: 250,
    name: 'Small Coffee',
    type: 'coffee'
  },
  {
    id: 2148545851351,
    amount: 540,
    name: 'Large Coffee',
    type: 'coffee'
  }
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    width: '100%'
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  item: {
    borderWidth: 2,
    borderColor: '#333333',
    marginVertical: 4,
    marginHorizontal: 4,
    maxWidth: '30%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
