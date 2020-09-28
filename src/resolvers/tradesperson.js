import getDB from '../db';

// eslint-disable-next-line import/prefer-default-export
export const addTradesperson = async (_, { input: { name, longitude, latitude } }) => {
  const db = getDB();

  const insertId = await db.insertTradesperson(name, longitude, latitude);

  if (!insertId) {
    return {
      success: false,
    };
  }

  return {
    success: true,
    tradespersonId: insertId,
  };
};
