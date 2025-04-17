const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const settings = {
  compact: true,
  controlFlowFlattening: false,
  deadCodeInjection: false,
  debugProtection: false,
  debugProtectionInterval: 0,
  disableConsoleOutput: true,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: false,
  renameGlobals: false,
  selfDefending: true,
  simplify: true,
  splitStrings: false,
  stringArray: true,
  stringArrayCallsTransform: false,
  stringArrayEncoding: [],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 1,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 2,
  stringArrayWrappersType: 'variable',
  stringArrayThreshold: 0.75,
  unicodeEscapeSequence: false
};

function obfuscateDir(dirPath) {
  let dirents = fs.readdirSync(dirPath, {
    encoding: 'utf8',
    withFileTypes: true
  });
  for (let i = 0; i < dirents.length; i++) {
    let dirent = dirents[i];
    if (dirent.isDirectory()) {
      obfuscateDir(path.join(dirPath, dirent.name));
      continue;
    }
    if (path.extname(dirent.name) !== '.js') continue;
    const filePath = path.join(dirPath, dirent.name);
    const content = fs.readFileSync(filePath, { encoding: 'utf8' });
    const obfuscator = JavaScriptObfuscator.obfuscate(content, settings);
    const obfuscatedCode = obfuscator.getObfuscatedCode();

    fs.writeFileSync(filePath, obfuscatedCode, {
      encoding: 'utf8',
      flag: 'w+'
    });
  }
}

// eslint-disable-next-line no-undef
obfuscateDir(path.join(__dirname, 'build'));
console.log('Obfuscation Done!');
