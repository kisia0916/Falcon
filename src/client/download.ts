import { createSendData } from "../functions/createSendData"
import { client } from "./clientMain"

export const downloadFile = (path:string)=>{
    const sendData = JSON.stringify(createSendData("startDownload",[path]))
    client.write(sendData)
}