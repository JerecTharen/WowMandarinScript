//Initial Imports Needed
const fs = require('fs');
const exec = require('child_process').exec;
const emitter = require('events');

//TODO: Set up some sort of logging system or file
//TODO: Change this so that it loops until the process ends so that the program doesn't keept popping
//  up in front of my game

//Audio file location
let audioFileLoaction = "D:\\Projects\\\\WowMandarinScript\\audio\\audio1\\";
//TODO: Collect many audio files and then be able to randomly pick one. Will need FS here
fs.readdir("./audio/audio1", (dirErr, fileNames)=>{
    console.log("stuff", dirErr, fileNames);
    audioFileLoaction = audioFileLoaction + fileNames[Math.floor(Math.random() * fileNames.length)];
    console.log("specific audio file", audioFileLoaction);
});
//const audioFileLoaction = "D:\\Projects\\WowMandarinScript\\audio\\audio1\\5.mp3";
const clipDuration = 10000;//duration in miliseconds for setTimeout

//Class for emitting events for the tasklist
class Emitter extends emitter{}

let taskEventEmitter = new Emitter();

//List of programs that I want this script to detect
//TODO: Read task list from a file instead of storing it in the script
const programList = [
    "WowClassic.exe"
];
//List of programs that can be used to play audio to kill
//TODO: Use this variable
const killList = [
    "wmplayer.exe",
    "Video.UI.exe"
];

///Summary:
/// This function tasks the output from the tasklist command
/// and turns it into task objects. So far I only track
/// the name and the process ID
let parseTasklist = (tasklist)=> {
    let tasks = [];
    for(let i = 156; i < tasklist.length; i = i+78)
    {
        let taskline = tasklist.substr(i, 78);
        let task = {
            taskname: taskline.substr(2, 30),
            taskID: Number(taskline.substr(31, 5))
        };
        tasks.push(task);
    }
    return tasks;
};

///Summary:
/// cmd takes a command and executes it via child-process
/// then emits an event with the same name
//TODO: Set this up so that I can pass in a name for the event, and a command to be run
//  this would allow me to run the same command without triggering the same event
let cmd = (eventName, cmdName) => {
    exec(cmdName, (err, sdout, sderr) =>{
        if(err)
            //Debugging Statement
            console.error(cmdName, err);
        if(sderr)
            //Debugging Statement
            console.error(cmdName, sderr);
        
        //Debugging statement
        console.log(cmdName, sdout);
        taskEventEmitter.emit(eventName, sdout);
    });
};

//Start running actual functions and get the inital task list
cmd("initTaskList", "tasklist");


//Catch the above emitted event
taskEventEmitter.on("initTaskList", (out)=>{

    //TODO: set up event listening remover so I can use tasklist again
    
    //Parse tasklist
    console.log("parsing list");
    
    let tasksfound = [];
    let tasklist = parseTasklist(out);
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

    //If a program on the list is running, play audio
    if(tasksfound.length > 0)
    {
        console.log("wow running");

        cmd("startAudio", `start ${audioFileLoaction}`);
        //Run this again in 10 minutes if the process is running, otherwise
        //the else will run and the script will end
        setTimeout(()=>{
            cmd("initTaskList", "tasklist");
        }, 600000);//Wait 10 minutes,then run again
    }
    else{
        //TODO: Consider doing comething here other than just outputting text
        console.error("not running");
    }
});



//Need to get tasklist again once audio plays so I can get the ID
//for the process playing the audio and kill it
taskEventEmitter.on("startAudio", (cmdName)=>{
    cmd("audioTasklist", "tasklist");
});

taskEventEmitter.on("audioTasklist", (tasklist)=>{
    let audioTasklist = parseTasklist(tasklist);
    
    //Only want to kill one task
    let isTaskDead = false;
    audioTasklist.forEach(task => {
        if(task.taskname.includes("wmplayer.exe") && !isTaskDead)
        {
            console.log("killing task", task);
            isTaskDead = true;
            setTimeout(()=>{
                cmd("killAudio", `taskkill /F /PID ${task.taskID}`);
            }, clipDuration);
        }
    });
});

