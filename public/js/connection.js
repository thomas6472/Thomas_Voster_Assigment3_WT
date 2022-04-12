const {MongoClient} = require('mongodb');

const uri = "mongodb+srv://thomas:assignment3@assignment.wpvdu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
let client = new MongoClient(uri);

try {
    await client.connect();
} catch (e) {
    console.error(e);
} finally {
    await client.close();
}