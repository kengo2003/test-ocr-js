import * as fs from "fs";
import * as path from "path";
import * as moment from "moment";
import { ComputerVisionClient } from "@azure/cognitiveservices-computervision";
import { ApiKeyCredentials } from "@azure/ms-rest-js";
import * as dotenv from "dotenv";

dotenv.config();

// Azureリソースから取得したAPIキーとエンドポイントを設定
const key = process.env.AZURE_VISION_API_KEY;
const endpoint = process.env.AZURE_VISION_ENDPOINT;

if (!key || !endpoint) {
  throw new Error("APIキーまたはエンドポイントが設定されていません。");
}

// ComputerVisionクライアントの作成
const credentials = new ApiKeyCredentials({
  inHeader: { "Ocp-Apim-Subscription-Key": key },
});
const client = new ComputerVisionClient(credentials, endpoint);

async function outputTextToFile(text) {
  try {
    const now = moment().format("YYYY-MM-DD HH-mm-ss");
    const outputFileName = now + ".txt";
    await fs.promises.writeFile(outputFileName, text);
    console.log(outputFileName);
  } catch (error) {
    console.error("テキストファイルに出力中にエラーが発生しました。", error);
  }
}

async function performOCR(imageBuffer: Buffer) {
  try {
    console.log("Processing OCR...");

    // OCRを実行
    const result = await client.readInStream(imageBuffer);
    const operationId = result.operationLocation?.split("/").pop();

    if (!operationId) {
      throw new Error("Failed to retrieve operation ID");
    }

    // 結果を取得
    let ocrResult;
    do {
      console.log("Waiting for OCR to complete...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      ocrResult = await client.getReadResult(operationId);
    } while (
      ocrResult.status === "notStarted" ||
      ocrResult.status === "running"
    );

    // 結果を表示
    if (ocrResult.status === "succeeded") {
      const textLines = ocrResult.analyzeResult?.readResults?.flatMap((page) =>
        page.lines?.map((line) => line.text)
      );
      await outputTextToFile(textLines?.join("\n"));
    } else {
      console.error("OCR failed.");
    }
  } catch (error) {
    console.error("Error during OCR:", error);
  }
}

// 画像ファイルを読み込む
const imagePath = path.resolve(__dirname, "test.png");
const imageBuffer = fs.readFileSync(imagePath);
performOCR(imageBuffer).catch((error) => {
  console.error("Error executing performOCR:", error);
});
