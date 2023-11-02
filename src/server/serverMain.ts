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
    let startUL:boolean = false
    let firstUL:boolean = true
    let nowFileSize:number = 0
    let nowFileMaxSize:number = 0
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
                startUL = true
                firstUL = true
            }else if(getData.type === "sendFileBuffer"){
                console.log("1")
                const appendData = getData.data
                console.log(appendData)
                const fileList:string[] = nowFileName.split(".")
                if(!startUL){
                    // fs.writeFile(`./uploadFile/upload.${fileList[fileList.length-1]}`,appendData,'binary',(err)=>{
                    //     startUL = true
                    // })
                }else{
                    // fs.appendFile(nowFileName,appendData.data,(error)=>{
                    //     if(error){
                    //         console.log(error)
                    //     }
                    //     const appendDataSize = fs.statSync(`./uploadFile/upload.${fileList[fileList.length-1]}`)
                    //     console.log(appendDataSize)
                    // })
                }
            }
        }else{
            const appendData = data
            console.log(appendData)
            const fileList:string[] = nowFileName.split(".")
            if(firstUL){
                fs.writeFile(`./uploadFile/upload.${fileList[fileList.length-1]}`,appendData,'binary',(err)=>{
                    startUL = false
                    const appendDataSize:number = fs.statSync(`./uploadFile/upload.${fileList[fileList.length-1]}`).size
                    if(nowFileMaxSize <= appendDataSize){
                        console.log("done")
                        startUL = false
                        firstUL = true
                    }
                })

            }else{
                fs.appendFile(nowFileName,appendData,(error)=>{
                    if(error){
                        console.log(error)
                    }
                    const appendDataSize = fs.statSync(`./uploadFile/upload.${fileList[fileList.length-1]}`).size
                    if(appendDataSize>=nowFileMaxSize){
                        console.log("done2")
                        startUL = false
                        firstUL = true
                    }
                })
            }
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