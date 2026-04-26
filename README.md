# DEMO PURPOSE ONLY

### Secure Application Development

Node Secrets Assignment: Scenario 3 **Extension** - Non Shared Files <br>
April 26, 2026 <br>
This app is a **Code Secret Demo - Using Fake Secrets.**


# Non-Shared Files — AWS Secrets Manager 

Instead of loading secrets from a local `.env` file, this version fetches them from
**AWS Secrets Manager** at startup. <br>
This approach is **Best Practice** since no secrets live locally or in the
repository.

### What this app does:

At startup the app calls AWS Secrets Manager, retrieves a JSON string that is parsed into an object, and
uses the values to run an HTTP server that echoes them back (for demo
purposes). If the secrets can't be retrieved, the app exits with an
error.

# Required AWS setup

1. Must have an AWS account with proper credentials with IAM permission.

2. Confirm that the AWS CLI is installed.
     
     Run `aws --version` in the terminal to check.

     Should return a version similar to: aws-cli/2.30.6 

3. Verify AWS CLI is configured with your credentials by running: 

        aws sts get-caller-identity

    **Expected result:** JSON with your account number, user ID, and an ARN.


4. Create the secret in AWS Secrets Manager

    * **Region:** `us-east-1`
    * **Secret name:** `demo-app/secrets`
    * **Key/value pairs** 
        - Key: `NODE_ENV` |  Value: `development`
        - Key: `API_KEY`  |  Value: `FAKE_AWS_SECRETS_MANAGER_KEY`

  

### Other Requirements

- Node.js (latest LTS)


<br>

<br>

# Install and Run the App

Once you cd into the application root directory follow these steps:

1.  Install Dependencies

        npm install

2.  Run the server 

        node app.js

3.  TEST in the browser

    http://127.0.0.1:3000/


<br>

## Secret Errors

There are two "secret related errors."

1. ERROR: App could not load secrets. <br>
   This error means there was an issue retrieving secrets from the AWS Secrets Manager.

2. ERROR: Missing required secrets. <br>
   This error means AWS secrets did load but something in the keys may be wrong. <br>
   Check to make sure the secrets entered in the Secrets Manager match the required key/value pairs.
    - Check casing, keys are case-sensitive.
    - Check for trailing whitespace, extra spaces will cause a mismatch.

<br>

## Outcomes:

1. The terminal should display the secret variables and their values.

```bash
    NODE_ENV: development
    API_KEY : FAKE_AWS_SECRETS_MANAGER_KEY
    Server running at http://127.0.0.1:3000/
```
<br>

2. The browser will display the secret and application files in JSON.

```json

    {
    "environment": "development",
    "apiKey": "FAKE_AWS_SECRETS_MANAGER_KEY",
    "source": "AWS Secrets Manager",
    "files": [
        ".git",
        ".gitignore",
        "README.md",
        "app.js",
        "node_modules",
        "package-lock.json",
        "package.json"
     ]
    }

```

<br>

## Why this is a "Better Practice" 
Using a Secret Management Service is a better practice than using a `.env` because:

- No secrets are stored on a local machine or in a file, so there is nothing to accidentally commit or leak.
- Central control plane: all secrets live in one managed service.
- Access control: The IAM policies determine which identities can read
  which secrets.
- Auditing: Every `GetSecretValue` call is logged in CloudTrail which can be used for auditing. 
- Rotation: Though it is not done dynamically, key values can be updated in the AWS Console without any
  code change or redeployment.

### This satisfies most of the standard Secret Management best practices.

