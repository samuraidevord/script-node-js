#! /usr/bin/env bash
":"; //# comment; exec /usr/bin/env node --input-type=module - "$@" < "$0"
import { execSync } from "child_process";

const color = (color, text) => {
  const COLORS = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
  };
  return `${COLORS[color]}${text}${COLORS["reset"]}`;
};

const chop = (str) => str.replace(/\n$/, "");
const exec = (cmd) => chop(execSync(cmd).toString());
const PNPM = exec(`echo $(which pnpm)`);
const PM = PNPM ? "pnpm" : YARN ? "yarn" : "npm";
exec("npm init -y ");
exec("mkdir -p controllers db helpers middleware models router utils");
exec(`cat > .env << EOF
PORT=3000 
EOF`);
exec(`cat > index.js << EOF
import express from "express";
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
app.get("/", (req, res) => {
  res.status(200).json({
    msg: "Hello World",
  });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en: http://localhost:3000/");
});
EOF`);

exec(`cat >package.json << EOF
{
    "name": "server",
    "version": "1.0.0",
    "description": "Backend aplicación",
    "main": "index.js",
    "type": "module",
    "scripts": {
      "dev": "nodemon index.js",
      "start": "node index.js"
    },
    "keywords": [],
    "author": "samurari.dev.ordiales",
    "license": "ISC",
    "dependencies": {
      "bcryptjs": "^2.4.3",
      "body-parser": "^1.20.1",
      "connect-multiparty": "^2.2.0",
      "cors": "^2.8.5",
      "dotenv": "^16.0.3",
      "express": "^4.18.2",
      "jsonwebtoken": "^8.5.1",
      "mongoose": "^6.6.7",
      "mongoose-paginate": "^5.0.3",
      "nodemon": "^2.0.20"
    }
  }
EOF`);

console.log(`\n¡${color("green", "Listo")}! Para empezar, escribe:
cd name 
${PM} install
${PM} run dev`);
