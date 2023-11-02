import { createSendData } from "../functions/createSendData"
import { client } from "./clientMain"
import { getMainCommand } from "./getFun"
import { uploadFile } from "./uploadFile"

export let userIP:string = ""
export const checkCmdMain = (userIp:string,cmd:string)=>{
    const getCmd:string[] = cmd.split(" ")
    userIP = userIp
    if(getCmd[0] == "cd"){
        if(getCmd.length>1){
            const sendData = JSON.stringify(createSendData("sendCmdText",[cmd]))
            client.write(sendData)
        }else{
            console.log("Not enough factor")
        }
    }else if(getCmd[0] == "dir" || getCmd[0] == "ls"){
        cmd = "dir"
        const sendData = JSON.stringify(createSendData("sendCmdText",[cmd]))
        client.write(sendData)
    }else if(getCmd[0] == "del"){
        const sendData = JSON.stringify(createSendData("sendCmdText",[cmd]))
        client.write(sendData)
    }else if(getCmd[0] == "ul"){
        if(getCmd.length>2){
            uploadFile(getCmd[1],getCmd[2])
        }
    }else{
        console.log("No Command")
        getMainCommand(userIP)
    }

}