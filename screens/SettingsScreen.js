import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';

const SettingsScreen = () => {

    const [settings, setSettings] = useState({ dailyGoal: 2000 })
    const [updated, toggleUpdated] = useState(false)
    const [timeout, updateTimeout] = useState(undefined)

    useEffect(() => {
        //getSettings
        //toggleUpdated(true)
    }, [])

    useEffect(() => {
        console.log("the settings", settings)
        clearTimeout(timeout)
        const asyncFunction = async () => {

            // await call to data base


        }

        updateTimeout(setTimeout(() => {
            asyncFunction();
        }, 1000))



    }, [settings])

    return (
        <View style={styles.settingsScreen}>
            <Text>Daily Goal</Text>
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                value={settings.dailyGoal.toString()} onChange={e => {
                    console.log("EEEEE", e)
                    setSettings({ ...settings, dailyGoal: parseInt(e.nativeEvent.text) })
                }}></TextInput>
        </View>
    )
}

export default SettingsScreen

const styles = StyleSheet.create({
    settingsScreen: {

    }
})