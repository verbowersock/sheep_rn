import * as SQLite from "expo-sqlite";
import sheep from "../store/slices/sheep";

export const database = SQLite.openDatabase("sheep.db", "1.0", "", 1, () => {});
database.exec([{ sql: "PRAGMA foreign_keys = ON;", args: [] }], false, () =>
  console.log("Foreign keys turned on")
);

const testDataBreeds = [
  "merino",
  "rambouillet",
  "suffolk",
  "hampshire",
  "katahdin",
  "dorper",
  "dorset",
  "southdown",
  "karakul",
  "lincoln",
  "icelandic",
  "navajo churro",
  "leicester longwool",
  "shetland",
  "romanov",
  "east friesian",
];
const testDataColors = ["gray", "black", "white", "red", "brown", "cream"];
const testDataMarkings = [
  "bielset",
  "solid",
  "blaget",
  "bleset",
  "flecket",
  "fronet",
  "iset",
  "katmoget",
  "mirkface",
  "smirslet",
  "sokket",
  "sponget",
  "yuglet",
];
const testDataSheep = [
  {
    tag_id: "abc",
    scrapie_id: "abc1245",
    name: "Test1",
    dob: "02/09/2022",
    sex: "f",
    purchase_date: "03/09/2022",
    breed_id: 1,
    color_id: 2,
    marking_id: 1,
  },
  {
    tag_id: "def",
    scrapie_id: "def1245",
    name: "Test2",
    dob: "02/10/2022",
    sex: "m",
    breed_id: 2,
    color_id: 3,
    marking_id: 2,
    mother: 1,
  },
];

const testDataMeds = [
  {
    id: 1,
    sheep_id: 1,
    entry: 3,
    date: "03/22/2022",
  },
  {
    id: 2,
    sheep_id: 1,
    entry: 2,
    date: "04/22/2022",
  },
  {
    id: 3,
    sheep_id: 1,
    entry: 1,
    date: "05/22/2022",
  },
  {
    id: 4,
    sheep_id: 2,
    entry: 3,
    date: "03/22/2022",
  },
  {
    id: 5,
    sheep_id: 2,
    entry: 2,
    date: "04/22/2022",
  },
  {
    id: 6,
    sheep_id: 2,
    entry: 1,
    date: "05/22/2022",
  },
];

const testDataVax = [
  {
    id: 1,
    sheep_id: 1,
    entry: 3,
    date: "03/25/2022",
  },
  {
    id: 2,
    sheep_id: 1,
    entry: 2,
    date: "04/25/2022",
  },
  {
    id: 3,
    sheep_id: 1,
    entry: 1,
    date: "05/25/2022",
  },
  {
    id: 4,
    sheep_id: 2,
    entry: 3,
    date: "03/25/2022",
  },
  {
    id: 5,
    sheep_id: 2,
    entry: 2,
    date: "04/25/2022",
  },
  {
    id: 6,
    sheep_id: 2,
    entry: 1,
    date: "05/25/2022",
  },
];

export const dropDbTablesAsync = async () => {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        "PRAGMA foreign_keys = 'ON'; drop table if exists sheep",
        [],
        (_, result) => {
          console.log("table sheep deleted");
        },
        (_, error) => {
          console.log("error dropping sheep table");
          reject(error);
        }
      );
      tx.executeSql(
        "PRAGMA foreign_keys = 'ON'; drop table if exists  colors",
        [],
        (_, result) => {
          console.log("table colors deleted");
        },
        (_, error) => {
          console.log("error dropping colors table");
          reject(error);
        }
      );

      tx.executeSql(
        "PRAGMA foreign_keys = 'ON'; drop table if exists markings",
        [],
        (_, result) => {
          console.log("table markings deleted");
        },
        (_, error) => {
          console.log("error dropping markings table");
          reject(error);
        }
      );
      tx.executeSql(
        "PRAGMA foreign_keys = 'ON'; drop table if exists breeds",
        [],
        (_, result) => {
          console.log("table breeds deleted");
          // If this is the last query to execute, call resolve() here
          resolve(result);
        },
        (_, error) => {
          console.log("error dropping breeds table");
          reject(error);
        },
        () => {
          // After the query has completed (successfully or not), call database.close()
          database.close();
        }
      );
    });
  });
};

