import { openDB } from "idb";

const DB_NAME = "of2-2";
const DB_VERSION = 1;
const DB_OS_NAMES = {
  scores: "scores",
};

const db = await openDB(DB_NAME, DB_VERSION, {
  upgrade: (upgradeDB, oldVersion) => {
    switch (oldVersion) {
      case 0:
        const scoresOS = upgradeDB.createObjectStore(DB_OS_NAMES.scores, {
          autoIncrement: true,
        });
      // scoresOS.createIndex()
    }
  },
});

const addScore = async (score: Score) => {
  const tx = db.transaction(DB_OS_NAMES.scores, "readwrite");
  const store = tx.objectStore(DB_OS_NAMES.scores);
  await store.add({ ...score, createdAt: new Date() });
  await tx.done;
};

export { addScore };
