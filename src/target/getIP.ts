import * as os from "os"
import axios from "axios"
export interface ipResType{
    localIP:string,
    globalIP:string
}

const getglobalIp = async():Promise<string>=>{
    try{
        const data = await axios.get("https://api.ipify.org?format=json")
        return data.data.ip
    }catch{
        return "not found"        
    }
}

export const getIp = async(info:any):Promise<ipResType>=>{
    const globalIP:string = await getglobalIp()
    let localIP:string = ""
    try{
        info.forEach((i:any)=>{
            if(i.family == "IPv4"){
                localIP = i.address
            }
        })
        return {localIP:localIP,globalIP:globalIP}
    }catch{
        return {localIP:"not found",globalIP:globalIP}
    }
}