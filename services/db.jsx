import * as SQLite from 'expo-sqlite';
import { picture1, picture2, picture3 } from "./base54pictures";

// Global database variable
let database = null;

// Initialize database function
export const initializeDatabase = async () => {
  try {
    database = await SQLite.openDatabaseAsync("sheep.db");
    // Enable foreign keys
    await database.execAsync("PRAGMA foreign_keys = ON;");

    // Initialize tables and data
    await init();

    return database;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

// Get database instance
export const getDatabase = () => {
  if (!database) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return database;
};

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
    weight_at_birth: 10,
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
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. In itaque iure tempore beatae illo dignissimos cum soluta deserunt vel optio velit vero voluptatibus voluptatem temporibus perspiciatis voluptatum, culpa praesentium ea est laudantium saepe architecto commodi fugiat.",
    last_location: "test location2",
    picture: picture2,
  },
  {
    tag_id: "hij",
    scrapie_id: "defhij",
    name: "Baby",
    dob: "02/10/2023",
    sex: "f",
    breed_id: 2,
    color_id: 3,
    marking_id: 2,
    mother: 1,
    father: 2,
    notes:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. In itaque iure tempore beatae illo dignissimos cum soluta deserunt vel optio velit vero voluptatibus voluptatem temporibus perspiciatis voluptatum.",
    last_location: "test location3",
    picture: picture3,
  },
];

const testDataMeds = [
  { id: 1, sheep_id: 1, entry: 3, date: "03/22/2022" },
  { id: 2, sheep_id: 1, entry: 2, date: "04/22/2022" },
  { id: 3, sheep_id: 1, entry: 1, date: "05/22/2022" },
  { id: 4, sheep_id: 2, entry: 3, date: "03/22/2022" },
  { id: 5, sheep_id: 2, entry: 2, date: "04/22/2022" },
  { id: 6, sheep_id: 2, entry: 1, date: "05/22/2022" },
];

const testDataVax = [
  { id: 1, sheep_id: 1, entry: 3, date: "03/25/2022" },
  { id: 2, sheep_id: 1, entry: 2, date: "04/25/2022" },
  { id: 3, sheep_id: 1, entry: 1, date: "05/25/2022" },
  { id: 4, sheep_id: 2, entry: 3, date: "03/25/2022" },
  { id: 5, sheep_id: 2, entry: 2, date: "04/25/2022" },
  { id: 6, sheep_id: 2, entry: 1, date: "05/25/2022" },
];

export const medicationData = [
  "Cydectin® (Moxidectin)",
  "Ivomec® (Ivermectin)",
  "Prohibit® (Levamisole)",
  // ... rest of your medication data
];

export const vaccineData = [
  "Campylobacter",
  "Case-Bac™",
  "Caseous D-T™",
  // ... rest of your vaccine data
];

export const setCurrentSchemaVersion = async (version) => {
  try {
    const db = getDatabase();
    await db.runAsync(`PRAGMA user_version = ${version};`);
    return true;
  } catch (error) {
    throw error;
  }
};

export async function insertMedList() {
  try {
    const db = getDatabase();
    for (const medData of medicationData) {
      await db.runAsync(
        'INSERT OR IGNORE INTO medications (entry) VALUES (?)',
        [medData]
      );
    }
    return true;
  } catch (error) {
    console.error("Error inserting medication list:", error);
    throw error;
  }
}

export async function insertVaxList() {
  try {
    const db = getDatabase();
    for (const vaxData of vaccineData) {
      await db.runAsync(
        'INSERT OR IGNORE INTO vaccines (entry) VALUES (?)',
        [vaxData]
      );
    }
    return true;
  } catch (error) {
    console.error("Error inserting vaccine list:", error);
    throw error;
  }
}


export const dropDbTablesAsync = async () => {
  try {
    const db = getDatabase();

    await db.runAsync("DROP TABLE IF EXISTS sheep");

    await db.runAsync("DROP TABLE IF EXISTS colors");

    await db.runAsync("DROP TABLE IF EXISTS markings");

    await db.runAsync("DROP TABLE IF EXISTS breeds");

    await db.runAsync("DROP TABLE IF EXISTS medications");

    await db.runAsync("DROP TABLE IF EXISTS vaccines");

    await db.runAsync("DROP TABLE IF EXISTS sheep_meds");

    await db.runAsync("DROP TABLE IF EXISTS sheep_vax");

    await db.runAsync("DROP TABLE IF EXISTS sheep_weights");

    return true;
  } catch (error) {
    throw error;
  }
};

