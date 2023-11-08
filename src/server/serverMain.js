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
const net = __importStar(require("net"));
const uuid = __importStar(require("uuid"));
const fs = __importStar(require("fs"));
const createSendData_1 = require("../functions/createSendData");
const server = net.createServer();
const PORT = 3000;
let targetList = [];
let publickTargetList = [];
let clientList = [];
server.on("connection", (socket) => {
    console.log("connected");
    let id = "";
    let nowFileName = "";
    let nowFilePath = "";
    let startUL = false;
    let firstUL = true;
    let startDl = undefined;
    let nowFileSize = 0;
    let nowFileMaxSize = 0;
    let deleteFileName = "";
    let test = [];
    let oneTimeData = [];
    const oneDataSize = 3000;
    let targetID = "";
    socket.on("data", (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!startUL && !startDl) {
                const getData = JSON.parse(data);
                if (getData.type === "first-target") {
                    console.log(getData.data);
                    if (!targetList.includes(getData.data[0])) {
                        const listData = {
                            id: uuid.v4(),
                            localIP: getData.data[0].localIP,
                            globalIP: getData.data[0].globalIP,
                            sendSys: socket
                        };
                        targetList.push({
                            id: listData.id,
                            localIP: listData.localIP,
                            globalIP: listData.globalIP,
                            sendSys: listData.sendSys
                        });
                        publickTargetList.push({
                            id: listData.id,
                            localIP: listData.localIP,
                            globalIP: listData.globalIP,
                        });
                        id = listData.id;
                        const sendData = JSON.stringify((0, createSendData_1.createSendData)("sendIP", [id]));
                        socket.write(sendData);
                        console.log(publickTargetList);
                    }
                }
                else if (getData.type === "first-client") {
                    const listData = {
                        id: uuid.v4(),
                        conTarget: "",
                        sendSys: socket
                    };
                    id = listData.id;
                    clientList.push(listData);
                    const sendData = JSON.stringify((0, createSendData_1.createSendData)("targetList", [publickTargetList]));
                    socket.write(sendData);
                }
                else if (getData.type === "select-target") {
                    if (clientList.findIndex(elem => elem.conTarget === getData.data[0]) === -1) {
                        console.log(getData.data[0]);
                        const clientIndex = clientList.findIndex(elem => elem.id === id);
                        clientList[clientIndex].conTarget = getData.data[0];
                        const targetIndex = publickTargetList.findIndex(elem => elem.id === getData.data[0]);
                        const sendData = JSON.stringify((0, createSendData_1.createSendData)("connectedInfo", [publickTargetList[targetIndex]]));
                        socket.write(sendData);
                        console.log(clientList);
                    }
                    else {
                        const sendData = JSON.stringify((0, createSendData_1.createSendData)("connect-error", []));
                        socket.write(sendData);
                    }
                }
                else if (getData.type === "sendCmdText") {
                    const clientIndex = clientList.findIndex(elem => elem.id === id);
                    const targetIP = clientList[clientIndex].conTarget;
                    const targetIndex = publickTargetList.findIndex(elem => elem.id === targetIP);
                    const sendData = JSON.stringify((0, createSendData_1.createSendData)("sendCmd", [getData.data[0], id]));
                    targetList[targetIndex].sendSys.write(sendData);
                }
                else if (getData.type === "cmdResoult") {
                    const sendData = JSON.stringify((0, createSendData_1.createSendData)("cmdResoultClient", [getData.data[1]]));
                    const clientIndex = clientList.findIndex(elem => elem.id === getData.data[0]);
                    clientList[clientIndex].sendSys.write(sendData);
                }
                else if (getData.type === "sendFileName") {
                    console.log("sendFilename");
                    nowFileName = getData.data[0];
                    nowFileMaxSize = getData.data[1];
                    nowFilePath = getData.data[3];
                    startUL = true;
                    firstUL = true;
                    console.log(getData.data);
                    const clientIndex = clientList.findIndex(elem => elem.id === id);
                    const targetIndex = targetList.findIndex(elem => elem.id == clientList[clientIndex].conTarget);
                    targetID = targetList[targetIndex].id;
                    deleteUpload();
                }
                else if (getData.type === "doneUploadTarget") {
                    console.log(id);
                    console.log(getData.data[0]);
                    const clientIndex = clientList.findIndex(elem => elem.id === getData.data[0]);
                    const sendData = JSON.stringify((0, createSendData_1.createSendData)("doneTargetUpload", []));
                    clientList[clientIndex].sendSys.write(sendData);
                    deleteUpload();
                }
                else if (getData.type === "startDownload") {
                    console.log(startDl);
                    const clientIndex = clientList.findIndex(elem => elem.id === id);
                    const targetID = clientList[clientIndex].conTarget;
                    const targetIndex = targetList.findIndex(elem => elem.id === targetID);
                    const sendData = JSON.stringify((0, createSendData_1.createSendData)("startDownload", [getData.data[0]]));
                    targetList[targetIndex].sendSys.write(sendData);
                }
                else if (getData.type === "dlStartFlg") {
                    startDl = true;
                    deleteUpload();
                    nowFilePath = getData.data[0];
                    nowFileMaxSize = getData.data[1];
                }
                else if (getData.type === "isUploadFile") {
                    const targetIndex = targetList.findIndex(elem => elem.id === id);
                    nowFileName = getData.data[0];
                    console.log(nowFileName);
                    const fileType = nowFileName.split(".")[1];
                    console.log(nowFileName);
                    uploadFile(targetList[targetIndex].sendSys, `./uploadFile/upload.${fileType}`);
                    const doneData = JSON.stringify((0, createSendData_1.createSendData)("doneUploadServer", []));
                    nowFilePath = "";
                    nowFileName = "";
                    const clientIndex = clientList.findIndex(elem => elem.conTarget === id);
                    clientList[clientIndex].sendSys.write(doneData);
                    nowFileSize = 0;
                    nowFileMaxSize = 0;
                }
                else if (getData.type === "errorUpload") {
                    const clientIndex = clientList.findIndex(elem => elem.conTarget === id);
                    const sendData = JSON.stringify((0, createSendData_1.createSendData)("errorUpload", []));
                    clientList[clientIndex].sendSys.write(sendData);
                }
                else if (getData.type === "serverUploadError") {
                    const clientIndex = clientList.findIndex(elem => elem.conTarget === id);
                    const sendData = JSON.stringify((0, createSendData_1.createSendData)("dlError", []));
                    clientList[clientIndex].sendSys.write(sendData);
                }
            }
            else if (startUL) {
                const targetIndex = targetList.findIndex(elem => elem.id === targetID);
                const fileType = nowFileName.split(".")[1];
                console.log("start");
                console.log(firstUL);
                const dataBinary = Buffer.from(data, "binary");
                oneTimeData.push(data);
                const can = Buffer.concat(oneTimeData);
                nowFileSize = Buffer.concat(oneTimeData).length;
                oneTimeData = [];
                yield fs.writeFileSync(`./uploadFile/upload.${fileType}`, can, { flag: 'a' });
                deleteFileName = `./uploadFile/upload.${fileType}`;
                console.log(deleteFileName);
                console.log("done");
                const fileSize = fs.statSync(`./uploadFile/upload.${fileType}`).size;
                if (fileSize >= nowFileMaxSize) {
                    console.log("ooooooooooooooooooooooooooooo");
                    const sendData = JSON.stringify((0, createSendData_1.createSendData)("startUpload", [nowFileName, nowFileMaxSize, nowFilePath, id]));
                    targetList[targetIndex].sendSys.write(sendData);
                    startUL = false;
                    firstUL = true;
                    // uploadFile(targetList[targetIndex].sendSys,`./uploadFile/upload.${fileType}`)
                    // const doneData = JSON.stringify(createSendData("doneUploadServer",[]))
                    // socket.write(doneData)
                }
            }
            else if (startDl) {
                console.log(data);
                const fileType = nowFilePath.split(".")[1];
                oneTimeData.push(data);
                const can = Buffer.concat(oneTimeData);
                nowFileSize = Buffer.concat(oneTimeData).length;
                oneTimeData = [];
                yield fs.writeFileSync(`./uploadFile/upload.${fileType}`, can, { flag: 'a' });
                console.log("done");
                const fileSize = fs.statSync(`./uploadFile/upload.${fileType}`).size;
                if (fileSize >= nowFileMaxSize) {
                    console.log("upload done");
                    startDl = false;
                    const clientIndex = clientList.findIndex(elem => elem.conTarget === id);
                    console.log(clientIndex);
                    const sendData = JSON.stringify((0, createSendData_1.createSendData)("startUploadClient", [nowFileMaxSize]));
                    clientList[clientIndex].sendSys.write(sendData);
                    uploadFile(clientList[clientIndex].sendSys, nowFilePath);
                    nowFilePath = "";
                    nowFileName = "";
                    nowFileSize = 0;
                    nowFileMaxSize = 0;
                    deleteUpload();
                }
            }
        }
        catch (error) {
            console.log(error);
            startDl = false;
            nowFilePath = "";
            nowFileName = "";
            nowFileSize = 0;
            nowFileMaxSize = 0;
        }
    }));
    socket.on("close", () => {
        const deleteIndexTarget = publickTargetList.findIndex(elem => elem.id === id);
        const deleteIndexClient = clientList.findIndex(elem => elem.id === id);
        if (deleteIndexTarget != -1) {
            targetList.splice(deleteIndexTarget, 1);
            publickTargetList.splice(deleteIndexTarget, 1);
        }
        if (deleteIndexClient != -1) {
            clientList.splice(deleteIndexClient, 1);
            console.log(clientList);
        }
    });
    socket.on("error", (error) => {
    });
});
const uploadFile = (socket, path) => {
    console.log(path);
    fs.readFile(path, (error, data) => {
        socket.write(data);
    });
};
const deleteUpload = () => {
    fs.readdir("./uploadFile", (error, data) => {
        data.forEach((i) => {
            console.log(i);
            fs.unlink(`./uploadFile/${i}`, (error) => { });
        });
    });
};
server.listen(PORT, () => {
    console.log("server run");
});
