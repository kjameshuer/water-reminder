import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ButtonGrid = ({ handleFunction, items }) => {

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
        alignItems: 'center'
    },
    drink_button: {
        padding: 10
    },
    welcomeImage: {
        maxWidth: 60,
        maxHeight: 60
    }
})

