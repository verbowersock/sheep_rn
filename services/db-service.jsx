import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from "react-native-sqlite-storage";

enablePromise(true);

const queryBreeds = `CREATE TABLE IF NOT EXISTS breeds (id  BIGSERIAL PRIMARY KEY, breed_name VARCHAR(255) NOT NULL UNIQUE);`;
const queryColors = `CREATE TABLE IF NOT EXISTS colors (id  BIGSERIAL PRIMARY KEY, color_name VARCHAR(255) NOT NULL UNIQUE);`;
const queryMarkings = `CREATE TABLE IF NOT EXISTS markings (id  BIGSERIAL PRIMARY KEY, marking_name VARCHAR(255) NOT NULL UNIQUE);`;
const querySheep = `CREATE TABLE IF NOT EXISTS sheep (sheep_id  BIGSERIAL PRIMARY KEY, picture VARCHAR(255), tag_id VARCHAR(255) NOT NULL UNIQUE, scrapie_id VARCHAR(255) UNIQUE, name VARCHAR(255) UNIQUE, dob VARCHAR(50), sex VARCHAR(255) NOT NULL, sire BIGINT REFERENCES sheep (sheep_id) ON DELETE RESTRICT ON UPDATE CASCADE, dam BIGINT REFERENCES sheep (sheep_id) ON DELETE RESTRICT ON UPDATE CASCADE, purchase_date VARCHAR(50), weight_at_birth INTEGER, date_deceased VARCHAR(255), breed_id BIGINT NOT NULL REFERENCES breeds (id) ON DELETE RESTRICT ON UPDATE CASCADE, color_id BIGINT REFERENCES colors (id) ON DELETE RESTRICT ON UPDATE CASCADE, marking_id BIGINT REFERENCES markings (id) ON DELETE RESTRICT ON UPDATE CASCADE, date_last_bred VARCHAR(255));`;
const createBreeds = `
        
          INSERT INTO breeds (id, breed_name) VALUES ('2', 'katahdin');
    `;
const createColors = `BEGIN TRANSACTION;
          INSERT INTO colors (id, color_name) VALUES ('1', 'White');
          INSERT INTO colors (id, color_name) VALUES ('2', 'Light Grey');
          INSERT INTO colors (id, color_name) VALUES ('3', 'Grey');
          INSERT INTO colors (id, color_name) VALUES ('4', 'Emsket');
          INSERT INTO colors (id, color_name) VALUES ('5', 'Shaela');
          INSERT INTO colors (id, color_name) VALUES ('6', 'Black');
          INSERT INTO colors (id, color_name) VALUES ('7', 'Musket');
          INSERT INTO colors (id, color_name) VALUES ('8', 'Fawn');
          INSERT INTO colors (id, color_name) VALUES ('9', 'Mioget');
          INSERT INTO colors (id, color_name) VALUES ('10', 'Moorit');
          INSERT INTO colors (id, color_name) VALUES ('11', 'Dark');
          INSERT INTO colors (id, color_name) VALUES ('12', 'Brown');
COMMIT;
          `;
const createMarkings = `BEGIN TRANSACTION;
           INSERT INTO markings (id, marking_name) VALUES ('1', 'Bielset');
           INSERT INTO markings (id, marking_name) VALUES ('2', 'Blaget');    
           INSERT INTO markings (id, marking_name) VALUES ('3', 'Bleset');    
           INSERT INTO markings (id, marking_name) VALUES ('4', 'Flecket');    
           INSERT INTO markings (id, marking_name) VALUES ('5', 'Fronet');    
           INSERT INTO markings (id, marking_name) VALUES ('6', 'Gulmoget');    
           INSERT INTO markings (id, marking_name) VALUES ('7', 'Iset');    
           INSERT INTO markings (id, marking_name) VALUES ('8', 'Katmoget');    
           INSERT INTO markings (id, marking_name) VALUES ('9', 'Mirkface');    
           INSERT INTO markings (id, marking_name) VALUES ('10', 'Smirslet');    
          INSERT INTO markings (id, marking_name) VALUES ('11', 'Sokket');   
             INSERT INTO markings (id, marking_name) VALUES ('12', 'Sponget');   
              INSERT INTO markings (id, marking_name) VALUES ('13', 'Yuglet');   
               INSERT INTO markings (id, marking_name) VALUES ('14', 'Solid');          
          COMMIT
               `;
