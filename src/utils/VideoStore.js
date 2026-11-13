// Demo storage for uploaded video files. They stay inside this browser (IndexedDB).
// With a real backend, uploads would go to cloud storage instead.
const DB_NAME = 'coaching-files'
const STORE = 'videos'

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function run(mode, action) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode)
    const req = action(tx.objectStore(STORE))
    tx.oncomplete = () => resolve(req.result)
    tx.onerror = () => reject(tx.error)
  })
}

export const saveFile = (id, blob) => run('readwrite', (s) => s.put(blob, id))
export const getFile = (id) => run('readonly', (s) => s.get(id))
export const deleteFile = (id) => run('readwrite', (s) => s.delete(id))