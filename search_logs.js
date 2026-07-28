const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logPath = 'C:\\Users\\itpua\\.gemini\\antigravity\\brain\\3303fe22-b248-4232-9514-fa38470cc90d\\.system_generated\\logs\\transcript.jsonl';

async function search() {
  if (!fs.existsSync(logPath)) {
    console.error("Log file not found!");
    return;
  }
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineNum = 0;
  for await (const line of rl) {
    lineNum++;
    if (line.toLowerCase().includes('retna')) {
      console.log(`Line ${lineNum}:`);
      // Parse JSON and show content/tool calls
      try {
        const obj = JSON.parse(line);
        console.log("Type:", obj.type, "Source:", obj.source);
        if (obj.content) {
          console.log("Content snippet:", obj.content.substring(0, 500));
        }
      } catch (e) {
        console.log("Raw line snippet:", line.substring(0, 500));
      }
      console.log("-".repeat(40));
    }
  }
}

search();
