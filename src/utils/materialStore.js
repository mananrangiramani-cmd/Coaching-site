const DB = 'coaching-materials'
const STORE = 'files'

const open = () =>
  new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1)
    r.onupgradeneeded = () => r.result.createObjectStore(STORE)
    r.onsuccess = () => res(r.result)
    r.onerror = () => rej(r.error)
  })

export async function putFile(id, blob) {
  const db = await open()
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(blob, id)
    tx.oncomplete = () => res()
    tx.onerror = () => rej(tx.error)
  })
}

export async function getFile(id) {
  const db = await open()
  return new Promise((res, rej) => {
    const q = db.transaction(STORE).objectStore(STORE).get(id)
    q.onsuccess = () => res(q.result)
    q.onerror = () => rej(q.error)
  })
}

export async function removeFile(id) {
  const db = await open()
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(id)
    tx.oncomplete = () => res()
    tx.onerror = () => rej(tx.error)
  })
}