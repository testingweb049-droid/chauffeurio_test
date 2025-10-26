import { MongoClient, Db } from "mongodb";

const uri: string = process.env.MONGO_URI!;

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (db) return db;

  if (!client) {
    console.log("📡 Connecting to MongoDB...");
    client = new MongoClient(uri);
    await client.connect();
    console.log("✅ Connected to MongoDB");
  }

  db = client.db(); // Optional: .db("your-db-name")
  return db;
}
