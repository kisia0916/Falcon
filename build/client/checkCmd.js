"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDlFileName = exports.checkCmdMain = exports.dlFileName = exports.userIP = void 0;
const createSendData_1 = require("./createSendData");
const clientMain_1 = require("./clientMain");
const download_1 = require("./download");
const getFun_1 = require("./getFun");
const uploadFile_1 = require("./uploadFile");
exports.userIP = "";
exports.dlFileName = "";
const checkCmdMain = (userIp, cmd) => {
    const getCmd = cmd.split(" ");
    exports.userIP = userIp;
    if (getCmd[0] == "cd") {
        if (getCmd.length > 1) {
            const sendData = JSON.stringify((0, createSendData_1.createSendData)("sendCmdText", [cmd]));
            clientMain_1.client.write(sendData);
        }
        else {
            console.log("Not enough factor");
        }
    }
    else if (getCmd[0] == "dir" || getCmd[0] == "ls") {
        cmd = "dir";
        const sendData = JSON.stringify((0, createSendData_1.createSendData)("sendCmdText", [cmd]));
        clientMain_1.client.write(sendData);
    }
    else if (getCmd[0] == "del") {
        const sendData = JSON.stringify((0, createSendData_1.createSendData)("sendCmdText", [cmd]));
        clientMain_1.client.write(sendData);
    }
    else if (getCmd[0] == "ul") {
        if (getCmd.length > 2) {
            (0, uploadFile_1.uploadFile)(getCmd[1], getCmd[2]);
        }
        else {
            console.log("ul path1 path2");
            (0, getFun_1.getMainCommand)(exports.userIP);
        }
    }
    else if (getCmd[0] == "dl") {
        if (getCmd.length > 2) {
            exports.dlFileName = getCmd[2];
            console.log("downloading.....");
            (0, download_1.downloadFile)(getCmd[1]);
        }
        else {
            console.log("dl path1 path2");
            (0, getFun_1.getMainCommand)(exports.userIP);
        }
    }
    else if (getCmd[0] == "mkdir") {
        const sendData = JSON.stringify((0, createSendData_1.createSendData)("sendCmdText", [cmd]));
        clientMain_1.client.write(sendData);
    }
    else {
        console.log("No Command");
        (0, getFun_1.getMainCommand)(exports.userIP);
    }
};
exports.checkCmdMain = checkCmdMain;
const deleteDlFileName = () => {
    exports.dlFileName = "";
};
exports.deleteDlFileName = deleteDlFileName;
