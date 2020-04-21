import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';

export default function InputScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <FlatList
        data={DATA}
        renderItem={({ item }) => <Item name={item.name} amount={item.amount.toString()} />}
        keyExtractor={item => item.id}
      />
    </ScrollView>
  );
}

const Item = ({ name, amount }) => {
  return (
    <TouchableOpacity key={name} style={styles.item}>
      <Text>{name}</Text>
      <Text>{amount}</Text>
    </TouchableOpacity>
  )
}

const DATA = [
  {
    id: 11313514643,
    amount: 250,
    name: 'Small Coffee'
  },
  {
    id: 2148545851351,
    amount: 540,
    name: 'Large Coffee'
  }
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    width: '100%'
  },
  contentContainer:{
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
