import React, {useState} from "react";

export const ProgressBar = () => {
    

    //Will need fetch api handler to get project info

    var NumberOfTasksDone = 100;
    var TotalNumberOfTasks = 100;

    const [progress, setProgress] = useState(50);
    //var progress = (NumberOfTasksDone/TotalNumberOfTasks);

    const getColor = () => {
        if (progress < 20){
            return "#F01A1A";
        }
        else if (progress < 40){
            return "#F06E1A";
        }
        else if (progress < 70){
            return "##F0ED1A";
        }
        else{
            return "#78F01A";
        }
    }

    return (
        <div className="container">
            <div className="ProgressBar">
                <div className="ProgressBarFill" style={{ width:  '${progress}%', backgroundColor: getColor() }}>
                <div className="ProgressPercentage"> {progress}% </div>
                </div>
            </div>
        </div>
    )
}