const createSheep = `
BEGIN TRANSACTION;
INSERT INTO sheep (sheep_id, picture, tag_id, scrapie_id, name, dob, sex, sire, dam, purchase_date, weight_at_birth, date_deceased, breed_id, color_id, marking_id, date_last_bred) 
            VALUES ('1', '', '1234abc', '4322342', 'Betsy', 2020-10-02, 'f', '', '', 2020-01-01, 4, null, '1', '2', '3', null);
INSERT INTO sheep (sheep_id, picture, tag_id, scrapie_id, name, dob, sex, sire, dam, purchase_date, weight_at_birth, date_deceased, breed_id, color_id, marking_id, date_last_bred) 
            VALUES ('2', '', '456abc', '5665566', 'Hugo', 2020-11-02, 'm', null, null, 2020-01-01, 4, null, 3, 4, 5, null);
INSERT INTO sheep (sheep_id, picture, tag_id, scrapie_id, name, dob, sex, sire, dam, purchase_date, weight_at_birth, date_deceased, breed_id, color_id, marking_id, date_last_bred) 
            VALUES ('3', '', '789abc', '9998899', 'Mary', 2020-12-02, 'f', 2, 1, null, 4, null, 1, 7, 8, null);           
COMMIT
            `;

export const getDBConnection = async () => {
  return openDatabase({ name: "sheep-data.db", location: "default" });
};

const createTable = async (db, query) => {
  await db.executeSql(query);
  console.log("executing query");
};

export const dropAllTables = async (db) => {
  await db.executeSql("DROP TABLE sheep;");
  await db.executeSql("DROP TABLE breeds;");
  await db.executeSql("DROP TABLE colors;");
  await db.executeSql("DROP TABLE markings;");
};

export const createTables = async (db) => {
  await createTable(db, queryBreeds);
  await createTable(db, queryColors);
  await createTable(db, queryMarkings);
  await createTable(db, querySheep);
};

const insertDataQuery = async (db, query) => {
  await db.executeSql(query);
  console.log("inserting data");
};

export const insertTestData = async (db) => {
  await insertDataQuery(db, createBreeds);
  await insertDataQuery(db, createMarkings);
  await insertDataQuery(db, createColors);
  await insertDataQuery(db, createSheep);
};

export const getAllBreeds = async (db) => {
  try {
    const allBreeds = [];
    const results = await db.executeSql(`SELECT * from breeds`);
    return results;
  } catch (error) {
    console.error(error);
    throw Error("Failed to get sheep");
  }
};

export const getAllSheep = async (db) => {
  try {
    const allSheep = [];
    const results = await db.executeSql(
      `SELECT children.sheep_id, children.tag_id, children.name, children.dob, breeds.breed_name,colors.color_name,
	sires.name,
	sires.tag_id,
 dams.name,
 dams.tag_id
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
	children.color_id = colors.id`
    );
    results.forEach((result) => {
      for (let index = 0; index < result.rows.length; index++) {
        console.log(result);
        allSheep.push(result.rows.item(index));
      }
    });
    return allSheep;
  } catch (error) {
    console.error(error);
    throw Error("Failed to get sheep");
  }
};
/*
export const saveTodoItems = async (
  db,
  todoItems: ToDoItem[]
) => {
  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName}(rowid, value) values` +
    todoItems.map((i) => `(${i.id}, '${i.value}')`).join(",");

  return db.executeSql(insertQuery);
};

export const deleteTodoItem = async (db: SQLiteDatabase, id: number) => {
  const deleteQuery = `DELETE from ${tableName} where rowid = ${id}`;
  await db.executeSql(deleteQuery);
};

export const deleteTable = async (db: SQLiteDatabase) => {
  const query = `drop table ${tableName}`;

  await db.executeSql(query);
};*/