export function init() {
  console.log("init db");
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS breeds 
        (id  INTEGER PRIMARY KEY NOT NULL, breed_name VARCHAR(255) NOT NULL UNIQUE
        )`,
        []
      );

      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS colors 
        (id  INTEGER PRIMARY KEY NOT NULL, color_name VARCHAR(255) NOT NULL UNIQUE
        )`,
        [],
        (tx, result) => {
          console.log("colors table created successfully");
        },
        (tx, error) => {
          console.log("error creating colors table");
          console.log(error);
          reject(error);
        }
      );

      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS markings 
        (id  INTEGER PRIMARY KEY NOT NULL, marking_name VARCHAR(255) NOT NULL UNIQUE
        )`,
        []
      );

      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS sheep 
        (sheep_id  INTEGER PRIMARY KEY NOT NULL, 
        picture VARCHAR(255), 
        tag_id VARCHAR(255) NOT NULL UNIQUE, 
        scrapie_id VARCHAR(255) UNIQUE, 
        name VARCHAR(255) UNIQUE, 
        dob VARCHAR(50), 
        sex VARCHAR(255) NOT NULL, 
        sire BIGINT REFERENCES sheep (sheep_id) ON DELETE RESTRICT ON UPDATE CASCADE, 
        dam BIGINT REFERENCES sheep (sheep_id) ON DELETE RESTRICT ON UPDATE CASCADE, 
        dop VARCHAR(50), 
        dos VARCHAR(50),
        weight_at_birth INTEGER, 
        dod VARCHAR(255), 
        date_last_bred VARCHAR(255),
        breed_id BIGINT NOT NULL REFERENCES breeds (id) ON DELETE RESTRICT ON UPDATE CASCADE, 
        color_id BIGINT REFERENCES colors (id) ON DELETE RESTRICT ON UPDATE CASCADE, 
        marking_id BIGINT REFERENCES markings (id) ON DELETE RESTRICT ON UPDATE CASCADE
        )`,
        [],
        (_, success) => {
          resolve(success);
        },
        (error) => {
          console.log("db error starting transaction");
          console.log(error);
          reject(error);
        },
        () => {
          // After the query has completed (successfully or not), call database.close()
          database.close();
        }
      );
    });
  });
}
export function insertBreedData() {
  return new Promise((resolve, reject) => {
    testDataBreeds.map((el) => {
      database.transaction((tx) => {
        tx.executeSql(
          `INSERT INTO breeds (breed_name) 
            VALUES (?)`,
          [el],
          (t, success) => {
            resolve(success);
          },
          (t, error) => {
            console.log("db error insertbreed", el);
            console.log(error);
            reject(error);
          },
          () => {
            // After the query has completed (successfully or not), call database.close()
            database.close();
          }
        );
      });
    });
  });
}

export function insertColorData() {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      testDataColors.map((el) => {
        tx.executeSql(
          `INSERT INTO colors (color_name) 
            VALUES (?)`,
          [el],
          (t, success) => {
            resolve(success);
          },
          (t, error) => {
            console.log("db error insertColors");
            console.log(error);
            reject(error);
          },
          () => {
            // After the query has completed (successfully or not), call database.close()
            database.close();
          }
        );
      });
    });
  });
}

