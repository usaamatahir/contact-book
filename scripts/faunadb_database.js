const readline = require("readline");
const faunadb = require("faunadb");
const insideNetlify = insideNetlifyBuildContext();
const q = faunadb.query;

require("dotenv").config();

function insideNetlifyBuildContext() {
  if (process.env.DEPLOY_PRIME_URL) {
    return true;
  }
  return false;
}

function ask(question, callback) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question(question + "\n", function (answer) {
    rl.close();
    callback(null, answer);
  });
}

function createFaunaDB(key) {
  console.log("Creating The Database");
  const client = new faunadb.Client({ secret: key });

  return client
    .query(q.Create(q.Ref("classes"), { name: "contactBook" }))
    .then(() => {
      return client.query(
        q.Create(q.Ref("indexes"), {
          name: "all_contact",
          source: q.Ref("classes/contactBook"),
        })
      );
    })
    .catch((e) => {
      if (
        e.requestResult.statusCode === 400 &&
        e.message === "instance not unique"
      ) {
        console.log("DB already exists");
        throw e;
      }
    });
}

console.log("Creating your FaunaDB database");

if (!process.env.CONTACTBOOK_SECRET_KEY) {
  console.log("FaunaDB SECRET_KEY not found");
  if (insideNetlify) {
    console.log(
      `Visit https://app.netlify.com/sites/YOUR_SITE_HERE/settings/deploys`
    );
    console.log(
      'and set a `FAUNADB_SECRET` value in the "Build environment variables" section'
    );
    process.exit(1);
  }
  if (!insideNetlify) {
    ask("Enter your FaunaDb key here", (err, answer) => {
      if (!answer) {
        console.log("Please Enter a FaunaDB Key ");
        process.exit(1);
      }
      createFaunaDB(process.env.CONTACTBOOK_SECRET_KEY).then(() => {
        console.log("DataBase Created");
      });
    });
  }
}

if (process.env.CONTACTBOOK_SECRET_KEY) {
  createFaunaDB(process.env.CONTACTBOOK_SECRET_KEY).then(() => {
    console.log("DataBase Created");
  });
}