export const addMedicalData = async () => {
  try {
    const db = getDatabase();

    // Create medications table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS medications (
        id INTEGER PRIMARY KEY NOT NULL, 
        entry VARCHAR(255) NOT NULL UNIQUE
      )
    `);

    // Create sheep_meds table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS sheep_meds (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sheep_id BIGINT NOT NULL REFERENCES sheep (sheep_id) ON DELETE CASCADE ON UPDATE CASCADE, 
        entry_id BIGINT REFERENCES medications (id) ON DELETE RESTRICT ON UPDATE CASCADE,
        date VARCHAR(50) NOT NULL,
        dosage VARCHAR(100)
      )
    `);
    // Create vaccines table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS vaccines (
        id INTEGER PRIMARY KEY NOT NULL, 
        entry VARCHAR(255) NOT NULL UNIQUE
      )
    `);

    // Create sheep_vax table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS sheep_vax (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sheep_id BIGINT NOT NULL REFERENCES sheep (sheep_id) ON DELETE CASCADE ON UPDATE CASCADE, 
        entry_id BIGINT REFERENCES vaccines (id) ON DELETE RESTRICT ON UPDATE CASCADE,
        date VARCHAR(50) NOT NULL 
      )
    `);

    // Create sheep_weights table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS sheep_weights (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sheep_id BIGINT NOT NULL REFERENCES sheep (sheep_id) ON DELETE CASCADE ON UPDATE CASCADE, 
        entry BIGINT,
        date VARCHAR(50) NOT NULL
      )
    `);

    return true;
  } catch (error) {
    console.error("Error creating medical tables:", error);
    throw error;
  }
};

export const addBasicData = async () => {

  try {
    const db = getDatabase();

    // Create breeds table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS breeds (
        id INTEGER PRIMARY KEY NOT NULL, 
        breed_name VARCHAR(255) NOT NULL UNIQUE
      )
    `);

    // Create colors table  
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS colors (
        id INTEGER PRIMARY KEY NOT NULL, 
        color_name VARCHAR(255) NOT NULL UNIQUE
      )
    `);
    // Create markings table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS markings (
        id INTEGER PRIMARY KEY NOT NULL, 
        marking_name VARCHAR(255) NOT NULL UNIQUE
      )
    `);

    // Create sheep table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS sheep (
        sheep_id INTEGER PRIMARY KEY NOT NULL, 
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
        last_bred_to BIGINT REFERENCES sheep (sheep_id) ON DELETE RESTRICT ON UPDATE CASCADE,
        breed_id BIGINT NOT NULL REFERENCES breeds (id) ON DELETE RESTRICT ON UPDATE CASCADE, 
        color_id BIGINT REFERENCES colors (id) ON DELETE RESTRICT ON UPDATE CASCADE, 
        marking_id BIGINT REFERENCES markings (id) ON DELETE RESTRICT ON UPDATE CASCADE,
        notes VARCHAR(255),
        last_location VARCHAR(255)
      )
    `);
 
    return true;
  } catch (error) {
    console.error("Error creating tables:", error);
    throw error;
  }
};

export async function init() {
  try {
    // Create tables
    await addBasicData();
    await addMedicalData();

    // Insert initial data if tables are empty
    const db = getDatabase();
    const breedCount = await db.getFirstAsync('SELECT COUNT(*) as count FROM breeds');

    if (breedCount.count === 0) {
      await insertBreedData();
      await insertColorData();
      await insertMarkingData();
      // Optionally insert test sheep data
      // await insertSheepData();
    }

    return true;
  } catch (error) {
    console.error("Initialization failed:", error);
    throw error;
  }
}

export const insertBreedData = async () => {
  try {
    const db = getDatabase();
    for (const breed of testDataBreeds) {
      await db.runAsync(
        'INSERT OR IGNORE INTO breeds (breed_name) VALUES (?)',
        [breed]
      );
    }
  } catch (error) {
    console.error("Error inserting breeds:", error);
    throw error;
  }
};

export async function insertColorData() {
  try {
    const db = getDatabase();
    for (const color of testDataColors) {
      await db.runAsync(
        'INSERT OR IGNORE INTO colors (color_name) VALUES (?)',
        [color]
      );
    }
  } catch (error) {
    console.error("Error inserting colors:", error);
    throw error;
  }
}

export async function insertMarkingData() {
  try {
    const db = getDatabase();
    for (const marking of testDataMarkings) {
      await db.runAsync(
        'INSERT OR IGNORE INTO markings (marking_name) VALUES (?)',
        [marking]
      );
    }
  } catch (error) {
    console.error("Error inserting markings:", error);
    throw error;
  }
}

// FETCH FUNCTIONS (converted to async)
export async function fetchAllSheep() {
  try {
    const db = getDatabase();
    const result = await db.getAllAsync(`
      SELECT 
        children.sheep_id, 
        children.tag_id, 
        children.name, 
        children.dob, 
        children.dos,
        children.sex, 
        children.dop,
        children.weight_at_birth,
        children.date_last_bred,
        children.last_bred_to,
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
        dams.tag_id AS mother_tag_id,
        COALESCE(last_bred_to_sheep.name, last_bred_to_sheep.tag_id, 'NA') as last_bred_to_name_or_tag
      FROM sheep children
      JOIN breeds ON children.breed_id = breeds.id
      LEFT JOIN colors ON children.color_id = colors.id
      LEFT JOIN markings ON children.marking_id = markings.id
      LEFT JOIN sheep sires ON children.sire = sires.sheep_id
      LEFT JOIN sheep dams ON children.dam = dams.sheep_id
      LEFT JOIN sheep last_bred_to_sheep ON children.last_bred_to = last_bred_to_sheep.sheep_id
    `);
    return result || [];
  } catch (error) {
    console.error("Error fetching sheep data:", error);
    throw error;
  }
}

export async function fetchSheep(id) {
  try {
    const db = getDatabase();
    const result = await db.getFirstAsync(`
      SELECT 
        children.sheep_id, 
        children.tag_id, 
        children.name, 
        children.dob, 
        children.dos,
        children.sex, 
        children.dop,
        children.weight_at_birth,
        children.date_last_bred,
        children.last_bred_to,
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
        dams.tag_id AS mother_tag_id,
        COALESCE(last_bred_to_sheep.name, last_bred_to_sheep.tag_id, 'NA') as last_bred_to_name_or_tag
      FROM sheep children
      JOIN breeds ON children.breed_id = breeds.id
      LEFT JOIN colors ON children.color_id = colors.id
      LEFT JOIN markings ON children.marking_id = markings.id
      LEFT JOIN sheep sires ON children.sire = sires.sheep_id
      LEFT JOIN sheep dams ON children.dam = dams.sheep_id
      LEFT JOIN sheep last_bred_to_sheep ON children.last_bred_to = last_bred_to_sheep.sheep_id
      WHERE children.sheep_id = ?
    `, [id]);
    return result;
  } catch (error) {
    console.error("Error fetching sheep:", error);
    throw error;
  }
}

export async function fetchBreeds() {
  try {
    const db = getDatabase();
    const result = await db.getAllAsync('SELECT * FROM breeds');
    return result;
  } catch (error) {
    console.error("Error fetching breeds:", error);
    throw error;
  }
}

export async function fetchColors() {
  try {
    const db = getDatabase();
    const result = await db.getAllAsync('SELECT * FROM colors');
    return result;
  } catch (error) {
    console.error("Error fetching colors:", error);
    throw error;
  }
}

export async function fetchMarkings() {
  try {
    const db = getDatabase();
    const result = await db.getAllAsync('SELECT * FROM markings');
    return result;
  } catch (error) {
    console.error("Error fetching markings:", error);
    throw error;
  }
}

export async function fetchMales() {
  try {
    const db = getDatabase();
    const result = await db.getAllAsync('SELECT sheep_id, name, tag_id FROM sheep WHERE sex = ?', ['m']);
    return result;
  } catch (error) {
    console.error("Error fetching males:", error);
    throw error;
  }
}

export async function fetchFemales() {
  try {
    const db = getDatabase();
    const result = await db.getAllAsync('SELECT sheep_id, name, tag_id FROM sheep WHERE sex = ?', ['f']);
    return result;
  } catch (error) {
    console.error("Error fetching females:", error);
    throw error;
  }
}

export async function addSheep(sheepData) {
  try {
    const db = getDatabase();
    const result = await db.runAsync(`
      INSERT INTO sheep (picture, tag_id, scrapie_id, name, dob, weight_at_birth, dop, dod, dos, sex, sire, dam, breed_id, color_id, marking_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      sheepData.picture,
      sheepData.tag_id,
      sheepData.scrapie_id,
      sheepData.name,
      sheepData.dob,
      sheepData.weight_at_birth,
      sheepData.dop,
      sheepData.dod,
      sheepData.dos,
      sheepData.sex,
      sheepData.sire,
      sheepData.dam,
      sheepData.breed_id,
      sheepData.color_id,
      sheepData.marking_id,
    ]);
    
    if (sheepData.weight_at_birth) {
      await db.runAsync(
        'INSERT INTO sheep_weights (sheep_id, entry, date) VALUES (?, ?, ?)',
        [result.lastInsertRowId, sheepData.weight_at_birth, sheepData.dob]
      );
    }
    return result.lastInsertRowId;
  } catch (error) {
    console.error("Error adding sheep:", error);
    throw error;
  }
}

