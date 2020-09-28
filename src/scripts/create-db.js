import getDb from '../db';

(async () => {
  const db = getDb();
  await db.connect();
  await db.createTables();
})();
