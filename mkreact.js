#! /usr/bin/env bash
":"; //# comment; exec /usr/bin/env node --input-type=module - "$@" < "$0"
import { execSync } from "child_process";
import { existsSync, accessSync, constants } from "fs";

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
const VERSION = "1.0";
const [NAME, ...ARGS] = process.argv.slice(2).map((arg) => arg.toLowerCase());
const COMMAND = process.argv[0];
const PARAMS = process.argv.slice(2).length;

const CURL = exec(`echo $(which curl)`);
const PNPM = exec(`echo $(which pnpm)`);
const YARN = exec(`echo $(which yarn)`);
const MKVITEJS = exec(`echo $(which mkvite)`);
const PM = PNPM ? "pnpm" : YARN ? "yarn" : "npm";

const JQ = exec(`echo $(which jq)`);
const NPM = Number(exec(`echo $(npm --version)`).split(".")[0]);

if (existsSync(NAME)) {
  console.log(
    `La carpeta ${color(
      "red",
      NAME
    )} ya existe... Bórrala si quieres crear un proyecto nuevo`
  );
  process.exit(-1);
}
if (!JQ) {
  console.log(
    `${color("red", "jq")} not detected. Install with ${color(
      "yellow",
      "sudo apt-get install jq"
    )}`
  );
  process.exit(-2);
}

if (NPM < 7) {
  console.log(
    `${color("red", "npm 7")} is required. Install with ${color(
      "yellow",
      "npm install -g npm"
    )}`
  );
  process.exit(-4);
}

if (PARAMS === 0 || NAME.includes("--help")) {
  console.log(
    `${color("green", "mkvite")} ${VERSION} - Por Samurai.dev.ord ( ${color(
      "magenta",
      "https://samurai.dev.ord/"
    )} )\n`
  );
  console.log(`Sintaxis:`);
  console.log(`mkvite <nombre-carpeta> [options]\tCrea un proyecto web.\n`);
  console.log(`Ejemplos:`);
  console.log(
    `mkvite sample-project -> ${color(
      "magenta",
      "Crea un proyecto HTML/CSS/Javascript nativo"
    )}.`
  );
  console.log(`Recuerda que necesitas tener instalado jq y npm7+.`);
  process.exit(0);
}

if (NAME === "--version") {
  console.log(VERSION);
  process.exit(0);
}

if (NAME && NAME.indexOf("--") === 0) {
  console.log(`Sintaxis:`);
  console.log(
    `mkvite <nombre-carpeta> [options] -> ${color(
      "magenta",
      "Crea un proyecto web.\n"
    )}`
  );
  console.log(
    `${color(
      "red",
      "Error"
    )}: Escribe primero el nombre de la carpeta y los parámetros al final.`
  );
  process.exit(0);
}
try {
  accessSync(".", constants.R_OK | constants.W_OK);
} catch {
  console.log(
    `No tienes ${color("red", "permisos")} para escribir en la carpeta actual.`
  );
  process.exit(-5);
}

console.log(
  `[${color("yellow", "1")}/3] Instalando ${color("green", "vite")}...`
);
exec(`npm create vite@latest ${NAME} -- --template react >/dev/null`);
console.log(
  `[${color("yellow", "2")}/3] Creando ${color(
    "cyan",
    "estructura de carpetas"
  )}...`
);
process.chdir(NAME);

exec("rm src/App.css public/vite.svg");

exec("mkdir -p public src/components src/pages");

exec(`cat >index.html << EOF
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${NAME} - Víctor  Manuel Ordiales García</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

EOF`);

exec(`cat >src/index.css << EOF

* {
  margin:0;
  padding:0;
  box-sizing: border-box;
}
body {
  background-color: #282828;
  color: #fff;
  font-family: 'Victor Mono';
  font-size: 16px;
}
EOF`);

exec(`cat >src/App.jsx << EOF
function App() {
  return (
    <>
     <h1 style={{"textAlign":"center"}}>${NAME} | Components App</h1>
    </>
  )
}

export default App
EOF`);

console.log(`\n¡${color("green", "Listo")}! Para empezar, escribe:
cd ${NAME}
${PM} install
${PM} run dev`);
