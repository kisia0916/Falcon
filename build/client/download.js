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
exports.downloadFile = void 0;
const createSendData_1 = require("./createSendData");
const fs = __importStar(require("fs"));
const checkCmd_1 = require("./checkCmd");
const clientMain_1 = require("./clientMain");
const getFun_1 = require("./getFun");
const downloadFile = (path) => {
    let pathList = checkCmd_1.dlFileName.split("/");
    let errorFlg = false;
    pathList.forEach((i) => {
        if (i === '') {
            errorFlg = true;
        }
    });
    if (fs.existsSync(checkCmd_1.dlFileName)) {
        errorFlg = true;
    }
    if (errorFlg) {
        console.log("error");
        (0, checkCmd_1.deleteDlFileName)();
        (0, getFun_1.getMainCommand)(checkCmd_1.userIP);
    }
    else {
        const sendData = JSON.stringify((0, createSendData_1.createSendData)("startDownload", [path]));
        clientMain_1.client.write(sendData);
    }
};
exports.downloadFile = downloadFile;
