import * as net from "net"
import { getInput } from "./getInput"
import { createSendData } from "../functions/createSendData"
import { getFun } from "./getFun"
import * as fs from "fs"
// const host:string = "0.tcp.jp.ngrok.io"
// const port:number = 11608
let host:string = "localhost"
let port:number = 3000

const hostData = fs.readFileSync(__dirname+"/host.txt").toString()
host = hostData.split(":")[0]
port = Number(hostData.split(":")[1])
console.log(host,port)

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
        try{
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
        }catch(error){
            console.log("error")
        }
    }else{
        process.exit()
    }
}
firstInit()
