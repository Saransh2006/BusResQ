
const DB_NAME = "busresq-db";
const DB_VERSION = 1;
const STORE_NAME = "reports";

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
        });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveReport(report) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");

    transaction.objectStore(STORE_NAME).put(report);

    transaction.oncomplete = () => {
      db.close();
      resolve(report);
    };

    transaction.onerror = () => {
      const error = transaction.error;
      db.close();
      reject(error);
    };

    transaction.onabort = () => {
      const error = transaction.error;
      db.close();
      reject(error || new Error("Report save was cancelled."));
    };
  });
}

export async function getReports() {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).getAll();

    request.onsuccess = () => {
      const reports = request.result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );

      resolve(reports);
    };

    request.onerror = () => reject(request.error);

    transaction.oncomplete = () => db.close();

    transaction.onerror = () => {
      const error = transaction.error;
      db.close();
      reject(error);
    };
  });
}
