// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

const faunadb = require("faunadb");

const q = faunadb.query;

require("dotenv").config();

const handler = async (event) => {
  let dataObj = JSON.parse(event.body);

  console.log(dataObj);
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method not Allowed" };
    }
    const client = new faunadb.Client({
      secret: process.env.CONTACTBOOK_SECRET_KEY,
    });

    const result = await client.query(
      q.Update(q.Ref(q.Collection("contactBook"), dataObj.id), {
        data: { name: dataObj.name, number: dataObj.number },
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
