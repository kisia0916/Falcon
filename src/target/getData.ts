import { id } from "./targetMain"
import {exec} from "child_process"

let runCmdList:string[] = []
export const getSendData = (data:string)=>{
    const getData = JSON.parse(data)
    if(getData.type === "sendCmd"){
        console.log(getData.data[0])
        const cmdList:string[] = getData.data[0].split(" ")
        let runCmd:string = ""
        runCmdList.forEach((i,index)=>{//ここおかしい
            // if(index != 0){
            //     runCmd+=` & ${i}`
            // }else if(index == runCmdList.length-1){
            //     runCmd+=` & ${i} & `
            // }else{
            //     runCmd+=`${i}`
            // }
            // if(index != runCmdList.length-1){
                
            // }
            runCmd+=`${i} & `
        })
        runCmd+=`${getData.data[0]}`
        console.log(runCmd)
        exec(runCmd,{encoding:'utf-8'},(error: any, stdout: any, stderr: any)=>{
            if(!error && !stderr){
                console.log(stdout)
                if(cmdList[0] == "cd"){
                    runCmdList.push(getData.data[0])
                    console.log(runCmdList)
                }
            }else{
                console.log("kkk")
            }
        })

    }
}
