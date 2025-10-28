// server/checkCollections.js
require('dotenv').config();
const mongoose = require('mongoose');

async function checkCollections() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(' Connected to MongoDB\n');

        const db = mongoose.connection.db;
        console.log(` Database Name: ${db.databaseName}\n`);

        // Collections to check
        const collections = [
            'users', 'students', 'tutors', 'courses',
            'topics', 'discussions', 'resources',
            'assignments', 'submissions', 'enrollments'
        ];

        console.log(' COLLECTION STATISTICS:\n');
        console.log('='.repeat(50));

        let totalDocuments = 0;

        for (const collName of collections) {
            try {
                const collection = db.collection(collName);
                const count = await collection.countDocuments();
                totalDocuments += count;

                console.log(`\n ${collName.toUpperCase()}: ${count} documents`);

                if (count > 0) {
                    // Get a sample document
                    const sample = await collection.findOne();
                    const fields = Object.keys(sample);
                    console.log(`   Fields: ${fields.slice(0, 7).join(', ')}${fields.length > 7 ? '...' : ''}`);

                    // Special analysis for specific collections
                    if (collName === 'users') {
                        // Check for role field or userType field
                        const roles = await collection.distinct('role').catch(() => []);
                        const userTypes = await collection.distinct('userType').catch(() => []);

                        if (roles.length > 0) {
                            console.log(`   Roles found: ${roles.join(', ')}`);
                            for (const role of roles) {
                                const count = await collection.countDocuments({ role });
                                console.log(`     - ${role}: ${count} users`);
                            }
                        }

                        if (userTypes.length > 0) {
                            console.log(`   User Types found: ${userTypes.join(', ')}`);
                            for (const type of userTypes) {
                                const count = await collection.countDocuments({ userType: type });
                                console.log(`     - ${type}: ${count} users`);
                            }
                        }

                        // Show sample user (without password)
                        const { password, ...safeUser } = sample;
                        console.log('\n   Sample User:');
                        console.log(JSON.stringify(safeUser, null, 4).split('\n').map(line => '   ' + line).join('\n'));
                    }

                    if (collName === 'students') {
                        console.log('   Sample Student:');
                        console.log(JSON.stringify(sample, null, 4).split('\n').map(line => '   ' + line).join('\n'));
                    }

                    if (collName === 'tutors') {
                        const approved = await collection.countDocuments({ isApproved: true });
                        const pending = await collection.countDocuments({ isApproved: false });
                        console.log(`   Status: ${approved} approved, ${pending} pending`);

                        console.log('   Sample Tutor:');
                        console.log(JSON.stringify(sample, null, 4).split('\n').map(line => '   ' + line).join('\n'));
                    }

                    if (collName === 'courses') {
                        const active = await collection.countDocuments({ isActive: true });
                        const inactive = await collection.countDocuments({ isActive: false });
                        console.log(`   Status: ${active} active, ${inactive} inactive`);

                        console.log('   Sample Course:');
                        console.log(JSON.stringify(sample, null, 4).split('\n').map(line => '   ' + line).join('\n'));
                    }
                }
            } catch (err) {
                console.log(` ${collName.toUpperCase()}: Collection not found or error`);
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log(` TOTAL DOCUMENTS ACROSS ALL COLLECTIONS: ${totalDocuments}`);
        console.log('='.repeat(50));

        await mongoose.disconnect();
        console.log('\n Disconnected from MongoDB');

    } catch (error) {
        console.error(' Error:', error.message);
        console.error('Make sure your MONGODB_URI in .env is correct');
    }
}

// Run the check
checkCollections();