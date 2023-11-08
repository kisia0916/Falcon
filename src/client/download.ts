import { createSendData } from "./createSendData"
import * as fs from "fs"
import { deleteDlFileName, dlFileName, userIP } from "./checkCmd"
import { client } from "./clientMain"
import { getMainCommand } from "./getFun"

export const downloadFile = (path:string)=>{
    let pathList:string[] = dlFileName.split("/")
    let errorFlg:boolean = false
    pathList.forEach((i)=>{
        if(i === ''){
            errorFlg = true
        }
    })
    if(fs.existsSync(dlFileName)){
        errorFlg = true
    }
    if(errorFlg){
        console.log("error")
        deleteDlFileName()
        getMainCommand(userIP)
    }else{
        const sendData = JSON.stringify(createSendData("startDownload",[path]))
        client.write(sendData)
    }
}