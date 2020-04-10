// import SQLite from "react-native-sqlite-2";
import * as SQLite from 'expo-sqlite';
 
// export const db = SQLite.openDatabase("water.db", "1.0", "", 1);

export const init = () => {
    const db = SQLite.openDatabase("water.db", "1.0", "", 1);
    console.log("Db **: ", db)
    db.transaction(function(txn) {
       
        txn.executeSql(
            "CREATE TABLE IF NOT EXISTS water_entries(id INTEGER PRIMARY KEY NOT NULL, drinkable VARCHAR(30), amount INTEGER, created_at VARCHAR(30))",
            []
        );

        txn.executeSql(
            "CREATE TABLE IF NOT EXISTS settings(id INTEGER PRIMARY KEY NOT NULL, name VARCHAR(30), value VARCHAR(30))",
            []
        );

        // txn.executeSql("INSERT INTO Users (name) VALUES (:name)", ["nora"]);
      
    //   txn.executeSql("INSERT INTO Users (name) VALUES (:name)", ["takuya"]);
     
      txn.executeSql(
          "SELECT * FROM settings", 
          [], 
          function(tx, res) {
              if (res.rows.length === 0) {
                txn.executeSql("INSERT INTO settings (daily_goal) VALUES (:daily_goal)", [2000]);
              }
              console.log("Db after insert: ", db)
          }, 
          function(error, error2){
            console.log("Error: ", error, error2)
          }
      );

      console.log("Db after transaction: ", db)
      
    });    
}

export const dropTables = () => {
    // db.transaction(function(txn) {
    //     txn.executeSql("DROP TABLE IF EXISTS Users", []);
    // });
}