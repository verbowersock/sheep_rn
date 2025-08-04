import { addMedicalData, database, insertMedList, insertVaxList } from "./db";

export const getCurrentSchemaVersion = () => {
  try {
    console.log("Getting current schema version");
    const result = database.getFirstSync("PRAGMA user_version;");
    const version = result ? result.user_version : 0;
    console.log("Current schema version:", version);
    return version;
  } catch (error) {
    console.log("Error getting schema version:", error);
    return 0; // Default to 0 if error
  }
};

export const updateSchemaVersion = (newVersion) => {
  try {
    console.log(`Updating schema version to ${newVersion}`);
    database.runSync(`PRAGMA user_version = ${newVersion};`);
    console.log(`Schema version updated to ${newVersion}`);
    return true;
  } catch (error) {
    console.log("Error updating schema version:", error);
    throw error;
  }
};

const migrationScript = () => {
  try {
    console.log("Starting migration script");
    
    // Insert medication and vaccine lists
    insertMedList();
    insertVaxList();
    
    // Add dosage column to sheep_meds table if it doesn't exist
    try {
      database.runSync(`ALTER TABLE sheep_meds ADD COLUMN dosage VARCHAR(100);`);
      console.log("Added dosage column to sheep_meds table");
    } catch (error) {
      // Column might already exist, check if it's a "duplicate column" error
      if (error.message.includes("duplicate column") || error.message.includes("already exists")) {
        console.log("Dosage column already exists in sheep_meds table");
      } else {
        console.error("Error adding dosage column to sheep_meds table:", error);
        throw error;
      }
    }
    
    // Check if last_bred_to column exists in sheep table
    const tableInfo = database.getAllSync(`PRAGMA table_info(sheep);`);
    const columnExists = tableInfo.some(column => column.name === "last_bred_to");
    
    if (!columnExists) {
      database.runSync(`ALTER TABLE sheep ADD COLUMN last_bred_to VARCHAR(200);`);
      console.log("Added last_bred_to column to sheep table");
    } else {
      console.log("last_bred_to column already exists in sheep table");
    }
    
    console.log("Migration script completed successfully");
    return true;
    
  } catch (error) {
    console.error("Migration script failed:", error);
    throw error;
  }
};

export const executeMigration = () => {
  try {
    console.log("Executing migration");
    migrationScript();
    console.log("Migration executed successfully");
    return true;
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
};