export function insertMarkingData() {
  return new Promise((resolve, reject) => {
    testDataMarkings.map((el) => {
      database.transaction((tx) => {
        tx.executeSql(
          `INSERT INTO markings (marking_name) 
            VALUES (?)`,
          [el],
          (t, success) => {
            resolve(success);
          },
          (t, error) => {
            console.log("db error insertMarkings");
            console.log(error);
            reject(error);
          },
          () => {
            // After the query has completed (successfully or not), call database.close()
            database.close();
          }
        );
      });
    });
  });
}

export function insertSheepData() {
  return new Promise((resolve, reject) => {
    testDataSheep.map((sheepData) => {
      database.transaction((tx) => {
        tx.executeSql(
          `INSERT INTO sheep (tag_id, scrapie_id, name, dob, dop, dod, dos, sex, sire, dam, weight_at_birth, breed_id, color_id, marking_id, date_last_bred) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            sheepData.tag_id,
            sheepData.scrapie_id,
            sheepData.name,
            sheepData.dob,
            sheepData.dop,
            sheepData.dod,
            sheepData.dos,
            sheepData.sex,
            sheepData.father,
            sheepData.mother,
            sheepData.weight_at_birth,
            sheepData.breed_id,
            sheepData.color_id,
            sheepData.marking_id,
            sheepData.date_last_bred,
          ],
          (t, success) => {
            resolve(success);
          },
          (t, error) => {
            console.log("db error insert sheep");
            console.log(error);
            reject(error);
          },
          () => {
            // After the query has completed (successfully or not), call database.close()
            database.close();
          }
        );
      });
    });
  });
}

export function insertMedData() {
  return new Promise((resolve, reject) => {
    testDataMeds.map((medData) => {
      database.transaction((tx) => {
        tx.executeSql(
          `INSERT INTO sheep_meds (sheep_id, entry_id, date)
            VALUES (?, ?, ?)`,
          [medData.sheep_id, medData.entry, medData.date],
          (t, success) => {
            resolve(success);
          },
          (t, error) => {
            console.log("db error insert meds");
            console.log(error);
            reject(error);
          },
          () => {
            // After the query has completed (successfully or not), call database.close()
            database.close();
          }
        );
      });
    });
  });
}

export function insertVaxData() {
  return new Promise((resolve, reject) => {
    testDataVax.map((vaxData) => {
      database.transaction((tx) => {
        tx.executeSql(
          `INSERT INTO sheep_vax (sheep_id, entry_id, date)
            VALUES (?, ?, ?)`,
          [vaxData.sheep_id, vaxData.entry, vaxData.date],
          (t, success) => {
            resolve(success);
          },
          (t, error) => {
            console.log("db error insert vax");
            console.log(error);
            reject(error);
          },
          () => {
            // After the query has completed (successfully or not), call database.close()
            database.close();
          }
        );
      });
    });
  });
}

export function fetchSheep() {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT 
  children.sheep_id, 
  children.tag_id, 
  children.name, 
  children.dob, 
  children.dos,
  children.sex, 
  children.dop,
  children.weight_at_birth,
  children.date_last_bred,
  children.dod,
  children.picture,
  children.scrapie_id,
  children.breed_id,
  children.color_id,
  children.marking_id,
  breeds.breed_name,
  children.sire,
  children.dam,
  COALESCE(colors.color_name, 'NA') as color_name,
  COALESCE(markings.marking_name, 'NA') as marking_name,
  sires.name AS father_name,
  sires.tag_id AS father_tag_id,
  dams.name AS mother_name,
  dams.tag_id AS mother_tag_id
FROM
  sheep children
  JOIN breeds ON children.breed_id = breeds.id
  LEFT JOIN colors ON children.color_id = colors.id
  LEFT JOIN markings ON children.marking_id = markings.id
  LEFT JOIN sheep sires ON children.sire = sires.sheep_id
  LEFT JOIN sheep dams ON children.dam = dams.sheep_id;`,
        //  `select * from sheep`,
        [],
        (_, result) => {
          resolve(result.rows._array);
        },
        (_, error) => {
          console.log("error", error);
          reject(error);
        },
        () => {
          // After the query has completed (successfully or not), call database.close()
          database.close();
        }
      );
    });
  });
}

export function fetchBreeds() {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * from breeds`,
        [],
        (_, result) => {
          resolve(result.rows._array);
        },
        (_, error) => {
          console.log("error", error);
          reject(error);
        },
        () => {
          // After the query has completed (successfully or not), call database.close()
          database.close();
        }
      );
    });
  });
}

export function fetchColors() {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * from colors`,
        [],
        (_, result) => {
          resolve(result.rows._array);
        },
        (_, error) => {
          console.log("error", error);
          reject(error);
        },
        () => {
          // After the query has completed (successfully or not), call database.close()
          database.close();
        }
      );
    });
  });
}

