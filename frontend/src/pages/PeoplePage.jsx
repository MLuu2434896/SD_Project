import EmployeeComponent from "../components/EmployeeComponent";
import HeadsUpDisplay from "../components/HeadsUpDisplay";
import SupervisorComponent from "../components/SupervisorComponent";


const PeoplePage = () => {                              //This is a nonfunctional Prototype. Consider this a template - JM

    return(
        <div className="text-center">
            <HeadsUpDisplay></HeadsUpDisplay>
            <div className = "PeoplePage">
                <p> Need to make a People page that shows all active users, inactive users involved in a project </p>
                <EmployeeComponent></EmployeeComponent>
                <SupervisorComponent></SupervisorComponent>
            </div>
        </div>
     )
 }
 
 export default PeoplePage;