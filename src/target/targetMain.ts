import * as net from "net"
import * as os from "os"
import {getIp, ipResType} from "./getIP"
import { tcpDataType } from "../types/tcpDataType"
import { getSendData } from "./getData"
export let target:any = undefined
const host:string = "192.168.11.10"
const port:number = 3000
export let id:string = ""

const initSys = async()=>{
    console.log("connecting server....")
    const networkinfo = os.networkInterfaces()["Wi-Fi"]
    let netData:string | ipResType = ""
    if(networkinfo){
        netData = await getIp(networkinfo)
        console.log(netData)
     }else{
        netData = "can not get ip"
        console.log(netData)
     }
     await conServer()
     const firstSendData:tcpDataType = {
        type:"first-target",
        data:[
            netData
        ]
     }
     target.write(JSON.stringify(firstSendData))
     target.on("data",(data:any)=>{
        const getData = JSON.parse(data)
        if(getData.type === "sendIP"){
            id = getData.data[0]
        }else{
            getSendData(data)
        }
     })

}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const conServer =async()=>{//接続完了するまで試行
    let canntCon = true
    while (canntCon){
        target = new net.Socket()
        await target.connect(port,host,()=>{
            console.log(`connected to ${host}:${port}`)
            canntCon = false
        })
        target.on("error",()=>{
            target.end()
            target = undefined
        })
        await sleep(2000)
    }
}
initSys()

