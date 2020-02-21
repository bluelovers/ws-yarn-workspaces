{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@now/node@canary"
    }
  ],
  "routes": [
    {
      "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, Content-Type, Accept"
      },
      "src": "/.*",
      "dest": "/index.js"
    }
  ],
  "env": {
    "VERSION": "1.0.0"
  }
}
