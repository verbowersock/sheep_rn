import * as SQLite from "expo-sqlite";
import { picture1, picture2, picture3 } from "./base54pictures";

export const database = SQLite.openDatabase("sheep.db", "1.1", "", 1, () => {});
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
    name: "Daisy",
    dob: "02/09/2022",
    sex: "f",
    purchase_date: "03/09/2022",
    breed_id: 1,
    color_id: 2,
    marking_id: 1,
    notes: "test notes",
    last_location: "test location1",
    picture: picture1,
  },
  {
    tag_id: "def",
    scrapie_id: "def1245",
    name: "Luke",
    dob: "02/10/2022",
    sex: "m",
    breed_id: 2,
    color_id: 3,
    marking_id: 2,
    mother: 1,
    notes:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. In itaque iure tempore beatae illo dignissimos cum soluta deserunt vel optio velit vero voluptatibus voluptatem temporibus perspiciatis voluptatum, culpa praesentium ea est laudantium saepe architecto commodi fugiat. Maxime vero dolores magnam consectetur, atque perspiciatis! Excepturi, ipsa magni? Eos harum error dolorum odio quaerat, laudantium aliquid maxime doloremque dicta dolorem quod fugiat labore maiores amet architecto dolore qui atque officia dolores numquam nostrum veritatis nulla neque! In quos ipsa saepe et repellendus magni, iste natus reiciendis, quisquam nobis corporis voluptates corrupti nesciunt aspernatur veritatis modi aliquid esse eveniet dolorum ipsum accusantium dolores beatae at? Nisi voluptatibus recusandae, iste dolores exercitationem debitis dignissimos similique dolor, veniam excepturi dicta porro iusto consequuntur laboriosam delectus aliquam tempore corrupti.",
    last_location: "test location2",
    picture: picture2,
  },
  {
    tag_id: "hij",
    scrapie_id: "defhij",
    name: "Baby",
    dob: "02/10/2022",
    sex: "f",
    breed_id: 2,
    color_id: 3,
    marking_id: 2,
    mother: 1,
    notes:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. In itaque iure tempore beatae illo dignissimos cum soluta deserunt vel optio velit vero voluptatibus voluptatem temporibus perspiciatis voluptatum, culpa praesentium ea est laudantium saepe architecto commodi fugiat. Maxime vero dolores magnam consectetur, atque perspiciatis! Excepturi, ipsa magni? Eos harum error dolorum odio quaerat, laudantium aliquid maxime doloremque dicta dolorem quod fugiat labore maiores amet architecto dolore qui atque officia dolores numquam nostrum veritatis nulla neque! In quos ipsa saepe et repellendus magni, iste natus reiciendis, quisquam nobis corporis voluptates corrupti nesciunt aspernatur veritatis modi aliquid esse eveniet dolorum ipsum accusantium dolores beatae at? Nisi voluptatibus recusandae, iste dolores exercitationem debitis dignissimos similique dolor, veniam excepturi dicta porro iusto consequuntur laboriosam delectus aliquam tempore corrupti.",
    last_location: "test location3",
    picture: picture3,
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

export const medicationData = [
  "Cydectin® (Moxidectin)",
  "Ivomec® (Ivermectin)",
  "Prohibit® (Levamisole)",
  "Valbazen® (Albendazole)",
  "Deccox® (Decoquinate)",
  "Corid® (Amprolium)",
  "Albon® (Sulfadimethoxine)",
  "Sulmet® (Sulfamethazine)",
  "Baycox® (Toltrazuril)",
  "Aureomycin® (Chlortetracycline)",
  "Biosol® (Neomycin sulfate)",
  "Micotil® (Tilmicosin phosphate)",
  "Naxcel® (Ceftiofur sodium)",
  "Pro-Pen G Agri-Cillin® (Penicillin G procaine)",
  "Terramycin® (Oxytetracycline)",
  "Oxytetracycline 10% (Oxytetracycline 100)",
  "Oxytetracycline 200",
  "Excenel® (Ceftiofur hydrochloride)",
  "Nuflor® (Florfenicol)",
  "Bismuth subsalicylate",
  "Mineral oil",
  "Propylene glycol",
  "Therabloat®",
  "Flunixin meglumine",
  "Aspirin",
  "Dexamethasone",
  "BO-SE®",
  "Calcium gluconate",
  "Dextrose 50%",
  "Epinephrine",
  "Lutalyse®",
  "Oxtytocin",
  "Thiamine 200 mg/ml (Vit. B1)",
  "Vitamin B12",
  "Vitamin B Complex",
];

export const vaccineData = [
  "Campylobacter",
  "Case-Bac™",
  "Caseous D-T™",
  "C & D antitoxin",
  "CD-T",
  "Covexin™-8",
  "Chlamydia",
  "Ram epididymitis bacterin",
  "Footvax®",
  "Ovine Ecolizer™",
  "Pasteurella",
  "Rabies",
  "Soremouth",
  "Tetanus antitoxin",
  "Volar footrot bacterin",
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

export const addMedicalData = async (tx) => {
  console.log("addmedicaldata runs");
  return new Promise((resolve, reject) => {
    tx.executeSql(
      ` 
      CREATE TABLE IF NOT EXISTS medications 
      (id  INTEGER PRIMARY KEY NOT NULL, entry VARCHAR(255) NOT NULL UNIQUE
      );
      `,
      [],
      () => {
        console.log("meds table created");
        tx.executeSql(
          `
          CREATE TABLE IF NOT EXISTS sheep_meds (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sheep_id BIGINT NOT NULL REFERENCES sheep (sheep_id) ON DELETE RESTRICT ON UPDATE CASCADE, 
            entry_id BIGINT REFERENCES medications (id) ON DELETE RESTRICT ON UPDATE CASCADE,
            date VARCHAR(50) NOT NULL
          );
          `,
          [],
          () => {
            console.log("sheep_meds table created");
            tx.executeSql(
              ` 
            CREATE TABLE IF NOT EXISTS vaccines 
            (id  INTEGER PRIMARY KEY NOT NULL, entry VARCHAR(255) NOT NULL UNIQUE
            );
              `,
              [],
              () => {
                console.log("vax table created");
                tx.executeSql(
                  `
                  CREATE TABLE IF NOT EXISTS sheep_vax (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    sheep_id BIGINT NOT NULL REFERENCES sheep (sheep_id) ON DELETE RESTRICT ON UPDATE CASCADE, 
                    entry_id BIGINT REFERENCES vaccines (id) ON DELETE RESTRICT ON UPDATE CASCADE,
                    date VARCHAR(50) NOT NULL 
                  );
                    `,
                  [],
                  () => {
                    console.log("sheep_vax table created");
                    tx.executeSql(
                      `
                          CREATE TABLE IF NOT EXISTS sheep_weights (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            sheep_id BIGINT NOT NULL REFERENCES sheep (sheep_id) ON DELETE RESTRICT ON UPDATE CASCADE, 
                            entry BIGINT,
                            date VARCHAR(50) NOT NULL
                          );
                            `,
                      [],
                      () => {
                        console.log("weight table created");
                        resolve();
                      },
                      (_, error) => {
                        console.log(
                          "Error creating sheep_weights table:",
                          error
                        );
                        console.log(error);
                        reject(error);
                      }
                    );
                  },
                  (__1, error_1) => {
                    console.log("Error creating sheep_vax table:", error_1);
                    console.log(error_1);
                    reject(error_1);
                  }
                );
              },
              (__2, error_2) => {
                console.log("Error creating vaccines table:", error_2);
                console.log(error_2);
                reject(error_2);
              }
            );
          },
          (__3, error_3) => {
            console.log("Error creating sheep_meds table:", error_3);
            console.log(error_3);
            reject(error_3);
          }
        );
      },

      (__4, error_4) => {
        console.error("Error creating medications table:", error_4);
        return false; // Rollback the transaction
      }
    );
  });
};

export const addBasicData = async (tx) => {
  return new Promise((resolve, reject) => {
    console.log("creating basic data");
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS breeds 
    (id  INTEGER PRIMARY KEY NOT NULL, breed_name VARCHAR(255) NOT NULL UNIQUE
    )`,
      [],
      () => {
        console.log("breeds table created");
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS colors 
    (id  INTEGER PRIMARY KEY NOT NULL, color_name VARCHAR(255) NOT NULL UNIQUE
    )`,
          [],
          () => {
            console.log("colors table created");
            tx.executeSql(
              `CREATE TABLE IF NOT EXISTS markings 
        (id  INTEGER PRIMARY KEY NOT NULL, marking_name VARCHAR(255) NOT NULL UNIQUE
        )`,
              [],
              () => {
                console.log("markings table created");
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
            marking_id BIGINT REFERENCES markings (id) ON DELETE RESTRICT ON UPDATE CASCADE,
            notes VARCHAR(255),
            last_location VARCHAR(255)
            )`,
                  [],
                  () => {
                    console.log("sheep table created");
                    resolve();
                  },

                  (_, error) => {
                    console.log("Error creating sheep table:", error);
                    console.log(error);
                    reject(error);
                  }
                );
              },
              (_, error) => {
                console.log("Error creating markings table:", error);
                reject(error);
              }
            );
          },

          (_, error) => {
            console.error("Error creating colors table:", error);
            return false; // Rollback the transaction
          }
        );
      },
      (_, error) => {
        console.error("Error creating breeds table:", error);
        return false; // Rollback the transaction
      }
    );
  });
};

export function init() {
  console.log("init db");
  return Promise.all([
    new Promise((resolve, reject) => {
      database.transaction(
        (tx) => {
          addBasicData(tx);
        },
        (error) => {
          // Handle any migration errors here
          console.error("Initialization failed:", error);
          reject(error);
        },
        () => {
          resolve();
          console.log("Initialization executed successfully.");
        }
      );
    }),
    new Promise((resolve, reject) => {
      database.transaction(
        (tx) => {
          addMedicalData(tx);
        },
        (error) => {
          // Handle any migration errors here
          console.error("Initialization failed:", error);
          reject(error);
        },
        () => {
          resolve();
          console.log("Initialization executed successfully.");
        }
      );
    }),
  ]);
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
    database.transaction((tx) => {
      Promise.all(
        testDataSheep.map((sheepData) => {
          return new Promise((resolve, reject) => {
            tx.executeSql(
              `INSERT INTO sheep (tag_id, scrapie_id, name, dob, dop, dod, dos, sex, sire, dam, weight_at_birth, breed_id, color_id, marking_id, date_last_bred, notes, last_location, picture) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
                sheepData.notes,
                sheepData.last_location,
                sheepData.picture,
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
        })
      )
        .then(() => {
          console.log("All sheep inserted");
          resolve();
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  });
}

export function insertMedList() {
  return new Promise((resolve, reject) => {
    medicationData.map((medData) => {
      database.transaction((tx) => {
        tx.executeSql(
          `INSERT INTO medications (entry)
            VALUES (?)`,
          [medData],
          (t, success) => {
            resolve(success);
          },
          (t, error) => {
            console.log("db error insert med list");
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

export function insertVaxList() {
  return new Promise((resolve, reject) => {
    vaccineData.map((vaxData) => {
      database.transaction((tx) => {
        tx.executeSql(
          `INSERT INTO vaccines (entry)
            VALUES (?)`,
          [vaxData],
          (t, success) => {
            resolve(success);
          },
          (t, error) => {
            console.log("db error insert vax list");
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

export function fetchAllSheep() {
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
  children.notes,
  children.last_location,
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

export function fetchSheep(id) {
  console.log("id", id);
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
        children.notes,
        children.last_location,
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
        LEFT JOIN sheep dams ON children.dam = dams.sheep_id
      WHERE
        children.sheep_id = ?;`,
        [id],
        (_, result) => {
          resolve(result.rows._array[0]);
        },
        (_, error) => {
          console.log("error111", error);
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
            sheepData.breed_id,
            //1,
            sheepData.color_id,
            //1,
            sheepData.marking_id,
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

      // Generate the SQL query and the parameters array
      const columns = Object.keys(sheepData).filter((col) => col !== "id");
      const values = Object.values(sheepData);
      const sqlQuery = `UPDATE sheep SET ${columns
        .map((col) => `${col} = ?`)
        .join(", ")} WHERE sheep_id = ?`;
      const parameters = [...values, id];

      tx.executeSql(
        sqlQuery,
        parameters,
        (t, success) => {
          console.log("success", success);
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
export function updateDateLastBred(data) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      console.log("date1", data);
      tx.executeSql(
        `UPDATE sheep set date_last_bred = ? where sheep_id=?`,
        [data.date, data.sheep_id],
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
  console.log("finding children for id", id);
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM sheep WHERE sire = ? OR dam = ?`,
        [id, id],
        (t, results) => {
          //    console.log("children", results);
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
