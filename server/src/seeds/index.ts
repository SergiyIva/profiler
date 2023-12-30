import db from "../db.js";
import models from "../models/index.js";

const dbHost = process.env.DB_HOST;
const template = {
  email: "@11111.com",
  birthday: "12.12.2000",
  gender: "male",
  password: "1234",
};

async function seedDB() {
  try {
    await db.connect(dbHost);
    const data = [...Array(100)].map((_, i) => ({
      ...template,
      email: "user" + i + template.email,
      username: "user" + i,
    }));
    await models.User.insertMany(data);
    console.log("Database seeded!");
  } catch (e) {
    console.error(e);
  } finally {
    await db.close();
  }
}
seedDB();
