import { ImageAnnotatorClient } from "@google-cloud/vision";
import fs from "fs";
import moment from "moment";

const client = new ImageAnnotatorClient();
const inputFileName = "./test.png";

// 画像内の文字を解析
async function detectText() {
  try {
    const [result] = await client.textDetection(inputFileName);
    const detections = result.textAnnotations;
    return detections[0].description;
  } catch (error) {
    console.error("画像解析でエラーが発生しました。", error);
  }
}

// テキストファイルに出力
async function outputTextToFile(text) {
  try {
    const now = moment().format("YYYY-MM-DD HH-mm-ss");
    const outputFileName = now + ".txt";
    await fs.promises.writeFile(outputFileName, text);
  } catch (error) {
    console.error("テキストファイルに出力中にエラーが発生しました。", error);
  }
}

async function main() {
  try {
    const text = await detectText();
    await outputTextToFile(text);
    // await console.log(text);
  } catch (error) {
    console.error(error);
  }
}

main();
