import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import debug from 'debug';
import config from './config';

const apiDebug = debug('API');
let db;

export default () => {
  const connect = async () => {
    db = await open({
      filename: config.db.storage,
      driver: sqlite3.Database,
    });
  };

  const insertTradesperson = async (name, longitude, latitude) => {
    try {
      const dbOp = await db.run('INSERT INTO tradespersons(name, longitude, latitude) VALUES (?, ?, ?)', name, longitude, latitude);

      return dbOp.lastID;
    } catch (e) {
      apiDebug(e);
      // here we can log the error to an external service

      return null;
    }
  };

  const insertJob = async (description, longitude, latitude, maxTradespersonDistance) => {
    try {
      const dbOp = await db.run('INSERT INTO jobs(description, longitude, latitude, maxTradespersonDistance) VALUES (?, ?, ?, ?)',
        description, longitude, latitude, maxTradespersonDistance);

      return dbOp.lastID;
    } catch (e) {
      apiDebug(e);
      // here we can log the error to an external service

      return null;
    }
  };

  const findJobsInRange = async (tradespersonId) => {
    try {
      const tradesperson = await db.get('SELECT longitude, latitude FROM tradespersons WHERE id = ?', tradespersonId);

      if (tradesperson) {
        const rangeFormula = `(longitude - ${tradesperson.longitude}) * (longitude - ${tradesperson.longitude}) + 
          (latitude - ${tradesperson.latitude}) * (latitude - ${tradesperson.latitude}) < maxTradespersonDistance * maxTradespersonDistance`;

        const jobs = await db.all(`SELECT description, longitude, latitude from jobs where ${rangeFormula}`);

        return jobs;
      }

      return null;
    } catch (e) {
      apiDebug(e);
      // here we can log the error to an external service

      return null;
    }
  };

  const createTables = async () => {
    await db.run(`
      CREATE TABLE IF NOT EXISTS "jobs" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "description" TEXT,
        "longitude" REAL,
        "latitude" REAL,
        "maxTradespersonDistance" REAL
      );
    `);

    await db.run(`
      CREATE TABLE IF NOT EXISTS "tradespersons" (
          "id" INTEGER PRIMARY KEY AUTOINCREMENT,
          "name" TEXT,
          "longitude" REAL,
          "latitude" REAL
      );
    `);
  };

  const removeTables = async () => {
    await db.run('DROP TABLE jobs');
    await db.run('DROP TABLE tradespersons');
  };

  return {
    connect,
    createTables,
    removeTables,
    insertTradesperson,
    insertJob,
    findJobsInRange,
  };
};
