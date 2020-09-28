import getDB from '../db';

export const addJob = async (_,
  {
    input: {
      description, longitude, latitude, maxTradespersonDistance,
    },
  }) => {
  const db = getDB();

  const insertId = await db.insertJob(description, longitude, latitude, maxTradespersonDistance);

  if (!insertId) {
    return {
      success: false,
    };
  }

  return {
    success: true,
    jobId: insertId,
  };
};

export const findJobsInRange = async (_, { tradespersonId }) => {
  const db = getDB();

  const jobs = await db.findJobsInRange(tradespersonId);

  if (!jobs) {
    return {
      success: false,
    };
  }

  return {
    success: true,
    jobs,
  };
};
