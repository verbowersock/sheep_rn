import * as SQLite from "expo-sqlite";

const database = SQLite.openDatabase("sheep.db");

const testDataBreeds = ["katahdin", "shetland", "dorper", "icelandic", "mix"];
const testDataColors = ["gray", "black", "white", "red", "brown"];
const testDataMarkings = ["katmoget", "solid", "mirkface"];
const testDataSheep = [
  {
    tag_id: "abc",
    scrapie_id: "abc1245",
    name: "Bree",
    dob: "2021-09-02",
    sex: "f",
    purchase_date: "2022-02-02",
    breed_id: 1,
    color_id: 2,
    marking_id: 1,
  },
  {
    tag_id: "def",
    scrapie_id: "def1245",
    name: "Buffy",
    dob: "2021-10-02",
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
        "drop table if exists sheep",
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
        "drop table if exists  colors",
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
        "drop table if exists markings",
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
        "drop table if exists breeds",
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
                purchase_date VARCHAR(50), 
                weight_at_birth INTEGER, date_deceased VARCHAR(255), 
                breed_id BIGINT NOT NULL REFERENCES breeds (id) ON DELETE RESTRICT ON UPDATE CASCADE, 
                color_id BIGINT REFERENCES colors (id) ON DELETE RESTRICT ON UPDATE CASCADE, 
                marking_id BIGINT REFERENCES markings (id) ON DELETE RESTRICT ON UPDATE CASCADE, 
                date_last_bred VARCHAR(255));`,
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
            console.log("db error insertbreed");
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
          `INSERT INTO sheep (tag_id, scrapie_id, name, dob, sex, sire, dam, purchase_date, weight_at_birth, breed_id, color_id, marking_id, date_last_bred) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            sheepData.tag_id,
            sheepData.scrapie_id,
            sheepData.name,
            sheepData.dob,
            sheepData.sex,
            sheepData.father,
            sheepData.mother,
            sheepData.purchase_date,
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
        `SELECT children.sheep_id, children.tag_id, children.name, children.dob, children.sex, breeds.breed_name,colors.color_name,
	sires.name AS father_name,
 dams.name AS mother_name
FROM
	sheep children,
	breeds breeds,
	colors colors
left join sheep sires
on sires.sheep_id = children.sire
left join sheep dams
on dams.sheep_id=children.dam
WHERE
	children.breed_id = breeds.id AND
	children.color_id = colors.id`,
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
  console.log(sheepData);
  return new Promise((resolve, reject) => {
    database.transaction(function (tx) {
      tx.executeSql(
        `INSERT INTO sheep (tag_id, scrapie_id, name, dob, sex, sire, dam, purchase_date, weight_at_birth, breed_id, color_id, marking_id, date_last_bred) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          sheepData.tag_id,
          sheepData.scrapie_id,
          sheepData.name,
          sheepData.dob,
          sheepData.sex,
          sheepData.father,
          sheepData.mother,
          sheepData.purchase_date,
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
}
