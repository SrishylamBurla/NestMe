import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://srishylamburla1_db_user:6rJ4orrmi5aXqzKb@irealestate.dpqs6hi.mongodb.net/realestate";

async function run() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected successfully");

    const admin = client.db("admin");
    console.log(await admin.command({ ping: 1 }));
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();