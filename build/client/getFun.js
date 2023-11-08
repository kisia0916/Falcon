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
exports.getFun = exports.getMainCommand = exports.targetList = void 0;
const createSendData_1 = require("./createSendData");
const checkCmd_1 = require("./checkCmd");
const getInput_1 = require("./getInput");
const fs = __importStar(require("fs"));
exports.targetList = [];
const getMainCommand = (ip) => __awaiter(void 0, void 0, void 0, function* () {
    const cmd = yield (0, getInput_1.getInput)(`$ ${ip}>`);
    (0, checkCmd_1.checkCmdMain)(ip, cmd);
});
exports.getMainCommand = getMainCommand;
let startDl = false;
let oneTimeData = [];
let dlFileNowSize = 0;
let dlFileMax = 0;
const getFun = (data, client) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!startDl) {
            const getData = JSON.parse(data);
            if (getData.type === "targetList") {
                exports.targetList = getData.data[0];
                console.log("----------------TargetList----------------");
                exports.targetList.forEach((i, index) => {
                    console.log(`${index} - ${i.globalIP}:${i.localIP}`);
                });
                console.log("------------------------------------------");
                //どれに接続するか選択させる
                let connectNum = yield (0, getInput_1.getInput)("select target:");
                if (!connectNum) {
                    let selectFlg = true;
                    while (selectFlg) {
                        connectNum = yield (0, getInput_1.getInput)("select target:");
                        if (connectNum) {
                            selectFlg = false;
                        }
                    }
                }
                try {
                    let connectId = exports.targetList[Number(connectNum)].id;
                    const sendData = JSON.stringify((0, createSendData_1.createSendData)("select-target", [connectId]));
                    client.write(sendData);
                }
                catch (_a) {
                    console.log("error");
                }
            }
            else if (getData.type === "connectedInfo") {
                console.log(`Successful connection to ${getData.data[0].globalIP}:${getData.data[0].localIP}`);
                (0, exports.getMainCommand)(`${getData.data[0].globalIP}:${getData.data[0].localIP}`);
            }
            else if (getData.type === "connect-error") {
                console.log("can not connect");
            }
            else if (getData.type === "cmdResoultClient") {
                console.log(getData.data[0]);
                (0, exports.getMainCommand)(checkCmd_1.userIP);
            }
            else if (getData.type === "doneUploadServer") {
                console.log("upload server done ☑");
                console.log("uploading target.....");
            }
            else if (getData.type === "doneTargetUpload") {
                console.log("upload target done ☑");
                (0, exports.getMainCommand)(checkCmd_1.userIP);
            }
            else if (getData.type === "startUploadClient") {
                startDl = true;
                dlFileMax = getData.data[0];
            }
            else if (getData.type === "errorUpload") {
                console.log("upload error ✖");
                (0, exports.getMainCommand)(checkCmd_1.userIP);
            }
            else if (getData.type === "dlError") {
                console.log("download error ✖");
                (0, checkCmd_1.deleteDlFileName)();
                dlFileNowSize = 0;
                dlFileMax = 0;
                startDl = false;
                (0, exports.getMainCommand)(checkCmd_1.userIP);
            }
        }
        else {
            oneTimeData.push(data);
            const can = Buffer.concat(oneTimeData);
            dlFileNowSize = Buffer.concat(oneTimeData).length;
            oneTimeData = [];
            yield fs.writeFileSync(`${checkCmd_1.dlFileName}`, can, { flag: 'a' });
            const fileSize = fs.statSync(checkCmd_1.dlFileName).size;
            if (fileSize >= dlFileMax) {
                console.log("download done ☑");
                dlFileNowSize = 0;
                dlFileMax = 0;
                startDl = false;
                (0, checkCmd_1.deleteDlFileName)();
                (0, exports.getMainCommand)(checkCmd_1.userIP);
            }
        }
    }
    catch (error) {
        console.log(error);
        (0, checkCmd_1.deleteDlFileName)();
        startDl = false;
        dlFileNowSize = 0;
        dlFileMax = 0;
        (0, exports.getMainCommand)(checkCmd_1.userIP);
    }
});
exports.getFun = getFun;
