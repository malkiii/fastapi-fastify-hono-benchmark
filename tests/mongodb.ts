import { MongoClient } from 'mongodb';

const MONGODB_URI = new URL(process.env.MONGODB_URI!);

// Use localhost for local dev environment
MONGODB_URI.hostname = 'localhost';

export async function initializeMongodb() {
  const client = new MongoClient(MONGODB_URI.toString());

  try {
    // Connect to MongoDB
    await client.connect();

    // Access the database and collection
    const db = client.db('benchmark-data');
    const collection = db.collection('Items');

    // Check if collection is empty
    const itemCount = await collection.countDocuments();

    if (itemCount === 0) {
      console.log('Collection is empty. Inserting 1000 items...');

      // Generate 1000 random items
      const items = Array.from({ length: 1000 }, () => ({
        code: crypto.randomUUID(),
        createdAt: Date.now(),
      }));

      // Insert items into the collection
      await collection.insertMany(items);
      console.log('1000 items inserted successfully.');
    } else {
      console.log(`Collection already has ${itemCount} items.`);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the connection
    await client.close();
  }
}