export async function editSheep(sheepData, id) {
  try {
    const db = getDatabase();

    // Generate the SQL query and parameters
    const columns = Object.keys(sheepData).filter((col) => col !== "id");
    const values = Object.values(sheepData).filter((_, index) =>
      Object.keys(sheepData)[index] !== "id"
    );
    const sqlQuery = `UPDATE sheep SET ${columns.map((col) => `${col} = ?`).join(", ")} WHERE sheep_id = ?`;
    const parameters = [...values, id];

    const result = await db.runAsync(sqlQuery, parameters);

    // Handle weight insertion if needed
    if (sheepData.weight_at_birth) {
      await db.runAsync(
        'INSERT INTO sheep_weights (sheep_id, entry, date) VALUES (?, ?, ?)',
        [id, sheepData.weight_at_birth, sheepData.dob]
      );
    }

    return result;
  } catch (error) {
    throw error;
  }
}

export async function updateDateLastBred(data) {
  try {
    const db = getDatabase();
    const result = await db.runAsync(
      'UPDATE sheep SET date_last_bred = ?, last_bred_to = ? WHERE sheep_id = ?',
      [data.date, data.last_bred_to, data.sheep_id]
    );
    return result;
  } catch (error) {
    throw error;
  }
}

// FETCH FUNCTIONS  
export async function findChildren(id) {
  try {
    const db = getDatabase();
    const result = await db.getAllAsync('SELECT * FROM sheep WHERE sire = ? OR dam = ?', [id, id]);
    return result;
  } catch (error) {
    throw error;
  }
}

