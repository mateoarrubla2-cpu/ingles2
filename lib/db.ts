import fs from 'fs/promises'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'db.json')

interface Database {
  profiles: any[]
  classrooms: any[]
  classroom_members: any[]
  communities: any[]
  community_members: any[]
  community_posts: any[]
  post_replies: any[]
  post_likes: any[]
}

let cachedDb: Database | null = null

/**
 * Read the entire database from db.json
 */
export async function readDb(): Promise<Database> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8')
    cachedDb = JSON.parse(data)
    return cachedDb
  } catch (error) {
    console.error('Error reading database:', error)
    throw new Error('Failed to read database')
  }
}

/**
 * Write the entire database to db.json
 */
export async function writeDb(db: Database): Promise<void> {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf-8')
    cachedDb = db
  } catch (error) {
    console.error('Error writing database:', error)
    throw new Error('Failed to write database')
  }
}

/**
 * Get cached database (use with caution, query will return reference)
 */
export function getCachedDb(): Database | null {
  return cachedDb
}

/**
 * Query a table by field
 */
export async function queryTable<T = any>(
  tableName: keyof Database,
  fieldName: string,
  value: any
): Promise<T[]> {
  const db = await readDb()
  const table = db[tableName]
  
  if (!Array.isArray(table)) {
    return []
  }

  return table.filter((item: any) => item[fieldName] === value) as T[]
}

/**
 * Find a single item in a table
 */
export async function findOne<T = any>(
  tableName: keyof Database,
  fieldName: string,
  value: any
): Promise<T | undefined> {
  const results = await queryTable<T>(tableName, fieldName, value)
  return results[0]
}

/**
 * Get all items from a table
 */
export async function getAll<T = any>(tableName: keyof Database): Promise<T[]> {
  const db = await readDb()
  return (db[tableName] || []) as T[]
}

/**
 * Insert a new item into a table
 */
export async function insertOne<T = any>(
  tableName: keyof Database,
  data: T
): Promise<T> {
  const db = await readDb()
  
  if (!Array.isArray(db[tableName])) {
    throw new Error(`Table ${tableName} does not exist`)
  }

  db[tableName].push(data)
  await writeDb(db)
  
  return data
}

/**
 * Update items in a table
 */
export async function updateMany<T = any>(
  tableName: keyof Database,
  fieldName: string,
  fieldValue: any,
  updateData: Partial<T>
): Promise<T[]> {
  const db = await readDb()
  
  if (!Array.isArray(db[tableName])) {
    throw new Error(`Table ${tableName} does not exist`)
  }

  const updated: T[] = []
  
  db[tableName] = db[tableName].map((item: any) => {
    if (item[fieldName] === fieldValue) {
      const merged = { ...item, ...updateData }
      updated.push(merged)
      return merged
    }
    return item
  })

  await writeDb(db)
  return updated
}

/**
 * Update a single item
 */
export async function updateOne<T = any>(
  tableName: keyof Database,
  fieldName: string,
  fieldValue: any,
  updateData: Partial<T>
): Promise<T | undefined> {
  const results = await updateMany<T>(tableName, fieldName, fieldValue, updateData)
  return results[0]
}

/**
 * Delete items from a table
 */
export async function deleteMany(
  tableName: keyof Database,
  fieldName: string,
  fieldValue: any
): Promise<number> {
  const db = await readDb()
  
  if (!Array.isArray(db[tableName])) {
    throw new Error(`Table ${tableName} does not exist`)
  }

  const initialLength = db[tableName].length
  db[tableName] = db[tableName].filter((item: any) => item[fieldName] !== fieldValue)
  const deletedCount = initialLength - db[tableName].length

  if (deletedCount > 0) {
    await writeDb(db)
  }

  return deletedCount
}

/**
 * Delete a single item
 */
export async function deleteOne(
  tableName: keyof Database,
  fieldName: string,
  fieldValue: any
): Promise<boolean> {
  const count = await deleteMany(tableName, fieldName, fieldValue)
  return count > 0
}

/**
 * Generate a unique ID
 */
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 15)
  return prefix ? `${prefix}-${timestamp}-${randomStr}` : `${timestamp}-${randomStr}`
}

/**
 * Generate a unique code (for classrooms and communities)
 */
export function generateCode(length: number = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}
