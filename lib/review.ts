// import { NextApiRequest, NextApiResponse } from 'next'
// import { MongoClient, Db } from 'mongodb'

// // Replace with your actual MongoDB connection string
// const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/your_database_name"

// let cachedDb: Db | null = null

// async function connectToDatabase(): Promise<Db> {
//   if (cachedDb) {
//     return cachedDb
//   }

//   const client = await MongoClient.connect(uri)
//   const db = client.db()
//   cachedDb = db
//   return db
// }

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const db = await connectToDatabase()
//   const collection = db.collection('reviews')

//   if (req.method === 'GET') {
//     try {
//       // Get the most recent review
//       const latestReview = await collection.findOne({}, { sort: { date: -1 } })
      
//       if (latestReview) {
//         res.status(200).json(latestReview)
//       } else {
//         res.status(404).json({ message: 'No reviews found' })
//       }
//     } catch (error) {
//       res.status(500).json({ message: 'Error fetching latest review', error })
//     }
//   } else if (req.method === 'POST') {
//     try {
//       const newReview = req.body
//       newReview.date = new Date()

//       const result = await collection.insertOne(newReview)
      
//       res.status(201).json({ 
//         message: 'Review added successfully', 
//         reviewId: result.insertedId 
//       })
//     } catch (error) {
//       res.status(500).json({ message: 'Error adding new review', error })
//     }
//   } else {
//     res.status(405).json({ message: `Method ${req.method} Not Allowed` })
//   }
// }

