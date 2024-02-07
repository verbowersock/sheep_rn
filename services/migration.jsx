import { addMedicalData, database } from "./db";

export const getCurrentSchemaVersion = () => {
  return new Promise((resolve, reject) => {
    database.transaction((transaction) => {
      transaction.executeSql(
        "PRAGMA user_version;",
        [],
        (transaction, result) => {
          if (result.rows.length > 0) {
            const version = result.rows.item(0).user_version;
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

const migrationScript = (transaction) => {
  return new Promise((resolve, reject) => {
    transaction.executeSql(
      `
      ALTER TABLE sheep ADD COLUMN last_bred_to BIGINT REFERENCES sheep (sheep_id) ON DELETE RESTRICT ON UPDATE CASCADE;
      `,
      [],
      () => resolve(),
      (transaction, error) => {
        console.error(
          "Error adding last_bred_to column to sheep table:",
          error
        );
        reject(
          new Error(
            "Error adding last_bred_to column to sheep table: " + error.message
          )
        );
      }
    );
  });
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
