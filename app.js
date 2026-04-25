const NODE_ENV = process.env.NODE_ENV;
const API_KEY  = process.env.API_KEY;

// The app REQUIRES these secrets to function — fail fast if missing
if (!NODE_ENV || !API_KEY) {
    console.error("ERROR: Missing required secrets (NODE_ENV, API_KEY). App cannot start.");
    process.exit(1);
}

console.log("NODE_ENV:", NODE_ENV);
console.log("API_KEY :", API_KEY);

// Http Server
const http = require("http");
const hostname = "127.0.0.1";
const port = 3000;

// File System
const fs = require("fs");
const directory_name = "./";
const filesnames = fs.readdirSync(directory_name);

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");

    const demo = {
        environment: NODE_ENV,
        apiKey: API_KEY,
        files: NODE_ENV === "development" ? filesnames : "hidden in non-development env"
    };

    res.end(JSON.stringify(demo, null, 2));
});

server.listen(port, hostname, () => {});