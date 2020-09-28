import { addTradesperson } from './tradesperson';
import { addJob, findJobsInRange } from './jobs';

export default {
  Query: {
    findJobsInRange,
  },
  Mutation: {
    addTradesperson,
    addJob,
  },
};
