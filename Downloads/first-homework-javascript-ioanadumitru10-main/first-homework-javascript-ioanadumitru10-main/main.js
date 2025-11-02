class InvalidType extends Error {
  constructor(message = "InvalidType") {
    super(message);
    this.name = "InvalidType";
  }
}

class InvalidInput extends Error {
  constructor(message = "InvalidInput") {
    super(message);
    this.name = "InvalidInput";
  }
}


function rleCompress(input) {
  if (!(typeof input === "string" || input instanceof String)) throw new InvalidType();
  if (/[0-9]/.test(input)) throw new InvalidInput();

  let result = "";
  let count = 1;
  for (let i = 1; i <= input.length; i++) {
    if (input[i] === input[i - 1]) {
      count++;
    } else {
      result += count + input[i - 1];
      count = 1;
    }
  }
  return result;
}


function rleDecompress(input) {
  if (!(typeof input === "string" || input instanceof String)) throw new InvalidType();
  if (input === "") return "";

  const regex = /^(\d+[A-Za-z])+$/
  if (!regex.test(input)) throw new InvalidInput();

  let result = "";
  const groupRegex = /(\d+)([A-Za-z])/g;
  let match;
  while ((match = groupRegex.exec(input)) !== null) {
    const [_, num, char] = match;
    result += char.repeat(parseInt(num));
  }
  return result;
}


function caesarEncrypt(input, options) {
  if (!(typeof input === "string" || input instanceof String)) throw new InvalidType();
  if (!/^[A-Za-z\s]*$/.test(input)) throw new InvalidInput();
  if (!options || typeof options.shift !== "number") throw new InvalidInput();

  const shift = options.shift % 26;
  const A = "A".charCodeAt(0);
  const a = "a".charCodeAt(0);

  return input.split("").map(ch => {
    if (ch === " ") return " ";
    if (ch >= "A" && ch <= "Z") return String.fromCharCode(A + (ch.charCodeAt(0) - A + shift + 26) % 26);
    if (ch >= "a" && ch <= "z") return String.fromCharCode(a + (ch.charCodeAt(0) - a + shift + 26) % 26);
    return ch;
  }).join("");
}


function caesarDecrypt(input, options) {
  if (!(typeof input === "string" || input instanceof String)) throw new InvalidType();
  if (!/^[A-Za-z\s]*$/.test(input)) throw new InvalidInput();
  if (!options || typeof options.shift !== "number") throw new InvalidInput();

  const shift = (-options.shift) % 26;
  return caesarEncrypt(input, { shift });
}

ă
const textProcessor = (algo, operation, input, options) => {
  if (typeof operation !== "boolean") throw new InvalidType();
  if (!(typeof input === "string" || input instanceof String)) throw new InvalidType();

  const normalizedAlgo = algo.toLowerCase();

  if (normalizedAlgo === "rle") {
    return operation ? rleCompress(input) : rleDecompress(input);
  } else if (normalizedAlgo === "caesar") {
    return operation ? caesarEncrypt(input, options) : caesarDecrypt(input, options);
  } else {
    throw new InvalidInput();
  }
};

module.exports = {
  textProcessor,
  InvalidType,
  InvalidInput
};