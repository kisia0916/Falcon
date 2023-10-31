import * as readline from "readline"
import { rlList } from "./clientMain"

export const getInput =(questionMess:string) =>{
    let returnInput:string|number|undefined = undefined
    rlList.forEach((i,index)=>{
        i.close()
        rlList.splice(index,1)
    })
    const rl = readline.createInterface({
        input:process.stdin,
        output:process.stdout
    })
    rlList.push(rl)
    return new Promise((resolve,reject)=>{
        rl.question(questionMess,(input)=>{
            rl.close()
            rlList.forEach((i,index)=>{
                i.close()
                rlList.splice(index,1)
            })
            resolve(input)
        })
        
    })

}