export function fetchMarkings() {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * from markings`,
        [],
        (_, result) => {
          resolve(result.rows._array);
        },
        (_, error) => {
          console.log("error", error);
          reject(error);
        },
        () => {
          // After the query has completed (successfully or not), call database.close()
          database.close();
        }
      );
    });
  });
}

export function fetchMales() {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT sheep.sheep_id, sheep.name, sheep.tag_id from sheep WHERE sex='m'`,
        [],
        (_, result) => {
          resolve(result.rows._array);
        },
        (_, error) => {
          console.log("error", error);
          reject(error);
        },
        () => {
          // After the query has completed (successfully or not), call database.close()
          database.close();
        }
      );
    });
  });
}

export function fetchFemales() {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT sheep.sheep_id, sheep.name, sheep.tag_id from sheep WHERE sex='f'`,
        [],
        (_, result) => {
          resolve(result.rows._array);
        },
        (_, error) => {
          console.log("error", error);
          reject(error);
        },
        () => {
          // After the query has completed (successfully or not), call database.close()
          database.close();
        }
      );
    });
  });
}

export function addSheep(sheepData) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      try {
        tx.executeSql(
          `INSERT INTO sheep (picture, tag_id, scrapie_id, name, dob, weight_at_birth, dop, dod, dos, sex, sire, dam, breed_id, color_id, marking_id) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            //"1222122",
            sheepData.picture,
            sheepData.tag_id,
            sheepData.scrapie_id,
            // "1222122",
            sheepData.name,
            //"testvk1122vv",
            sheepData.dob,
            sheepData.weight_at_birth,
            sheepData.dop,
            sheepData.dod,
            sheepData.dos,
            //"2020-12-12",
            sheepData.sex,
            //"m",
            sheepData.sire,
            //undefined,
            sheepData.dam,
            //undefined,
            sheepData.breed,
            //1,
            sheepData.color,
            //1,
            sheepData.marking,
            //1,
          ],
          (t, success) => {
            resolve(success);
          },
          (t, error) => {
            console.log("db error insert sheep");
            console.log(error);
            reject(error);
          }
        );
      } catch (error) {
        console.error(error);
        reject(error);
      }
      () => {
        // After the query has completed (successfully or not), call database.close()
        database.close();
      };
    });
  });
}
export function addBreed(val) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO breeds (breed_name) 
            VALUES (?)`,
        [val],
        (t, success) => {
          resolve(success.insertId);
        },
        (t, error) => {
          console.log("db error inserting breed");
          console.log(error);
          reject(error);
        },
        () => {
          // After the query has completed (successfully or not), call database.close()
          database.close();
        }
      );
    });
  });
}

export function addColor(val) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM colors WHERE color_name = ?`,
        [val],
        (t, results) => {
          if (results.rows.length > 0) {
            // Color already exists, resolve with the existing color's ID
            resolve(results.rows.item(0).id);
          } else {
            // Color does not exist, insert it and resolve with the new color's ID
            tx.executeSql(
              `INSERT INTO colors (color_name) VALUES (?)`,
              [val],
              (t, success) => {
                resolve(success.insertId);
              },
              (t, error) => {
                console.log(error);
                reject(error);
              }
            );
          }
        },
        (t, error) => {
          console.log("db error checking for color");
          console.log(error);
          reject(error);
        },
        () => {
          // After the query has completed (successfully or not), call database.close()
          database.close();
        }
      );
    });
  });
}

