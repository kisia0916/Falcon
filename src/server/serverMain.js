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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.__esModule = true;
var net = require("net");
var uuid = require("uuid");
var fs = require("fs");
var createSendData_1 = require("../functions/createSendData");
var server = net.createServer();
var PORT = 3000;
var targetList = [];
var publickTargetList = [];
var clientList = [];
server.on("connection", function (socket) {
    console.log("connected");
    var id = "";
    var nowFileName = "";
    var startUL = false;
    var firstUL = true;
    var nowFileSize = 0;
    var nowFileMaxSize = 0;
    socket.on("data", function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var getData_1, listData, sendData, listData, sendData, clientIndex, targetIndex, sendData, clientIndex, targetIP_1, targetIndex, sendData, sendData, clientIndex, appendData, fileList, appendData, fileList_1;
        return __generator(this, function (_a) {
            if (!startUL) {
                getData_1 = JSON.parse(data);
                if (getData_1.type === "first-target") {
                    console.log(getData_1.data);
                    if (!targetList.includes(getData_1.data[0])) {
                        listData = {
                            id: uuid.v4(),
                            localIP: getData_1.data[0].localIP,
                            globalIP: getData_1.data[0].globalIP,
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
                            globalIP: listData.globalIP
                        });
                        id = listData.id;
                        sendData = JSON.stringify((0, createSendData_1.createSendData)("sendIP", [id]));
                        socket.write(sendData);
                        console.log(publickTargetList);
                    }
                }
                else if (getData_1.type === "first-client") {
                    listData = {
                        id: uuid.v4(),
                        conTarget: "",
                        sendSys: socket
                    };
                    id = listData.id;
                    clientList.push(listData);
                    sendData = JSON.stringify((0, createSendData_1.createSendData)("targetList", [publickTargetList]));
                    socket.write(sendData);
                }
                else if (getData_1.type === "select-target") {
                    console.log(getData_1.data[0]);
                    clientIndex = clientList.findIndex(function (elem) { return elem.id === id; });
                    clientList[clientIndex].conTarget = getData_1.data[0];
                    targetIndex = publickTargetList.findIndex(function (elem) { return elem.id === getData_1.data[0]; });
                    sendData = JSON.stringify((0, createSendData_1.createSendData)("connectedInfo", [publickTargetList[targetIndex]]));
                    socket.write(sendData);
                    console.log(clientList);
                }
                else if (getData_1.type === "sendCmdText") {
                    clientIndex = clientList.findIndex(function (elem) { return elem.id === id; });
                    targetIP_1 = clientList[clientIndex].conTarget;
                    targetIndex = publickTargetList.findIndex(function (elem) { return elem.id === targetIP_1; });
                    sendData = JSON.stringify((0, createSendData_1.createSendData)("sendCmd", [getData_1.data[0], id]));
                    targetList[targetIndex].sendSys.write(sendData);
                }
                else if (getData_1.type === "cmdResoult") {
                    sendData = JSON.stringify((0, createSendData_1.createSendData)("cmdResoultClient", [getData_1.data[1]]));
                    clientIndex = clientList.findIndex(function (elem) { return elem.id === getData_1.data[0]; });
                    clientList[clientIndex].sendSys.write(sendData);
                }
                else if (getData_1.type === "sendFileName") {
                    nowFileName = getData_1.data[0];
                    nowFileMaxSize = getData_1.data[1];
                    startUL = true;
                    firstUL = true;
                }
                else if (getData_1.type === "sendFileBuffer") {
                    console.log("1");
                    appendData = getData_1.data;
                    console.log(appendData);
                    fileList = nowFileName.split(".");
                    if (!startUL) {
                        // fs.writeFile(`./uploadFile/upload.${fileList[fileList.length-1]}`,appendData,'binary',(err)=>{
                        //     startUL = true
                        // })
                    }
                    else {
                        // fs.appendFile(nowFileName,appendData.data,(error)=>{
                        //     if(error){
                        //         console.log(error)
                        //     }
                        //     const appendDataSize = fs.statSync(`./uploadFile/upload.${fileList[fileList.length-1]}`)
                        //     console.log(appendDataSize)
                        // })
                    }
                }
            }
            else {
                appendData = data;
                console.log(appendData);
                fileList_1 = nowFileName.split(".");
                if (firstUL) {
                    fs.writeFile("./uploadFile/upload.".concat(fileList_1[fileList_1.length - 1]), appendData, 'binary', function (err) {
                        startUL = false;
                        var appendDataSize = fs.statSync("./uploadFile/upload.".concat(fileList_1[fileList_1.length - 1])).size;
                        if (nowFileMaxSize <= appendDataSize) {
                            console.log("done");
                            startUL = false;
                            firstUL = true;
                        }
                    });
                }
                else {
                    fs.appendFile(nowFileName, appendData, function (error) {
                        if (error) {
                            console.log(error);
                        }
                        var appendDataSize = fs.statSync("./uploadFile/upload.".concat(fileList_1[fileList_1.length - 1])).size;
                        if (appendDataSize >= nowFileMaxSize) {
                            console.log("done2");
                            startUL = false;
                            firstUL = true;
                        }
                    });
                }
            }
            return [2 /*return*/];
        });
    }); });
    socket.on("close", function () {
        var deleteIndexTarget = publickTargetList.findIndex(function (elem) { return elem.id === id; });
        var deleteIndexClient = clientList.findIndex(function (elem) { return elem.id === id; });
        if (deleteIndexTarget != -1) {
            targetList.splice(deleteIndexTarget, 1);
            publickTargetList.splice(deleteIndexTarget, 1);
        }
        if (deleteIndexClient != -1) {
            clientList.splice(deleteIndexClient, 1);
            console.log(clientList);
        }
    });
    socket.on("error", function (error) {
    });
});
server.listen(PORT, function () {
    console.log("server run");
});
