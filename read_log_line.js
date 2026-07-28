const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\itpua\\.gemini\\antigravity\\brain\\3303fe22-b248-4232-9514-fa38470cc90d\\.system_generated\\logs\\transcript_full.jsonl';

async function readLine661() {
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineNum = 0;
  for await (const line of rl) {
    lineNum++;
    if (lineNum === 661) {
      console.log(line);
      break;
    }
  }
}

readLine661();
