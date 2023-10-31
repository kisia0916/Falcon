import { createSendData } from "../functions/createSendData"
import { checkCmdMain } from "./checkCmd"
import { getInput } from "./getInput"

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

export const getFun = async(data:string,client:any)=>{
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
    }
    
}