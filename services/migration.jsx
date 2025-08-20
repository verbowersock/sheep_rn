import { getDatabase, insertMedList, insertVaxList } from "./db";

export const getCurrentSchemaVersion = async () => {
  try {
    const db = getDatabase();
    const result = await db.getFirstAsync("PRAGMA user_version;");
    const version = result ? result.user_version : 0;
    return version;
  } catch (error) {
    return 0; // Default to 0 if error
  }
};

export const updateSchemaVersion = async (newVersion) => {
  try {
    const db = getDatabase();
    await db.runAsync(`PRAGMA user_version = ${newVersion};`);
    return true;
  } catch (error) {
    throw error;
  }
};

const migrationScript = async () => {
  try {
    const db = getDatabase();
    
    // Insert medication and vaccine lists
    await insertMedList();
    await insertVaxList();
    
    // Add dosage column to sheep_meds table if it doesn't exist
    try {
      await db.runAsync(`ALTER TABLE sheep_meds ADD COLUMN dosage VARCHAR(100);`);
    } catch (error) {
      // Column might already exist, check if it's a "duplicate column" error
      if (error.message.includes("duplicate column") || error.message.includes("already exists")) {
      } else {
        console.error("Error adding dosage column to sheep_meds table:", error);
        throw error;
      }
    }
    
    // Check if last_bred_to column exists in sheep table
    const tableInfo = await db.getAllAsync(`PRAGMA table_info(sheep);`);
    const columnExists = tableInfo.some(column => column.name === "last_bred_to");
    
    if (!columnExists) {
      await db.runAsync(`ALTER TABLE sheep ADD COLUMN last_bred_to VARCHAR(200);`);
    } else {
    }
    
    return true;
    
  } catch (error) {
    console.error("Migration script failed:", error);
    throw error;
  }
};

export const executeMigration = async () => {
  try {
    await migrationScript();
    return true;
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
};