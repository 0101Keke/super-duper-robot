require('dotenv').config();
const mongoose = require('mongoose');

async function dropUsernameIndex() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(' Connected to MongoDB');

        const db = mongoose.connection.db;
        const collection = db.collection('users');

        // Get all indexes
        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes);

        // Drop the username index
        try {
            await collection.dropIndex('username_1');
            console.log('Dropped username_1 index');
        } catch (err) {
            console.log('  username_1 index does not exist');
        }

        // Verify
        const newIndexes = await collection.indexes();
        console.log('Remaining indexes:', newIndexes);

        await mongoose.connection.close();
        console.log(' Done!');
        process.exit(0);
    } catch (error) {
        console.error(' Error:', error);
        process.exit(1);
    }
}

dropUsernameIndex();