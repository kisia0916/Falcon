import * as fs from "fs"
import { client } from "./clientMain"
import { createSendData } from "../functions/createSendData"
export const uploadFile = (path:string)=>{
    const fileNameList:string[] = path.split("/")
    const fileName:string = fileNameList[fileNameList.length-1]
    const filesize = fs.statSync(path).size
    console.log(filesize)
    const sendFileName = JSON.stringify(createSendData("sendFileName",[fileName,filesize]))
    client.write(sendFileName)  
    fs.readFile(path,(err,data)=>{
        // const sendDataFile = JSON.stringify(createSendData("sendFileBuffer",[binary]))
        console.log(data)
        const sendDataFile = data
        client.write(sendDataFile) 
    })
}