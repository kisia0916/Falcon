"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const fs = __importStar(require("fs"));
const clientMain_1 = require("./clientMain");
const createSendData_1 = require("./createSendData");
const checkCmd_1 = require("./checkCmd");
const getFun_1 = require("./getFun");
const uploadFile = (path, ulFilePath) => {
    try {
        const fileNameList = path.split("/");
        const fileName = fileNameList[fileNameList.length - 1];
        const filesize = fs.statSync(path).size;
        const sendFileName = JSON.stringify((0, createSendData_1.createSendData)("sendFileName", [fileName, filesize, path, ulFilePath]));
        clientMain_1.client.write(sendFileName);
        console.log("uploading server.....");
        fs.readFile(path, (err, data) => {
            // const sendDataFile = JSON.stringify(createSendData("sendFileBuffer",[binary]))
            const sendDataFile = data;
            clientMain_1.client.write(sendDataFile);
        });
    }
    catch (error) {
        console.log("error");
        (0, getFun_1.getMainCommand)(checkCmd_1.userIP);
    }
};
exports.uploadFile = uploadFile;
