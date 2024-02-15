import { addMedicalData, database, insertMedList, insertVaxList } from "./db";

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
  insertMedList();
  insertVaxList();
  return new Promise((resolve, reject) => {
    database.transaction(
      (transaction) => {
        transaction.executeSql(
          `ALTER TABLE sheep_meds add COLUMN dosage VARCHAR(100);`,
          [],
          null,
          (transaction, error) => {
            console.error(
              "Error adding dosage column to sheep_meds table:",
              error
            );
            reject(
              new Error(
                "Error adding dosage column to sheep_meds table: " +
                  error.message
              )
            );
          }
        );
      },
      reject,
      () => {
        database.transaction(
          (transaction) => {
            transaction.executeSql(
              `PRAGMA table_info(sheep);`,
              [],
              (transaction, resultSet) => {
                let columnExists = false;

                for (let i = 0; i < resultSet.rows.length; i++) {
                  if (resultSet.rows.item(i).name === "last_bred_to") {
                    columnExists = true;
                    break;
                  }
                }

                if (!columnExists) {
                  transaction.executeSql(
                    `ALTER TABLE sheep ADD COLUMN last_bred_to VARCHAR(200);`,
                    [],
                    null,
                    (transaction, error) => {
                      console.error(
                        "Error adding last_bred_to column to sheep table:",
                        error
                      );
                      reject(
                        new Error(
                          "Error adding last_bred_to column to sheep table: " +
                            error.message
                        )
                      );
                    }
                  );
                }
              },
              (transaction, error) => {
                console.error("Error executing PRAGMA table_info:", error);
                reject(
                  new Error(
                    "Error executing PRAGMA table_info: " + error.message
                  )
                );
              }
            );
          },
          reject,
          resolve
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
