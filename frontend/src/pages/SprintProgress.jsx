import HeadsUpDisplay from "../components/HeadsUpDisplay";
import SprintInfo from "../components/SprintInfo";


const SprintProgress = () => {                              //This is a nonfunctional Prototype. Consider this a template - JM

    return(
        <div className="text-center">
            <HeadsUpDisplay></HeadsUpDisplay>
            <div className = "SprintProgressPage">
                <p>We owe you a Sprint Progress Page & who knows maybe it will come really long like this</p>
            </div>
            <SprintInfo></SprintInfo>
        </div>
     )
 }
 
 export default SprintProgress;