export function addMarking(val) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO markings (marking_name) 
            VALUES (?)`,
        [val],
        (t, success) => {
          resolve(success.insertId);
        },
        (t, error) => {
          console.log("db error inserting marking");
          console.log(error);
          reject(error);
        },
        () => {
          // After the query has completed (successfully or not), call database.close()
          database.close();
        }
      );
    });
  });
}

export function deleteMarking(val) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM markings WHERE id = ?`,
        [val],
        (t, success) => {
          console.log("val", val);
          resolve(success);
        },
        (t, error) => {
          console.log(error);
          reject(error);
        },
        () => {
          // After the query has completed (successfully or not), call database.close()
          database.close();
        }
      );
    });
  });
}

export function deleteColor(val) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM colors WHERE id = ?`,
        [val],
        (t, success) => {
          resolve(success);
        },
        (t, error) => {
          console.log("db error deleting color");
          console.log(error);
          reject(error);
        },
        () => {
          // After the query has completed (successfully or not), call database.close()
          database.close();
        }
      );
    });
  });
}

export function deleteBreed(val) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM breeds WHERE id = ?`,
        [val],
        (t, success) => {
          resolve(success);
        },
        (t, error) => {
          console.log("db error deleting breed");
          console.log(error);
          reject(error);
        },
        () => {
          // After the query has completed (successfully or not), call database.close()
          database.close();
        }
      );
    });
  });
}

export function deleteSheep(val) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM sheep WHERE sheep_id = ?`,
        [val],
        (t, success) => {
          resolve(success);
        },
        (t, error) => {
          console.log("db error deleting sheep");
          console.log(error);
          reject(error);
        },
        () => {
          // After the query has completed (successfully or not), call database.close()
          database.close();
        }
      );
    });
  });
}

export function editSheep(sheepData, id) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      console.log("sheepData", sheepData);
      tx.executeSql(
        `UPDATE sheep set tag_id = ?, scrapie_id = ?, name = ?, dob = ?, dop = ?, dod=?, dos=?, sex = ?, sire = ?, dam = ?, weight_at_birth = ?, breed_id = ?, color_id = ?, marking_id = ?, date_last_bred = ?, picture=? where sheep_id=?`,
        [
          sheepData.tag_id,
          sheepData.scrapie_id,
          sheepData.name,
          sheepData.dob,
          sheepData.dop,
          sheepData.dod,
          sheepData.dos,
          sheepData.sex,
          sheepData.sire,
          sheepData.dam,
          sheepData.weight_at_birth,
          sheepData.breed,
          sheepData.color,
          sheepData.marking,
          sheepData.date_last_bred,
          sheepData.picture,
          id,
        ],
        (t, success) => {
          console.log("success", success);
          resolve(success);
        },
        (t, error) => {
          console.log("db error updating sheep");
          console.log(error);
          reject(error);
        }
        //() => {
        // After the query has completed (successfully or not), call database.close()
        //  database.close();
        // }
      );
    });
  });
}

export function findChildren(id) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM sheep WHERE sire = ? OR dam = ?`,
        [id, id],
        (t, results) => {
          console.log("children", results);
          resolve(results.rows._array);
        },
        (t, error) => {
          console.log("db error finding children");
          console.log(error);
          reject(error);
        }
      );
    });
  });
}

export function fetchAllMedications() {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM medications`,
        [],
        (t, results) => {
          resolve(results.rows._array);
        },
        (t, error) => {
          console.log("db error getting medications");
          console.log(error);
          reject(error);
        }
      );
    });
  });
}

export function fetchAllVaccines() {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM vaccines`,
        [],
        (t, results) => {
          resolve(results.rows._array);
        },
        (t, error) => {
          console.log("db error getting vaccines");
          console.log(error);
          reject(error);
        }
      );
    });
  });
}

