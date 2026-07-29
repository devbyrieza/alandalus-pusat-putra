const fs = require('fs');
const path = 'C:/Users/itpua/Dev/Work/al-andalus/andalus-pusat-putra/middleware.ts';
let code = fs.readFileSync(path, 'utf8');

const regex = /export async function middleware\([^\{]+\{([\s\S]*?)\nexport const config =/;

code = code.replace(regex, (match, body) => {
  return `export async function middleware(request: NextRequest) {
  try {
${body}
  } catch (error) {
    console.error("MIDDLEWARE EXCEPTION:", error);
    return NextResponse.next();
  }
}

export const config =`;
});

fs.writeFileSync(path, code);
console.log("Middleware successfully wrapped with try-catch!");
