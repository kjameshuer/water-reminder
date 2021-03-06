import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("water.db", "1.0", "", 1);

export const updateSettings = async (settingsId, settingsHash) => {
  let settingsSQL = "UPDATE water_settings SET";
  for (var settingName in settingsHash) {
    if (['startTime', 'endTime'].includes(settingName)) {
      settingsSQL =
        settingsSQL +
        " " +
        settingName +
        " = time('" +
        settingsHash[settingName] +
        "'),";
    } else if (typeof settingsHash[settingName] === 'string') {
      settingsSQL =
        settingsSQL +
        " " +
        settingName +
        " = '" + settingsHash[settingName] +
        "',";
    } else {
      settingsSQL =
        settingsSQL +
        " " +
        settingName +
        " = " +
        settingsHash[settingName] +
        ",";
    }
  }
  settingsSQL = settingsSQL.substring(0, settingsSQL.length - 1) + " WHERE ID = " + settingsId;

  const noValue = new Promise((resolve, reject) => {
    db.transaction((txn) => {
      txn.executeSql(
        settingsSQL,
        [],
        (txn, res) => {
          resolve();
        },
        (_, error) => reject("Error: " + error)
      );
    });
  });

  const nothing = await noValue;
  return nothing;
};

export const querySetting = async settingName => {
  const getValue = new Promise((resolve, reject) => {
    db.transaction(txn => {
      txn.executeSql(
        "SELECT * FROM water_settings LIMIT 1",
        [],
        (txn, res) => {
          // console.log("returning: ", settingName, res.rows._array[0][settingName]);
          resolve(res.rows._array[0][settingName]);
        },
        (_, error) => reject("Error: " + error)
      );
    });
  })

  const value = await getValue
  return value;
}

export const queryAllSettings = async () => {
  const getSettings = new Promise((resolve, reject) => {
    db.transaction((txn) => {
      txn.executeSql(
        "SELECT * FROM water_settings LIMIT 1",
        [],
        (txn, res) => {
          resolve(res.rows._array[0]);
        },
        (_, error) => reject("Error: " + error)
      );
    });
  });

  const settingsObject = await getSettings;
  return settingsObject;
}

export const queryEntries = async startDay => {
  let startDaySql = "" 
  switch (startDay) { 
    case "month":
      startDaySql = `SELECT strftime('%Y-%m-%d', created_at) as date, strftime('%d', created_at) as day, sum(amount) as sum 
              FROM water_entries
              where datetime('now','localtime','start of month')
              group by strftime('%Y-%m-%dT%H:00:00.000', created_at)`
      break;
    case "week":
      startDaySql = `SELECT strftime('%Y-%m-%d', created_at) as date, strftime('%d', created_at) as measure, sum(amount) as amount 
              FROM water_entries
              where created_at between datetime('now','localtime','weekday 0','-7 days','start of day') and datetime('now','localtime','weekday 0','start of day') 
              group by strftime('%Y-%m-%d', created_at)`
      break;
    default:
      // day
      startDaySql = `SELECT strftime('%H', created_at) as measure, sum(amount) as amount 
              FROM water_entries 
              where created_at > datetime('now','localtime','start of day') 
              group by strftime('%H', created_at)`
  }
  
  const promise = new Promise((resolve, reject) => {
    db.transaction(txn => {
      txn.executeSql(
        startDaySql,
        [],
        (txn, res) => {
          let entryCount;
          let finalEntries = [];
          
          switch (startDay) { 
            case "month":
              const d = new Date();
              const m = d.getMonth();
              const y = d.getFullYear()

              entryCount = new Date(y, m + 1, 0).getDate();
              finalEntries = padEntries(res, entryCount, true);
              break;
            case "week":
              entryCount = 7;
              finalEntries = padEntries(res, entryCount);
              break;
            default:
              //day
              entryCount = 24;
              finalEntries = padEntries(res, entryCount);
          }
          
          resolve({ entries: finalEntries, entryCount: entryCount })
        },
        (_, error) => console.log("Entry query error: ", error)
      );
    });
  })

  const value = await promise;
  return value;
}

const padEntries = (dbEntries, totalEntries, startAtOne = false) => {
  let entries = dbEntries.rows._array;
  let currentNum = startAtOne ? 1 : 0;
  let maxNum = startAtOne ? totalEntries + 1 : totalEntries;
  let paddedEntries = [];
  let currentEntryNum = 0;

  for (currentNum; currentNum < maxNum; currentNum++) {
    let entry = { measure: currentNum, amount: 0 };
    if (currentEntryNum < entries.length && entries[currentEntryNum].measure == currentNum) {
      entry = entries[currentEntryNum]
      currentEntryNum++;
    }
    paddedEntries.push(entry);
  }
  return paddedEntries;
}

export const addToDrinkTotalToday = async (num, type) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(txn => {
      txn.executeSql(
        "insert into water_entries (amount, drinkable, created_at) values (?, ?, datetime('now','localtime'))",
        [num, type],
        (txn, res) => resolve(getDrinkTotalToday()),
        (_, error) => reject("Error inserting water_entries table" + error)
      );
    });
  })

  const dailySum = await promise;
  return dailySum;
}

export const getDrinkTotalToday = async () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(txn => {
      txn.executeSql(
        "SELECT sum(amount) as sum FROM water_entries where created_at > date('now','localtime','start of day')",
        [],
        (txn, res) => resolve(res.rows._array[0].sum),
        (_, error) => reject(error)
      )
    },
      (_, error) => reject("Error querying dailydrinktotal" + error)
    )
  })

  const response = await promise;
  return response;
}

