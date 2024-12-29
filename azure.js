"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var moment = require("moment");
var cognitiveservices_computervision_1 = require("@azure/cognitiveservices-computervision");
var ms_rest_js_1 = require("@azure/ms-rest-js");
var dotenv = require("dotenv");
dotenv.config();
// Azureリソースから取得したAPIキーとエンドポイントを設定
var key = process.env.AZURE_VISION_API_KEY;
var endpoint = process.env.AZURE_VISION_ENDPOINT;
if (!key || !endpoint) {
    throw new Error("APIキーまたはエンドポイントが設定されていません。");
}
// ComputerVisionクライアントの作成
var credentials = new ms_rest_js_1.ApiKeyCredentials({
    inHeader: { "Ocp-Apim-Subscription-Key": key },
});
var client = new cognitiveservices_computervision_1.ComputerVisionClient(credentials, endpoint);
function outputTextToFile(text) {
    return __awaiter(this, void 0, void 0, function () {
        var now, outputFileName, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    now = moment().format("YYYY-MM-DD HH-mm-ss");
                    outputFileName = now + ".txt";
                    return [4 /*yield*/, fs.promises.writeFile(outputFileName, text)];
                case 1:
                    _a.sent();
                    console.log(outputFileName);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("テキストファイルに出力中にエラーが発生しました。", error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function performOCR(imageBuffer) {
    return __awaiter(this, void 0, void 0, function () {
        var result, operationId, ocrResult, textLines, error_2;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 10, , 11]);
                    console.log("Processing OCR...");
                    return [4 /*yield*/, client.readInStream(imageBuffer)];
                case 1:
                    result = _d.sent();
                    operationId = (_a = result.operationLocation) === null || _a === void 0 ? void 0 : _a.split("/").pop();
                    if (!operationId) {
                        throw new Error("Failed to retrieve operation ID");
                    }
                    ocrResult = void 0;
                    _d.label = 2;
                case 2:
                    console.log("Waiting for OCR to complete...");
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, client.getReadResult(operationId)];
                case 4:
                    ocrResult = _d.sent();
                    _d.label = 5;
                case 5:
                    if (ocrResult.status === "notStarted" ||
                        ocrResult.status === "running") return [3 /*break*/, 2];
                    _d.label = 6;
                case 6:
                    if (!(ocrResult.status === "succeeded")) return [3 /*break*/, 8];
                    textLines = (_c = (_b = ocrResult.analyzeResult) === null || _b === void 0 ? void 0 : _b.readResults) === null || _c === void 0 ? void 0 : _c.flatMap(function (page) { var _a; return (_a = page.lines) === null || _a === void 0 ? void 0 : _a.map(function (line) { return line.text; }); });
                    return [4 /*yield*/, outputTextToFile(textLines === null || textLines === void 0 ? void 0 : textLines.join("\n"))];
                case 7:
                    _d.sent();
                    return [3 /*break*/, 9];
                case 8:
                    console.error("OCR failed.");
                    _d.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    error_2 = _d.sent();
                    console.error("Error during OCR:", error_2);
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    });
}
// 画像ファイルを読み込む
var imagePath = path.resolve(__dirname, "test.png");
var imageBuffer = fs.readFileSync(imagePath);
performOCR(imageBuffer).catch(function (error) {
    console.error("Error executing performOCR:", error);
});
