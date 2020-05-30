import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ButtonGrid = ({ handleFunction, items, counts }) => {

    return (
        <View style={styles.ButtonGrid}>
            {items.map(item => {
                const { name, value, icon } = item;
                return (
                    <TouchableOpacity style={styles.drink_button} key={name} onPress={() => handleFunction(value, name)}>
                        <Image
                            source={icon}
                            style={styles.welcomeImage}
                        />
                        <Text style={{ marginTop: 15, fontSize: 14 }}>{counts[name]}</Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

export default ButtonGrid;

const styles = StyleSheet.create({
    ButtonGrid: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        maxHeight: 75
    },
    drink_button: {
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    welcomeImage: {
        maxWidth: 60,
        maxHeight: 60
    }
})

