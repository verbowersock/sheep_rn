import { database } from "./db";

export const getCurrentSchemaVersion = () => {
  console.log("getting current version");
  return new Promise((resolve, reject) => {
    database.transaction((transaction) => {
      transaction.executeSql(
        "PRAGMA user_version;",
        [],
        (transaction, result) => {
          if (result.rows.length > 0) {
            const version = result.rows.item(0).user_version;
            console.log("version", version);
            resolve(version);
          } else {
            reject(new Error("No rows returned."));
          }
        },
        (transaction, error) => {
          console.log("error", error);
          reject(error);
        }
      );
    });
  });
};

export const updateSchemaVersion = (newVersion) => {
  console.log("updating version");
  return new Promise((resolve, reject) => {
    database.transaction((transaction) => {
      transaction.executeSql(
        `PRAGMA user_version = ${newVersion};`,
        [],
        () => {
          console.log(`Schema version updated to ${newVersion}`);
          resolve();
        },
        (transaction, error) => {
          console.log("Error updating schema version:", error);
          reject(error);
        }
      );
    });
  });
};

const medicationData = [
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

const vaccineData = [
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

const migrationScript = (transaction) => {
  console.log("migration script");

  transaction.executeSql(
    ` 
      CREATE TABLE IF NOT EXISTS medications 
      (id  INTEGER PRIMARY KEY NOT NULL, medication_name VARCHAR(255) NOT NULL UNIQUE
      );
      `,
    [],
    () => {
      transaction.executeSql(
        "SELECT COUNT(*) FROM medications",
        [],
        (transaction, result) => {
          const count = result.rows.item(0)["COUNT(*)"];
          if (count === 0) {
            medicationData.forEach((item) => {
              transaction.executeSql(
                "INSERT INTO medications (medication_name) VALUES (?)",
                [item]
              );
            });
          }
        },
        (transaction, error) => {
          console.error("Error checking medications table:", error);
          return false; // Rollback the transaction
        }
      );
    },
    (transaction, error) => {
      console.error("Error creating medications table:", error);
      return false; // Rollback the transaction
    }
  );

  transaction.executeSql(
    `
      CREATE TABLE IF NOT EXISTS sheep_meds (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sheep_id BIGINT NOT NULL REFERENCES sheep (sheep_id) ON DELETE RESTRICT ON UPDATE CASCADE, 
        med_id BIGINT REFERENCES medications (id) ON DELETE RESTRICT ON UPDATE CASCADE,
        administer_date VARCHAR(50) NOT NULL
      );
      `,
    [],
    () => {},
    (transaction, error) => {
      console.error("Error creating sheep_meds table:", error);
      return false; // Rollback the transaction
    }
  );

  transaction.executeSql(
    ` 
    CREATE TABLE IF NOT EXISTS vaccines 
    (id  INTEGER PRIMARY KEY NOT NULL, vaccination_name VARCHAR(255) NOT NULL UNIQUE
    );
      `,
    [],
    () => {
      transaction.executeSql(
        "SELECT COUNT(*) FROM vaccines",
        [],
        (transaction, result) => {
          const count = result.rows.item(0)["COUNT(*)"];
          if (count === 0) {
            vaccineData.forEach((item) => {
              transaction.executeSql(
                "INSERT INTO vaccines (vaccination_name) VALUES (?)",
                [item]
              );
            });
          }
        },
        (transaction, error) => {
          console.error("Error checking vaccine table:", error);
          return false; // Rollback the transaction
        }
      );
    },
    (transaction, error) => {
      console.error("Error creating vaccine table:", error);
      return false; // Rollback the transaction
    }
  );
  transaction.executeSql(
    `
    CREATE TABLE IF NOT EXISTS sheep_vax (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sheep_id BIGINT NOT NULL REFERENCES sheep (sheep_id) ON DELETE RESTRICT ON UPDATE CASCADE, 
      vax_id BIGINT REFERENCES vaccines (id) ON DELETE RESTRICT ON UPDATE CASCADE,
      administer_date VARCHAR(50) NOT NULL
    );
      `,
    [],
    () => {console.log("sheep_vax table created")},
    (transaction, error) => {
      console.error("Error creating sheep_vax table:", error);
      return false; // Rollback the transaction
    }
  );

  transaction.executeSql(
    `
    CREATE TABLE IF NOT EXISTS sheep_weights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sheep_id BIGINT NOT NULL REFERENCES sheep (sheep_id) ON DELETE RESTRICT ON UPDATE CASCADE, 
      weight BIGINT,
      date VARCHAR(50) NOT NULL
    );
      `,
    [],
    () => {},
    (transaction, error) => {
      console.error("Error creating sheep_weights table:", error);
      return false; // Rollback the transaction
    }
  );
  // Add similar executeSql calls for the other tables
};

export const executeMigration = () => {
  return new Promise((resolve, reject) => {
    database.transaction(
      (transaction) => {
        migrationScript(transaction);
      },
      (error) => {
        // Handle any migration errors here
        console.error("Migration failed:", error);
        reject(error);
      },
      () => {
        resolve();
        console.log("Migration executed successfully.");
      }
    );
  });
};
