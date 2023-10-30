import * as readline from "readline"

export const getInput =(questionMess:string) =>{
    let returnInput:string|number|undefined = undefined
    const rl = readline.createInterface({
        input:process.stdin,
        output:process.stdout
    })
    return new Promise((resolve,reject)=>{
        rl.question(questionMess,(input)=>{
            rl.close()
            resolve(input)
        })
        
    })

}