export function addMedication(data) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO sheep_meds (sheep_id, entry_id, date) VALUES (?, ?, ?)`,
        [data.sheep_id, data.value, data.date],
        (t, success) => {
          console.log("success", success);
          resolve(success.insertId);
        },
        (t, error) => {
          console.log("db error inserting meds");
          console.log(error);
          reject(error);
        },
        () => {
          database.close();
        }
      );
    });
  });
}

export function addVaccination(data) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO sheep_vax (sheep_id, entry_id, date) VALUES (?, ?, ?)`,
        [data.sheep_id, data.value, data.date],
        (t, success) => {
          resolve(success.insertId);
        },
        (t, error) => {
          console.log("db error inserting vaccine");
          console.log(error);
          reject(error);
        },
        () => {
          database.close();
        }
      );
    });
  });
}

export function addSheepWeight(data) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO sheep_weights (sheep_id, entry, date) VALUES (?, ?, ?)`,
        [data.sheep_id, data.value, data.date],
        (t, success) => {
          resolve(success.insertId);
        },
        (t, error) => {
          console.log("db error inserting weight");
          console.log(error);
          reject(error);
        },
        () => {
          database.close();
        }
      );
    });
  });
}

export function fetchSheepMeds(id) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT sheep_meds.sheep_id, sheep_meds.entry_id, sheep_meds.id, sheep_meds.date, medications.entry 
        FROM sheep_meds INNER JOIN medications ON sheep_meds.entry_id = medications.id WHERE sheep_meds.sheep_id = ?`,
        [id],
        (t, results) => {
          console.log("sheepmeds from db", results.rows._array);
          resolve(results.rows._array);
        },
        (t, error) => {
          console.log("db error getting sheep meds");
          console.log(error);
          reject(error);
        }
      );
    });
  });
}

export function fetchSheepVax(id) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT sheep_vax.sheep_id, sheep_vax.entry_id, sheep_vax.id, sheep_vax.date, vaccines.entry FROM sheep_vax INNER JOIN vaccines ON sheep_vax.entry_id = vaccines.id WHERE sheep_vax.sheep_id = ?`,
        [id],
        (t, results) => {
          resolve(results.rows._array);
        },
        (t, error) => {
          console.log("db error getting sheep vax");
          console.log(error);
          reject(error);
        }
      );
    });
  });
}

export function fetchSheepWeight(id) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM sheep_weights WHERE sheep_id = ?`,
        [id],
        (t, results) => {
          resolve(results.rows._array);
        },
        (t, error) => {
          console.log("db error getting sheep weight");
          console.log(error);
          reject(error);
        }
      );
    });
  });
}

export function removeSheepMed(id) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM sheep_meds WHERE id = ?`,
        [id],
        (t, success) => {
          console.log("deleted successfully");
          resolve(success);
        },
        (t, error) => {
          console.log("db error deleting sheep med");
          console.log(error);
          reject(error);
        },
        () => {
          database.close();
        }
      );
    });
  });
}

export function removeSheepVax(id) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM sheep_vax WHERE id = ?`,
        [id],
        (t, success) => {
          resolve(success);
        },
        (t, error) => {
          console.log("db error deleting sheep vax");
          console.log(error);
          reject(error);
        },
        () => {
          database.close();
        }
      );
    });
  });
}

export function removeSheepWeight(id) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM sheep_weights WHERE id = ?`,
        [id],
        (t, success) => {
          console.log("deleted successfully");
          resolve(success);
        },
        (t, error) => {
          console.log("db error deleting sheep weight");
          console.log(error);
          reject(error);
        },
        () => {
          database.close();
        }
      );
    });
  });
}
