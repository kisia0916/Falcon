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
    let startDl:any = false
    let nowFileSize:number = 0
    let nowFileMaxSize:number = 0
    let deleteFileName:string = ""
    let nowCmdResult:string = ""
    let nowCmdSize:number = 0
    let nowCmdResultMax:number = 0
    let test:any[] = []
    let oneTimeData:any[] = []
    const oneDataSize:number = 3000
    let targetID:string = ""
    socket.on("data",async(data:string)=>{
        try{
            if(!startUL && !startDl){
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
                    if(clientList.findIndex(elem=>elem.conTarget === getData.data[0]) === -1){
                        console.log(getData.data[0])
                        const clientIndex = clientList.findIndex(elem=>elem.id ===id)
                        clientList[clientIndex].conTarget = getData.data[0]
                        const targetIndex = publickTargetList.findIndex(elem=>elem.id === getData.data[0])
                        const sendData = JSON.stringify(createSendData("connectedInfo",[publickTargetList[targetIndex]]))
                        socket.write(sendData)
                        console.log(clientList)
                    }else{
                        const sendData = JSON.stringify(createSendData("connect-error",[]))
                        socket.write(sendData)
                    }
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
                    console.log("sendFilename")
                    nowFileName = getData.data[0]
                    nowFileMaxSize = getData.data[1]
                    nowFilePath = getData.data[3]
                    startUL = true
                    firstUL = true
                    console.log(getData.data)
                    const clientIndex:number = clientList.findIndex(elem=>elem.id === id)
                    const targetIndex:number = targetList.findIndex(elem=>elem.id == clientList[clientIndex].conTarget)
                    targetID = targetList[targetIndex].id
                    deleteUpload()
                }else if(getData.type === "doneUploadTarget"){
                    console.log(id)
                    console.log(getData.data[0])
                    const clientIndex = clientList.findIndex(elem=>elem.id === getData.data[0])
                    const sendData = JSON.stringify(createSendData("doneTargetUpload",[]))
                    clientList[clientIndex].sendSys.write(sendData)
                    deleteUpload()
                }else if(getData.type === "startDownload"){
                    console.log(startDl)
                    const clientIndex = clientList.findIndex(elem=>elem.id === id)
                    const targetID = clientList[clientIndex].conTarget
                    const targetIndex = targetList.findIndex(elem=>elem.id === targetID)
                    const sendData = JSON.stringify(createSendData("startDownload",[getData.data[0]]))
                    targetList[targetIndex].sendSys.write(sendData)
                }else if(getData.type === "dlStartFlg"){
                    startDl = true
                    deleteUpload()
                    nowFilePath = getData.data[0]
                    nowFileMaxSize = getData.data[1]
                }else if(getData.type === "isUploadFile"){

                    const targetIndex:number = targetList.findIndex(elem=>elem.id === id)
                    nowFileName = getData.data[0]
                    console.log(nowFileName)
                    const fileType:string = nowFileName.split(".")[1]
                    console.log(nowFileName)
                    uploadFile(targetList[targetIndex].sendSys,`./uploadFile/upload.${fileType}`)
                    const doneData = JSON.stringify(createSendData("doneUploadServer",[]))
                    nowFilePath = ""
                    nowFileName = ""
                    const clientIndex = clientList.findIndex(elem=>elem.conTarget === id)
                    clientList[clientIndex].sendSys.write(doneData)
                    nowFileSize = 0
                    nowFileMaxSize = 0
                }else if(getData.type === "errorUpload"){
                    const clientIndex = clientList.findIndex(elem=>elem.conTarget === id)
                    const sendData = JSON.stringify(createSendData("errorUpload",[]))
                    clientList[clientIndex].sendSys.write(sendData)
                }else if(getData.type === "serverUploadError"){
                    const clientIndex = clientList.findIndex(elem=>elem.conTarget === id)
                    const sendData = JSON.stringify(createSendData("dlError",[]))
                    clientList[clientIndex].sendSys.write(sendData)
                }else if(getData.type === "lsSize"){
                    nowCmdResultMax = getData.data[0]
                    const sendData = JSON.stringify(createSendData("startSendCmdResult",[]))
                    socket.write(sendData)
                }else if (getData.type === "cmdResult"){
                    nowCmdResult = nowCmdResult.concat(getData.data[0])
                    nowCmdSize = Buffer.from(nowCmdResult).length
                    console.log(nowCmdResult)
                    if(nowCmdSize>=nowCmdResultMax){
                        console.log("send done")
                        nowCmdResultMax = 0
                        nowCmdSize = 0
                        const clientIndex = clientList.findIndex(elem=>elem.conTarget === id)
                        const sendData = nowCmdResult
                        nowCmdResult = ""
                        clientList[clientIndex].sendSys.write(sendData)
                    }
                }
            }else if(startUL){
                const targetIndex:number = targetList.findIndex(elem=>elem.id === targetID)
                const fileType:string = nowFileName.split(".")[1]
                console.log("start")
                console.log(firstUL)
                const dataBinary = Buffer.from(data,"binary")
                oneTimeData.push(data)
                const can = Buffer.concat(oneTimeData)
                nowFileSize = Buffer.concat(oneTimeData).length
                oneTimeData = []
                await fs.writeFileSync(`./uploadFile/upload.${fileType}`,can,{flag:'a'})
                deleteFileName = `./uploadFile/upload.${fileType}`
                console.log(deleteFileName)
                console.log("done")
                const fileSize:number = fs.statSync(`./uploadFile/upload.${fileType}`).size
                if(fileSize>=nowFileMaxSize){
                    console.log("ooooooooooooooooooooooooooooo")
                    const sendData = JSON.stringify(createSendData("startUpload",[nowFileName,nowFileMaxSize,nowFilePath,id]))
                    targetList[targetIndex].sendSys.write(sendData)

                    startUL = false
                    firstUL = true

                    // uploadFile(targetList[targetIndex].sendSys,`./uploadFile/upload.${fileType}`)
                    // const doneData = JSON.stringify(createSendData("doneUploadServer",[]))
                    // socket.write(doneData)
                }
            }else if(startDl){
                console.log(data)
                const fileType = nowFilePath.split(".")[1]
                oneTimeData.push(data)
                const can = Buffer.concat(oneTimeData)
                nowFileSize = Buffer.concat(oneTimeData).length
                oneTimeData = []
                await fs.writeFileSync(`./uploadFile/upload.${fileType}`,can,{flag:'a'})
                console.log("done")
                const fileSize:number = fs.statSync(`./uploadFile/upload.${fileType}`).size
                if(fileSize>=nowFileMaxSize){
                    console.log("upload done")
                    startDl = false
                    const clientIndex = clientList.findIndex(elem=>elem.conTarget === id)
                    console.log(clientIndex)
                    const sendData = JSON.stringify(createSendData("startUploadClient",[nowFileMaxSize]))
                    clientList[clientIndex].sendSys.write(sendData)
                    uploadFile(clientList[clientIndex].sendSys,`./uploadFile/upload.${fileType}`)
                    nowFilePath = ""
                    nowFileName = ""
                    nowFileSize = 0
                    nowFileMaxSize = 0
                    deleteUpload()
                }
            }
        }catch(error){
            console.log(error)
            startDl = false
            nowFilePath = ""
            nowFileName = ""
            nowFileSize = 0
            nowFileMaxSize = 0
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

const uploadFile = (socket:any,path:string)=>{
    console.log(path)
    fs.readFile(path,(error,data)=>{
        console.log(data)
        socket.write(data)
    }) 
}

const deleteUpload = ()=>{
    fs.readdir("./uploadFile",(error,data)=>{
        data.forEach((i)=>{
            console.log(i)
            fs.unlink(`./uploadFile/${i}`,(error)=>{})
        })
    })
}
server.listen(PORT,()=>{
    console.log("server run")
})