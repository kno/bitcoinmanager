import { createCipheriv, createDecipheriv } from "crypto";

export const crypt = (text, password) => {
  const key = password.repeat(32).substr(0, 32);
  const iv = password.repeat(16).substr(0, 16);
  const cipher = createCipheriv("aes-256-ctr", key, iv);
  let encrypted = cipher.update(text.toString(), "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

const decrypt = (text, password) => {
  const key = password.repeat(32).substr(0, 32);
  const iv = password.repeat(16).substr(0, 16);
  const decipher = createDecipheriv("aes-256-ctr", key, iv);
  let decrypted = decipher.update(text.toString(), "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

export const cryptTrade = (trade, password) => {
  return {
    ...trade,
    date: crypt(trade.date, password),
    amount: crypt(trade.amount, password),
    rate: crypt(trade.rate, password),
    btc: crypt(trade.btc, password),
  };
};

export const decryptTrade = (trade, password) => {
  return {
    ...trade,
    date: decrypt(trade.date, password),
    amount: parseFloat(decrypt(trade.amount, password)),
    rate: parseFloat(decrypt(trade.rate, password)),
    btc: parseFloat(decrypt(trade.btc, password)),
  };
};
