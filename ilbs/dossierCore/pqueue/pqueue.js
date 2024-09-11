import PQueue from "@ilb/p-queue";

import PriorityQueueEx from "./PriorityQueueEx.js";

/* eslint-disable radix -- Отключение правила radix */
const queue = new PQueue({
  concurrency: parseInt(process.env.PQUEUE_CONCURRENCY) || 5,
  queueClass: PriorityQueueEx,
});

/* eslint-enable radix -- Отключение правила radix */
export default queue;