export async function fetchAllMedications() {
  try {
    const db = getDatabase();
    const result = await db.getAllAsync('SELECT * FROM medications');
    return result;
  } catch (error) {
    throw error;
  }
}

export async function fetchAllVaccines() {
  try {
    const db = getDatabase();
    const result = await db.getAllAsync('SELECT * FROM vaccines');
    return result;
  } catch (error) {
    throw error;
  }
}

export async function fetchSheepMeds(id) {
  try {
    const db = getDatabase();
    const result = await db.getAllAsync(`
      SELECT sheep_meds.sheep_id, sheep_meds.entry_id, sheep_meds.id, sheep_meds.date, medications.entry, sheep_meds.dosage 
      FROM sheep_meds 
      INNER JOIN medications ON sheep_meds.entry_id = medications.id 
      WHERE sheep_meds.sheep_id = ?
    `, [id]);
    return result;
  } catch (error) {
    throw error;
  }
}

export async function fetchSheepVax(id) {
  try {
    const db = getDatabase();
    const result = await db.getAllAsync(`
      SELECT sheep_vax.sheep_id, sheep_vax.entry_id, sheep_vax.id, sheep_vax.date, vaccines.entry 
      FROM sheep_vax 
      INNER JOIN vaccines ON sheep_vax.entry_id = vaccines.id 
      WHERE sheep_vax.sheep_id = ?
    `, [id]);
    return result;
  } catch (error) {
    throw error;
  }
}

export async function fetchSheepWeight(id) {
  try {
    const db = getDatabase();
    const result = await db.getAllAsync('SELECT * FROM sheep_weights WHERE sheep_id = ?', [id]);
    return result;
  } catch (error) {
    throw error;
  }
}