export const getDrinkTypeTotalsToday = async () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(txn => {
      txn.executeSql(
        "SELECT count(*) as count, drinkable FROM water_entries where created_at > date('now','localtime','start of day') group by drinkable",
        [],
        (txn, res) => resolve(res.rows._array),
        (_, error) => reject(error)
      )
    },
      (_, error) => reject("Error querying drinktypestoday" + error)
    )
  })

  const response = await promise;
  return response;
}

export const createTables = async () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(txn => {
      txn.executeSql(
        `create table if not exists water_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        drinkable VARCHAR(30),
        amount INTEGER,
        created_at DATETIME default (datetime('now','localtime'))
    );`,
        [],
        (txn, res) => { },
        (_, error) => reject("Error creating water_entries table" + error)
      );
      txn.executeSql(
        `create table if not exists water_settings (
        id INTEGER PRIMARY KEY NOT NULL,
        goal INTEGER, 
        measurement VARCHAR(30),
        frequency VARCHAR(30), 
        sunday INTEGER(1), 
        monday INTEGER(1), 
        tuesday INTEGER(1), 
        wednesday INTEGER(1),
        thursday INTEGER(1), 
        friday INTEGER(1), 
        saturday INTEGER(1), 
        startTime TIME, 
        endTime TIME
    );`,
        [],
        (txn, res) => {


        },
        (_, error) =>
          reject("Error creating water_settings table " + error)
      );

      txn.executeSql(
        `create table if not exists water_types (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            name VARCHAR(30),
            drinkable VARCHAR(30),
            amount INTEGER
        );`,
        [],
        (txn, res) => { console.log("tables created"); resolve() },
        (_, error) => reject("Error creating water_types table" + error)
      );
    });
  });

  const response = await promise;
  return response;
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
        (txn, res) => { },
        (_, error) => reject("Error dropping water_settings table" + error)
      );
      txn.executeSql(
        "DROP TABLE IF EXISTS water_types",
        [],
        (txn, res) => { console.log('tables dropped'); },
        (_, error) => reject("Error dropping water_types table" + error)
      );

      txn.executeSql(
        `create table if not exists water_entries (
                    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                    drinkable VARCHAR(30),
                    amount INTEGER,
                    created_at DATETIME default (datetime('now','localtime'))
                );`,
        [],
        (txn, res) => { },
        (_, error) => reject("Error creating water_entries table" + error)
      );
      txn.executeSql(
        `create table if not exists water_settings (
                    id INTEGER PRIMARY KEY NOT NULL,
                    goal INTEGER, 
                    measurement VARCHAR(30),
                    frequency VARCHAR(30), 
                    sunday INTEGER(1), 
                    monday INTEGER(1), 
                    tuesday INTEGER(1), 
                    wednesday INTEGER(1),
                    thursday INTEGER(1), 
                    friday INTEGER(1), 
                    saturday INTEGER(1), 
                    startTime TIME, 
                    endTime TIME
                );`,
        [],
        (txn, res) => {
          console.log("tables created");
          resolve();
        },
        (_, error) =>
          reject("Error creating water_settings table " + error)
      );

      txn.executeSql(
        `create table if not exists water_types (
                  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                  name VARCHAR(30),
                  drinkable VARCHAR(30),
                  amount INTEGER
              );`,
        [],
        (txn, res) => { },
        (_, error) => reject("Error creating water_types table" + error)
      );

    });
  })

  const value = await promise;
  return value;
}

export const initializeSettings = async () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(
      (txn) => {
        let settingsId = 0;
        txn.executeSql(
          "SELECT * FROM water_settings LIMIT 1",
          [],
          (txn, res) => {
            if (res.rows._array.length === 0) {
              txn.executeSql(
                `insert into water_settings ( 
                            goal, measurement, frequency, 
                            sunday, monday, tuesday, wednesday, thursday, friday, saturday, 
                            startTime, endTime 
                        ) values (
                            '1000.0', 'ml', '1h', 
                            1, 1, 1, 1, 1, 1, 1, 
                            time('08:00:00'), time('22:00:00')
                        )`,
                [],
                (txn, res) => resolve(res.insertId),
                (_, error) =>
                  reject("Error inserting water_settings table" + error)
              );
            } else {
              resolve(res.rows._array[0].id)
            }
          },
          (_, error) => reject("Error: " + error)
        );
      },
      (error) => reject("error in transaction " + error),
      () => resolve()
    );
  });

  const settingsId = await promise;
  return settingsId;
};

export const addFakeData = async () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(txn => {
      // add fake data
      // drank today
      txn.executeSql(
        "insert into water_entries (drinkable, amount, created_at) values ('day old water', ?, datetime('now', 'localtime','-2 hours'))",
        [Math.floor(Math.random() * 100)],
        (txn, res) => { },
        (_, error) => console.log("Error inserting week water_entries table", error)
      );
      // a week ago
      txn.executeSql(
        "insert into water_entries (drinkable, amount, created_at) values ('week old water', ?, datetime('now', 'localtime','-2 days'))",
        [Math.floor(Math.random() * 100)],
        (txn, res) => { },
        (_, error) => console.log("Error inserting week water_entries table", error)
      );
      // a month ago
      txn.executeSql(
        "insert into water_entries (drinkable, amount, created_at) values ('month old water', ?, datetime('now','localtime','start of month','+1 day'))",
        [Math.floor(Math.random() * 100)],
        (txn, res) => { },
        (_, error) => console.log("Error inserting month water_entries table", error)
      );

    },
      error => reject("transaction error" + error)
    ),
      res => resolve()
  })
  const value = await promise;
  return value;
};