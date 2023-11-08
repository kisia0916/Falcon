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
exports.rlList = exports.client = void 0;
const net = __importStar(require("net"));
const getInput_1 = require("./getInput");
const createSendData_1 = require("./createSendData");
const getFun_1 = require("./getFun");
const fs = __importStar(require("fs"));
// const host:string = "0.tcp.jp.ngrok.io"
// const port:number = 11608
let host = "localhost";
let port = 3000;
const hostData = fs.readFileSync("./host.txt").toString();
host = hostData.split(":")[0];
port = Number(hostData.split(":")[1]);
console.log(host, port);
exports.client = undefined;
exports.rlList = [];
const firstInit = () => {
    exports.client = new net.Socket();
    exports.client.connect(port, host, () => {
        console.log(`connected ${host}:${port}`);
        const sendData = JSON.stringify((0, createSendData_1.createSendData)("first-client", []));
        exports.client.write(sendData);
    });
    exports.client.on("error", (error) => __awaiter(void 0, void 0, void 0, function* () {
        exports.client.end();
        console.log("can not connection");
        yield reconectTry();
    }));
    exports.client.on("data", (data) => {
        (0, getFun_1.getFun)(data, exports.client);
    });
};
const reconectTry = () => __awaiter(void 0, void 0, void 0, function* () {
    exports.client.end();
    exports.client = undefined;
    const data = yield (0, getInput_1.getInput)("reconect?(y/n):");
    if (data === "y") {
        try {
            exports.client = new net.Socket();
            exports.client.connect(port, host, () => {
                console.log(`connected ${host}:${port}`);
                const sendData = JSON.stringify((0, createSendData_1.createSendData)("first-client", []));
                exports.client.write(sendData);
            });
            exports.client.on("error", (error) => {
                exports.client.end();
                reconectTry();
            });
            exports.client.on("data", (data) => {
                (0, getFun_1.getFun)(data, exports.client);
            });
        }
        catch (error) {
            console.log("error");
        }
    }
    else {
        process.exit();
    }
});
firstInit();