// INSERT FUNCTIONS
export async function addMedication(data) {
  try {
    const db = getDatabase();
    const result = await db.runAsync(
      'INSERT INTO sheep_meds (sheep_id, entry_id, date, dosage) VALUES (?, ?, ?, ?)',
      [data.sheep_id, data.value, data.date, data.dosage]
    );
    return result.lastInsertRowId;
  } catch (error) {
    throw error;
  }
}

export async function addVaccination(data) {
  try {
    const db = getDatabase();
    const result = await db.runAsync(
      'INSERT INTO sheep_vax (sheep_id, entry_id, date) VALUES (?, ?, ?)',
      [data.sheep_id, data.value, data.date]
    );
    return result.lastInsertRowId;
  } catch (error) {
    throw error;
  }
}

export async function addSheepWeight(data) {
  try {
    const db = getDatabase();
    const result = await db.runAsync(
      'INSERT INTO sheep_weights (sheep_id, entry, date) VALUES (?, ?, ?)',
      [data.sheep_id, data.value, data.date]
    );
    return result.lastInsertRowId;
  } catch (error) {
    throw error;
  }
}

export async function addNewMedication(med) {
  try {
    const db = getDatabase();
    const result = await db.runAsync('INSERT INTO medications (entry) VALUES (?)', [med]);
    return result.lastInsertRowId;
  } catch (error) {
    throw error;
  }
}

export async function addNewVaccine(val) {
  try {
    const db = getDatabase();
    const result = await db.runAsync('INSERT INTO vaccines (entry) VALUES (?)', [val]);
    return result.lastInsertRowId;
  } catch (error) {
    throw error;
  }
}
export async function addBreed(val) {
   try {
    const db = getDatabase();
    const result = await db.runAsync(
        `INSERT INTO breeds (breed_name) 
            VALUES (?)`,
        [val],
    )
        return result.lastInsertRowId;
  } catch (error) {
    console.error("Error adding breed:", error);
    throw error;
  }
}

export async function addColor(val) {
  console.log("Adding color:", val);
 try {
    const db = getDatabase();
    const result = await db.runAsync(
        `INSERT INTO colors (color_name) VALUES (?)`,
        [val],
        )
        return result.lastInsertRowId;
  } catch (error) {
    console.error("Error adding color:", error);
    throw error;
  }
}

export async function addMarking(val) {
  try {
    const db = getDatabase();
    const result = await db.runAsync(
        `INSERT INTO markings (marking_name) 
            VALUES (?)`,
        [val],
        )
        return result.lastInsertRowId;
  } catch (error) {
    throw error;
  }
}


// REMOVE FUNCTIONS
export async function deleteMarking(val) {
  try{
  const db = getDatabase();
    await db.execAsync(
        `DELETE FROM markings WHERE id = ?`,
        [val],
        )
      return { changes: 1 }; // Simulate success response
  } catch (error) {
    throw error;
  }
}

export async function deleteColor(val) {
  try{
  const db = getDatabase();
    await db.execAsync(
        `DELETE FROM colors WHERE id = ?`,
        [val],
        )
    return { changes: 1 }; // Simulate success response
  } catch (error) {
    throw error;
  }
}

export async function deleteBreed(val) {
  try{
  const db = getDatabase();
    await db.execAsync(
        `DELETE FROM breeds WHERE id = ?`,
        [val],
        )
        return { changes: 1 }; // Simulate success response
  } catch (error) {
    throw error;
  }
}

export async function deleteSheep(val) {
  try{
  const db = getDatabase();
    await db.execAsync(
        `DELETE FROM sheep WHERE sheep_id = ?`,  [val]
    )
    return { changes: 1 }; // Simulate success response
  } catch (error) {
    throw error;
  }
}
export async function removeSheepMed(id) {
  try {
    const db = getDatabase();
    
    // Use execAsync instead of runAsync
    await db.execAsync(`DELETE FROM sheep_meds WHERE id = ${id}`);
    return { changes: 1 }; // Simulate success response
  } catch (error) {
    throw error;
  }
}

export async function removeSheepVax(id) {
  try {
    const db = getDatabase();
    const result = await db.runAsync('DELETE FROM sheep_vax WHERE id = ?', [id]);
    return result;
  } catch (error) {
    throw error;
  }
}

export async function removeSheepWeight(id) {
  try {
    const db = getDatabase();
    const result = await db.runAsync('DELETE FROM sheep_weights WHERE id = ?', [id]);
    return result;
  } catch (error) {
    throw error;
  }
}