// Pull in the AWS SDK client and command needed for Secrets Manager.
const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");

//Define the AWS region and secret name.
const AWS_REGION = "us-east-1";
const SECRET_NAME = "demo-app/secrets";

// Create the client for the Secrets Manager calls.
const client = new SecretsManagerClient({ region: AWS_REGION });

// Get the secrets from AWS and return them as an object.
async function loadSecrets() {
  // Send the GetSecretValueCommand and await the response from AWS.
  const response = await client.send(
    new GetSecretValueCommand({ SecretId: SECRET_NAME }),
  );

  return JSON.parse(response.SecretString);
}

async function startApp() {
  // Try to fetch the secrets from AWS; if it fails, log the error and stop the app
  let secrets;
  try {
    secrets = await loadSecrets();
  } catch (err) {
    console.error("ERROR: App could not load secrets.");
    console.error(err.message);
    process.exit(1);
  }

  // Store the key/value pairs from the secret object
  const NODE_ENV = secrets.NODE_ENV;
  const API_KEY = secrets.API_KEY;

  // Check for secrets. Stop the app if any required secret is missing
  if (!NODE_ENV || !API_KEY) {
    console.error("ERROR: Missing required secrets.");
    process.exit(1);
  }

  // Test that the secrets loaded
  console.log("NODE_ENV:", NODE_ENV);
  console.log("API_KEY :", API_KEY);

  // HTTP server
  const http = require("http");
  const hostname = "127.0.0.1";
  const port = 3000;

  // Read the list of files in the current folder
  const fs = require("fs");
  const directory_name = "./";
  const filesnames = fs.readdirSync(directory_name);

  // Build the server
  const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");

    // Build the response body
    const body = {
      environment: NODE_ENV,
      apiKey: API_KEY,
      source: "AWS Secrets Manager",
      // Check: Only expose the file list in the body when running in development
      files:
        NODE_ENV === "development"
          ? filesnames
          : "hidden in non-development env",
    };
    // Send the body as a pretty-printed JSON string (no replacer, 2-space indent)
    res.end(JSON.stringify(body, null, 2));
  });

  // Listen for incoming connections
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}

startApp();
