import { createSendData } from "../functions/createSendData"
import { checkCmdMain, deleteDlFileName, dlFileName, userIP } from "./checkCmd"
import { getInput } from "./getInput"
import * as fs from "fs"

interface targetType{
    id:string,
    localIP:string,
    globalIP:string,
    sendSys?:any
}
export let targetList:targetType[] = []

export const getMainCommand = async(ip:string)=>{
    const cmd:string = await getInput(`$ ${ip}>`) as string
    checkCmdMain(ip,cmd)
}

let startDl:boolean = false
let oneTimeData:any[] = []
let dlFileNowSize:number = 0
let dlFileMax:number = 0
export const getFun = async(data:string,client:any)=>{
    try{
        if(!startDl){
            const getData = JSON.parse(data)
            if(getData.type === "targetList"){
                targetList = getData.data[0]
                console.log("----------------TargetList----------------")
                targetList.forEach((i,index)=>{
                    console.log(`${index} - ${i.globalIP}:${i.localIP}`)
                })
                console.log("------------------------------------------")
                //どれに接続するか選択させる
                let connectNum = await getInput("select target:")
                if(!connectNum){
                    let selectFlg:boolean = true
                    while (selectFlg){
                        connectNum = await getInput("select target:")
                        if(connectNum){
                            selectFlg =false
                        }
                    }
                }
                try{
                    let connectId:string = targetList[Number(connectNum)].id
                    const sendData = JSON.stringify(createSendData("select-target",[connectId]))
                    client.write(sendData)
                }catch{
                    console.log("error")
                    
                }
                
            }else if(getData.type === "connectedInfo"){
                console.log(`Successful connection to ${getData.data[0].globalIP}:${getData.data[0].localIP}`)
                getMainCommand(`${getData.data[0].globalIP}:${getData.data[0].localIP}`)
            }else if(getData.type === "connect-error"){
                console.log("can not connect")
            }else if(getData.type === "cmdResoultClient"){
                console.log(getData.data[0])
                getMainCommand(userIP)
                
            }else if(getData.type === "doneUploadServer"){
                console.log("upload server done ☑")
                console.log("uploading target.....")
            }else if(getData.type === "doneTargetUpload"){
                console.log("upload target done ☑")
                getMainCommand(userIP)
            }else if(getData.type === "startUploadClient"){
                startDl = true
                dlFileMax = getData.data[0]
            }else if(getData.type === "errorUpload"){
                console.log("upload error ✖")
                getMainCommand(userIP)
            }else if(getData.type === "dlError"){
                console.log("download error ✖")
                deleteDlFileName()
                dlFileNowSize = 0
                dlFileMax = 0
                startDl = false
                getMainCommand(userIP)
            }
        }else{
            oneTimeData.push(data)
            const can = Buffer.concat(oneTimeData)
            dlFileNowSize = Buffer.concat(oneTimeData).length
            oneTimeData = []
            await fs.writeFileSync(`${dlFileName}`,can,{flag:'a'})
            const fileSize = fs.statSync(dlFileName).size
            if(fileSize>=dlFileMax){
                console.log("download done ☑")
                dlFileNowSize = 0
                dlFileMax = 0
                startDl = false
                deleteDlFileName()
                getMainCommand(userIP)
            }
        }
    }catch(error){
        console.log(error)
        deleteDlFileName()
        startDl = false
        dlFileNowSize = 0
        dlFileMax = 0
        getMainCommand(userIP)
    }
}