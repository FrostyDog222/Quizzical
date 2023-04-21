import React from "react"

export default function Start(props){
    const [formData, setFormData] = React.useState({
        NumberOfQuestions: "",
        SelectCategory: "",
        SelectDifficulty: "",
        SelectType: ""
    })
    const[highestScore, setHighestScore] = React.useState(JSON.parse(localStorage.getItem('highScore')) || '0')

    function handleChange(event){
        const {name, value, type, checked} = event.target
        setFormData(prevFormData => {
            return Object.assign({}, prevFormData, {[name]: type === "checkbox" ? checked : value})
        })
    }
    

    function handleSubmit(event) {
        event.preventDefault()
        const enteredNumberOfQuestions = formData.NumberOfQuestions.trim()
        const updatedFormData = Object.assign({}, formData)
        if (enteredNumberOfQuestions === '') { // check if the input is empty
            updatedFormData.NumberOfQuestions = '5'; // set default value to 5
        } else {
            updatedFormData.NumberOfQuestions = enteredNumberOfQuestions
        }
        setFormData(updatedFormData)
        props.toggleDisplay(updatedFormData)
    }

    return (
    <div className="startBigContainer">
        <div className="star">
                <img src="../images/star.png"/>
                <h3 className="scoreText">Highest Score : {highestScore} </h3>
                <img className="reverseImg" src="../images/star.png"/>
            </div>
        <div className="startContainer">
            <img className="logo" src="../images/logo.png"/>
            <form onSubmit={handleSubmit}>
            
                <label htmlFor="questionsNumber">Number of Questions: {formData.NumberOfQuestions || "5"}</label>
                <br/>
                <input 
                    id="questionsNumber" 
                    placeholder="Default is 5"
                    type="range" 
                    min="2" max="50"
                    name="NumberOfQuestions"
                    value={formData.NumberOfQuestions}
                    onChange={handleChange}
                />
                <br/>
                
                <label htmlFor="selectCategory">Select Category:</label>
                <br/>
                <select 
                    id="selectCategory"
                    name="SelectCategory"
                    value={formData.SelectCategory}
                    onChange={handleChange}
                >
                    <option value="9">Any Category</option>
                    <option value="10">Books</option>
                    <option value="11">Film</option>
                    <option value="12">Music</option>
                    <option value="13">Musicals & Theatres</option>
                    <option value="14">Television</option>
                    <option value="15">Video Games</option>
                    <option value="16">Board Games</option>
                    <option value="17">Science & Nature</option>
                    <option value="18">Computers</option>
                    <option value="19">Mathematics</option>
                    <option value="20">Mythology</option>
                    <option value="21">Sports</option>
                    <option value="22">Geography</option>
                    <option value="23">History</option>
                    <option value="24">Politics</option>
                    <option value="25">Art</option>
                    <option value="26">Celebrities</option>
                    <option value="27">Animals</option>
                </select>
                <br/>
                
                <label htmlFor="selectDifficulty">Select Difficulty:</label>
                <br/>
                <select 
                    id="selectDifficulty"
                    name="SelectDifficulty"
                    value={formData.SelectDifficulty}
                    onChange={handleChange}
                >
                    <option value="">Any Difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
                <br/>
                
                <label htmlFor="selectType">Select Type:</label>
                <br/>
                <select
                    id="selectType"
                    name="SelectType"
                    value={formData.SelectType}
                    onChange={handleChange}
                >
                    <option value="">Any Type</option>
                    <option value="multiple">Multiple Choice</option>
                    <option value="boolean">True / False</option>
                </select>
                
                <br/>
                <button className="startQuizzBtn">Start Quizz</button>
            </form>
        </div>
    </div>
    )
}