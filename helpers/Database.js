// import SQLite from "react-native-sqlite-2";
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("water.db", "1.0", "", 1);
export const init = () => {
    db.transaction(txn => {
        txn.executeSql(
            `create table if not exists water_entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            drinkable VARCHAR(30),
            amount INTEGER,
            created_at DATETIME default current_timestamp)`,
            [],
            (txn, res) => { },
            (_, error) => console.log("Error creating water_entries table", error)
        );
        txn.executeSql(
            `create table if not exists water_settings (
            id INTEGER PRIMARY KEY NOT NULL,
            name VARCHAR(30),
            value VARCHAR(30));`,
            [],
            (txn, res) => { },
            (_, error) => console.log("Error creating water_settings table", error)
        );
        txn.executeSql(
            "insert into water_entries (drinkable, amount) values ('water', ?)",
            [Math.floor(Math.random() * 1000)],
            (txn, res) => { },
            (_, error) => console.log("Error inserting water_entries table", error)
        );
    },
        error => console.log("transaction error")
    )
}


export const querySettings = () => {
    db.transaction(txn => {
        txn.executeSql(
            "SELECT * FROM water_settings",
            [],
            (txn, res) => console.log("settings rows", res.rows, res.rowsAffected),
            (_, error) => console.log("Error: ", error)
        );
    });
}

export const queryEntries = entry_date_range => {
    db.transaction(txn => {
        txn.executeSql(
            "SELECT * FROM water_entries",
            [],
            (txn, res) => { },
            (_, error) => console.log("Error: ", error)
        );
    });
}

export const addToDailyDrinkTotal = num => {

    const promise = new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(
                "insert into water_entries (drinkable, amount) values ('water', ?)",
                [300],
                (txn, res) => {
                    txn.executeSql(
                        "SELECT sum(amount) as sum FROM water_entries where created_at > date('now','start of day')",
                        [],
                        (txn, res) => {
                            resolve(res.rows._array[0].sum)
                        },
                        (_, error) => console.log("Error: ", error)
                    );
                },
                (_, error) => reject("Error inserting water_entries table" + error)
            );
        });
    })

    return promise

}

export const dropTables = () => {
    db.transaction(txn => {
        txn.executeSql(
            "DROP TABLE IF EXISTS water_entries",
            [],
            (txn, res) => { console.log("table dropped maybe") },
            (_, error) => console.log("Error dropping water_entries table", error)
        );
        txn.executeSql(
            "DROP TABLE IF EXISTS water_settings",
            [],
            (txn, res) => { console.log("table dropped maybe") },
            (_, error) => console.log("Error dropping water_settings table", error)
        );
        console.log('dropping')
    });
}