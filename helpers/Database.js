import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("water.db", "1.0", "", 1);
export const addFakeData = async () => {

    // const promise = new Promise((resolve, reject) => {
    //     db.transaction(txn => {
    //         // add fake data
    //         // drank today

    //         // a week ago
    //         // txn.executeSql(
    //         //     "insert into water_entries (drinkable, amount, created_at) values ('week old water', ?, datetime('now', 'localtime','-7 days','start of day','weekday 2'))",
    //         //                 [Math.floor(Math.random() * 100)],
    //         //     (txn, res) => { },
    //         //     (_, error) => console.log("Error inserting week water_entries table", error)
    //         // );
    //         // a month ago
    //         // txn.executeSql(
    //         //     "insert into water_entries (drinkable, amount, created_at) values ('month old water', ?, datetime('now','localtime','start of month','+1 day'))",
    //         //     [Math.floor(Math.random() * 100)],
    //         //     (txn, res) => { },
    //         //     (_, error) => console.log("Error inserting month water_entries table", error)
    //         // );
    //     },
    //         error => reject("transaction error")
    //     )
    // })

    // const value = await promise;
    // return value;

}

export const initializeSettings = async () => {

    const promise = new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(
                "insert into water_settings (name, value) values ('water_goal', ?)",
                [2000.00],
                (txn, res) => { },
                (_, error) => reject("Error inserting water_settings table" + error)
            );
            txn.executeSql(
                "insert into water_settings (name, value) values ('water_measurement', ?)",
                ['mL'],
                (txn, res) => { },
                (_, error) => reject("Error inserting water_settings table" + error)
            );
        },
            error => reject('error in transaction ' + error),
            () => resolve())
    });
    const value = await promise;
    return value;

}


export const querySetting = async settingName => {

    const getValue = new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(
                "SELECT * FROM water_settings where name = ?",
                [settingName],
                (txn, res) => {
                    resolve(res.rows._array[0].value)
                },
                (_, error) => reject("Error: " + error)
            );
        });
    })
    const value = await getValue
    return value;

}

export const queryAllSettings = async () => {
    db.transaction(txn => {
        txn.executeSql(
            "SELECT * FROM water_settings",
            [],
            (txn, res) => console.log("settings rows", res.rows, res.rowsAffected),
            (_, error) => console.log("Error: ", error)
        );
    });
}

export const queryEntries = async startDay => {
    let startDaySql = "SELECT * FROM water_entries where created_at > "
    switch (startDay) {
        case "week":
            startDaySql = startDaySql + "datetime('now', 'localtime','-7 days','start of day','weekday 0')"
            break;
        case "month":
            startDaySql = startDaySql + "datetime('now','localtime','start of month')"
            break;
        default:
            // day
            startDaySql = startDaySql + "datetime('now','localtime','start of day')"
    }

    const promise = new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(
                startDaySql,
                [],
                (txn, res) => {
                    resolve(res.rows._array)
                },
                (_, error) => console.log("Entry query error: ", error)
            );
        });
    })

    const value = await promise;
    return value;
}

export const addToDailyDrinkTotal = async (num, type) => {

    const promise = new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(
                "insert into water_entries (amount, drinkable) values (?, ?)",
                [num, type],
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

    const value = await promise;
    return value;

}

export const dropAndCreateTables = async () => {

    const promise = new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(
                "DROP TABLE IF EXISTS water_entries",
                [],
                (txn, res) => { },
                (_, error) => resolve("Error dropping water_entries table" + error)
            );
            txn.executeSql(
                "DROP TABLE IF EXISTS water_settings",
                [],
                (txn, res) => { console.log('tables dropped'); },
                (_, error) => reject("Error dropping water_settings table" + error)
            );

            txn.executeSql(
                `create table if not exists water_entries (
                    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                    drinkable VARCHAR(30),
                    amount INTEGER,
                    created_at DATETIME default current_timestamp
                );`,
                [],
                (txn, res) => { },
                (_, error) => reject("Error creating water_entries table" + error)
            );
            txn.executeSql(
                `create table if not exists water_settings (
                    id INTEGER PRIMARY KEY NOT NULL,
                    name VARCHAR(30),
                    value VARCHAR(30)
                );`,
                [],
                (txn, res) => {
                    console.log('tables created')
                    resolve()
                },
                (_, error) => reject("Error creating water_settings table " + error)
            );
        });
    })

    const value = await promise;
    return value;

}