Release Version 1.1

Objective of this script is to have something that runs, checks whether world of warcraft classic is running and then play some audio
from one of my flashcards to help me learn chinese. This will be tied to a scheduled task on my computer.

Supported Operating Systems: Windowd 10
-For other opperating Systems the command in the exec function will need to be updated.

Required software: NodeJS v10.16.3
    Optional-git bash(GNU Bash) v4.4.23

Installation:

1- Install NodeJS v10.16.3. Other versions should work too, just make sure that child-proccess
    and string interpolation are supported.
2- Git clone the repository
3- Modify the variables audioFileLoaction and programList with the location of the audio files
    to be played and the list of system processes detect. By default, the script will close out
    windows media player, but if another program needs to be closed update the .includes method
    on line 128.

    3A - If there are several audio files that need to be given the .mp3 extension, use the
        bashRenameScript.sh
4- Set up a scheduled task using the Task Scheduler (use the windows search bar) and have it run
    NodeJS at the location of the script. I recommend having it run every 10 minutes.