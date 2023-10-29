import { createSendData } from "../functions/createSendData"
import { getInput } from "./getInput"

interface targetType{
    id:string,
    localIP:string,
    globalIP:string,
    sendSys?:any
}
export let targetList:targetType[] = []



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
        const connectNum = await getInput("Select target:")
        let connectId:string = targetList[Number(connectNum)].id
        const sendData = JSON.stringify(createSendData("select-target",[connectId]))
        client.write(sendData)
        
    }
    
}