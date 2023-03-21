import * as SQLite from "expo-sqlite";

const database = SQLite.openDatabase("sheep.db");
database.exec([{ sql: "PRAGMA foreign_keys = ON;", args: [] }], false, () =>
  console.log("Foreign keys turned on")
);

const testDataBreeds = ["katahdin", "shetland", "dorper", "icelandic", "mix"];
const testDataColors = ["gray", "black", "white", "red", "brown"];
const testDataMarkings = ["katmoget", "solid", "mirkface"];
const testDataSheep = [
  {
    tag_id: "abc",
    scrapie_id: "abc1245",
    name: "Bree1",
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
    name: "Buffy1",
    dob: "02/10/2022",
    sex: "m",
    breed_id: 2,
    color_id: 3,
    marking_id: 2,
    mother: 1,
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
          resolve(result);
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
          resolve(result);
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
          resolve(result);
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
          resolve(result);
        },
        (_, error) => {
          console.log("error dropping breeds table");
          reject(error);
        }
      );
    });
  });
};

export function init() {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS breeds 
    (id  INTEGER PRIMARY KEY NOT NULL, breed_name VARCHAR(255) NOT NULL UNIQUE
    )`,
        [],

        (_, success) => {
          resolve(success);
        },
        (_, error) => {
          console.log("db error creating table breeds");
          console.log(error);
          reject(error);
        }
      );
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS colors 
    (id  INTEGER PRIMARY KEY NOT NULL, color_name VARCHAR(255) NOT NULL UNIQUE
    )`,
        [],
        (_, success) => {
          resolve(success);
        },
        (_, error) => {
          console.log("db error creating table colors");
          console.log(error);
          reject(error);
        }
      );
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS markings 
    (id  INTEGER PRIMARY KEY NOT NULL, marking_name VARCHAR(255) NOT NULL UNIQUE
    )`,
        [],
        (_, success) => {
          resolve(success);
        },
        (_, error) => {
          console.log("db error creating table markings");
          console.log(error);
          reject(error);
        }
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
        (_, error) => {
          console.log("db error creating table sheep");
          console.log("error", error);
          reject(error);
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
          `INSERT INTO sheep (tag_id, scrapie_id, name, dob, dop, dod, sex, sire, dam, weight_at_birth, breed_id, color_id, marking_id, date_last_bred) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            sheepData.tag_id,
            sheepData.scrapie_id,
            sheepData.name,
            sheepData.dob,
            sheepData.dop,
            sheepData.dod,
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
  COALESCE(colors.color_name, 'N/A') as color_name,
  COALESCE(markings.marking_name, 'N/A') as marking_name,
  sires.name AS father_name,
  dams.name AS mother_name
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
          `INSERT INTO sheep (picture, tag_id, scrapie_id, name, dob, dop, dod, sex, sire, dam, breed_id, color_id, marking_id) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            //"1222122",
            sheepData.picture,
            sheepData.tag_id,
            sheepData.scrapie_id,
            // "1222122",
            sheepData.name,
            //"testvk1122vv",
            sheepData.dob,
            sheepData.dop,
            sheepData.dod,
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
            console.log("sucess");
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
            console.log(`value ${val} already exists`);
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
                console.log("db error inserting color");
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
          console.log("success", success);
          resolve(success);
        },
        (t, error) => {
          console.log("db error deleting marking");
          console.log(error);
          reject(error);
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
        }
      );
    });
  });
}

export function editSheep(sheepData, id) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE sheep set tag_id = ?, scrapie_id = ?, name = ?, dob = ?, dop = ?, dod=?, sex = ?, sire = ?, dam = ?, weight_at_birth = ?, breed_id = ?, color_id = ?, marking_id = ?, date_last_bred = ? where sheep_id=?`,
        [
          sheepData.tag_id,
          sheepData.scrapie_id,
          sheepData.name,
          sheepData.dob,
          sheepData.dop,
          sheepData.dod,
          sheepData.sex,
          sheepData.sire,
          sheepData.dam,
          sheepData.weight_at_birth,
          sheepData.breed,
          sheepData.color,
          sheepData.marking,
          sheepData.date_last_bred,
          id,
        ],
        (t, success) => {
          resolve(success);
        },
        (t, error) => {
          console.log("db error updating sheep");
          console.log(error);
          reject(error);
        }
      );
    });
  });
}
