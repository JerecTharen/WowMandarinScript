//Initial Imports Needed
const fs = require('fs');
const exec = require('child_process').exec;

//List of programs that I want this script to detect
const programList = [
    "WowClassic.exe"
];

let parseTasklist = (tasklist)=> {
    let tasks = [];
    for(let i = 156; i < tasklist.length; i++)
    {
        let taskline = tasklist.substr(i, 78);
        let task = {
            taskname: taskline.substr(2, 31),
            taskID: Number(taskline.substr(32, 4))
        };
        tasks.push(task);
    }

    return tasks;
};

let out = exec("tasklist", (err, sdout, sderr) =>{
    if(err)
        //Debugging Statement
        console.error(err);
    if(sderr)
        //Debugging Statement
        console.error(sderr);
    
    //Debugging statement
    console.log(sdout);
    return sdout;
});

//Parse tasklist
console.log("parsing list");
let tasklist = parseTasklist(out);

let tasksfound = [];
programList.forEach(program => {
    tasklist.forEach(task => {
        if(task.taskname.includes(program))
            tasksfound.push(
                {
                    task: task,
                    index: tasklist.findIndex(()=>{
                        return task;
                    })
                });
    });
});

if(tasksfound.length > 0)
{
    console.log("wow running");
    exec("start testForScriptAudio.mov", (e, o, se)=> {
        if(e)
        //Debugging Statement
            console.error(e);
        if(se)
        //Debugging Statement
            console.error(se);
    });

    // setTimeout(()=>{
    //     exec(`taskkill /F /PID ${taskPID}`, (e, o, se)=> {
    //         if(e)
    //             //Debugging Statement
    //             console.error(e);
    //         if(se)
    //             //Debugging Statement
    //             console.error(se);
            
    //         //Debugging Statement
    //         console.log("cd",o);
    //     });
    // }, 10000);
}
else{
    console.error("not running");
}