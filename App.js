import React from "react"
import Start from "./components/Start.js"
import Quizz from "./components/Quizz.js"

export default function App(){
    const [toggleDisplay, setToggleDisplay] = React.useState(true)
    const [startData, setStartData] = React.useState({
        NumberOfQuestions: "",
        SelectCategory: "",
        SelectDifficulty: "",
        SelectType: ""
    })
    
    function controlDisplay(data){
        setToggleDisplay(!toggleDisplay)
        setStartData(data)
    }
    
    return (
        <div>
            {toggleDisplay && <Start  toggleDisplay={controlDisplay}/>}
            {!toggleDisplay && <Quizz  toggleDisplay={controlDisplay} startData={startData}/>}
        </div>
    )
}