import { createSendData } from "../functions/createSendData"
import { client } from "./clientMain"
import { getMainCommand } from "./getFun"

export const checkCmdMain = (userIp:string,cmd:string)=>{
    const getCmd:string[] = cmd.split(" ")
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
    }else{
        console.log("No Command")
    }
    getMainCommand(userIp)
}