import * as net from "net"
import { getInput } from "./getInput"
import { createSendData } from "../functions/createSendData"
import { getFun } from "./getFun"
// const host:string = "0.tcp.jp.ngrok.io"
// const port:number = 18000
const host:string = "localhost"
const port:number = 3000

export let  client:any = undefined
export let rlList:any[] = []
const firstInit = ()=>{
    client = new net.Socket()
    client.connect(port,host,()=>{
        console.log(`connected ${host}:${port}`)
        const sendData = JSON.stringify(createSendData("first-client",[]))
        client.write(sendData)
    })
    client.on("error",async(error:any)=>{
        client.end()
        console.log("can not connection")
        await reconectTry()
    })
    client.on("data",(data:string)=>{
        getFun(data,client)
    })
}
const reconectTry = async()=>{
    client.end()
    client = undefined
    const data = await getInput("reconect?(y/n):")
    if(data === "y"){
        client = new net.Socket()
        client.connect(port,host,()=>{
            console.log(`connected ${host}:${port}`)
            const sendData = JSON.stringify(createSendData("first-client",[]))
            client.write(sendData)
        })
        client.on("error",(error:any)=>{
            client.end()
            reconectTry()
        })
        client.on("data",(data:string)=>{
            getFun(data,client)
        })
    }
}
firstInit()
