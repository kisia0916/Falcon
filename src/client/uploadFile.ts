import * as fs from "fs"
import { client } from "./clientMain"
import { createSendData } from "../functions/createSendData"
export const uploadFile = (path:string,ulFilePath:string)=>{
    const fileNameList:string[] = path.split("/")
    const fileName:string = fileNameList[fileNameList.length-1]
    const filesize = fs.statSync(path).size
    const sendFileName = JSON.stringify(createSendData("sendFileName",[fileName,filesize,path,ulFilePath]))
    client.write(sendFileName)  
    console.log("uploading server.....")
    fs.readFile(path,(err,data)=>{
        // const sendDataFile = JSON.stringify(createSendData("sendFileBuffer",[binary]))
        const sendDataFile = data
        client.write(sendDataFile)         
    })
}