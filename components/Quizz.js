import React from "react"
import he from "he"
import Confetti from "react-confetti"
import Start from "./Start.js"

export default function Quizz(props){
    const [questions, setQuestions] = React.useState([])
    const [selectedAnswers, setSelectedAnswers] = React.useState({})
    const [gameOver, setGameOver] = React.useState(false)
    const [showResults, setShowResults] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
    const [allQuestionsAnswered, setAllQuestionsAnswered] = React.useState(false)
    const [answeredMoreThanFive, setAnsweredMoreThanFive] = React.useState(false)
    const [error, setError] = React.useState(null)
    const audioVictory = new Audio("./sounds/victory.mp3")
    const audioFail = new Audio("./sounds/fail.mp3")
  
    
/*
This is a React function that fetches a set of trivia questions from the Open Trivia Database API and updates the state of the component with the retrieved questions.
The getQuestions() function first sets the loading state to true, indicating that the data is currently being fetched.
It then makes a fetch() call to the Open Trivia Database API to get a set of 3 hard difficulty questions from the category "Entertainment: Film".
Once the data is retrieved, it is decoded using the he library to convert HTML entities to their corresponding characters. The function then shuffles the answers for each question using the shuffle() function previously defined.
The decoded and shuffled questions are then set as the state of the component using the setQuestions() function, and the loading state is set to false.
Finally, the useEffect() hook is used to call the getQuestions() function once when the component is mounted.
*/
    function getQuestions() {
        setLoading(true)
        fetch(`https://opentdb.com/api.php?amount=${props.startData.NumberOfQuestions}&category=${props.startData.SelectCategory}&difficulty=${props.startData.SelectDifficulty}&type=${props.startData.SelectType}`)
        .then(res => {
            if (!res.ok) {
            throw new Error("Something went wrong please try again")
            }
            return res.json()
        })
        .then(data => {
            // Decode the HTML entities in the response data using he
            const decodedData = data.results.map(question => {
            return Object.assign({}, question, {
                question: he.decode(question.question),
                correct_answer: he.decode(question.correct_answer),
                incorrect_answers: question.incorrect_answers.map(answer => he.decode(answer)),
                answers: question.incorrect_answers.concat(question.correct_answer).map(answer => he.decode(answer))
            })
            })
            // Shuffle the answers for each question
            const questions = decodedData.map(question => {
            const shuffledAnswers = shuffle(question.answers)
            return Object.assign({}, question, { answers: shuffledAnswers })
            })
            setQuestions(questions)
            setLoading(false)
            setError(null) // Clear any previous errors
        })
        .catch(error => {
            setLoading(false)
            setError(error.message) // Set the error state to the error message
        })
    }
    
    React.useEffect(() => {
        getQuestions()
    },[])

/*
Shuffles an array in place using the Fisher-Yates shuffle algorithm.
@param {Array} array - The array to be shuffled.
`@returns {Array}` The shuffled array.
*/
    function shuffle(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
        }
        return array;
    }
    
/*
This function generates a list of questions, their corresponding answers, and handles the selection of answers by the user.
It maps over an array of questions and for each question, it creates a container element that displays the question, a list of answers,
and their respective classes depending on whether they are selected, correct, or incorrect. The answers are randomly shuffled before being displayed.
Each answer is rendered as a clickable paragraph element with a "data-question-index" attribute that identifies the index of the question it belongs to. 
When an answer is clicked, the "handleAnswerClick" function is called, which sets the selected answer in the "selectedAnswers" state object.
The function returns an array of these question containers to be rendered by the component that calls it. 
*/ 
    function renderQuestion(){
        return questions.map((question, index) => {
            const correctAnswer = question.correct_answer
            const selectedAnswer = selectedAnswers[index]
            const isCorrect = gameOver && selectedAnswer 
            const shuffledAnswers = question.answers

            return (
                <div className="questionContainer" key={index}>
                    <h3 className="question">{question.question}</h3>
                    {shuffledAnswers.map((answer, answerIndex) => {
                        const isSelected = selectedAnswers[index] === answer
                        const isIncorrect = gameOver && isSelected && answer !== correctAnswer;
                        const answerClasses = `answer ${isSelected ? "selected" : ""} ${isIncorrect ? "incorrect" : ""} ${isCorrect && answer === correctAnswer ? "correct" : ""}`

                        return (
                            <div className="answersContainer" key={answer}>
                                <p 
                                    className={answerClasses}
                                    data-question-index={index}
                                    onClick={handleAnswerClick}
                                >
                                    {answer}
                                </p>
                            </div>
                        )
                    })}
                    <hr/>
                </div>
            )
        })
    }

/* 
Handles click events on answer options. Updates the selectedAnswers object
with the clicked answer option and checks if all questions have been answered.
Sets the allQuestionsAnswered state to true if all questions have been answered.
If the game is already over, the function returns immediately.
*/
    function handleAnswerClick(event) {
        if (gameOver) return
        const questionIndex = event.target.dataset.questionIndex;
        const answerText = event.target.textContent;
        setSelectedAnswers(prevSelectedAnswers => Object.assign({}, prevSelectedAnswers, { [questionIndex]: answerText }))
        const allAnswered = Object.values(selectedAnswers).every(answer => answer)
        setAllQuestionsAnswered(allAnswered)
    }

/*
This function checks if all questions have been answered by comparing the length of the selectedAnswers object to the length of the questions array. 
If they are equal, it sets the state of allQuestionsAnswered to true. 
*/
    function checkAllQuestionsAnswered() {
        const answeredQuestions = Object.keys(selectedAnswers).length
        const totalQuestions = questions.length
        if (answeredQuestions === totalQuestions) {
            setAllQuestionsAnswered(true)
        }
    }

/*
The calculateScore function iterates over each question, compares the selected answer with the correct answer, and increments the correctAnswers variable if the selected answer matches the correct answer.
Finally, it returns the score as a string in the format "correctAnswers/totalQuestions". 
*/
    function calculateScore(){
        let correctAnswers = 0
        let totalQuestions = questions.length
    
        for (let i=0; i<totalQuestions; i++){
        if (selectedAnswers[i] === questions[i].correct_answer){
            correctAnswers++;
        }
        }
    
        return {
        correctAnswers: correctAnswers,
        totalQuestions: totalQuestions
        };
    }

    function handleConfetti() {
        const { correctAnswers, totalQuestions } = calculateScore();
        if (correctAnswers >= totalQuestions / 2) {
          setAnsweredMoreThanFive(true);
          audioVictory.volume = 0.5
          audioVictory.play()
          if(correctAnswers > JSON.parse(localStorage.getItem('highScore'))){
            localStorage.setItem("highScore", JSON.stringify(correctAnswers))
          }
        }else if(correctAnswers < totalQuestions / 2){
            audioFail.volume = 0.5
            audioFail.play()
            if(correctAnswers > JSON.parse(localStorage.getItem('highScore'))){
                localStorage.setItem("highScore", JSON.stringify(correctAnswers))
              }
        }
      }
   
/*
This function handles the game over logic.
It checks if all questions have been answered by the user, and if so, it sets the gameOver and showResults state variables to true, indicating that the game has ended and the results should be displayed.
If not all questions have been answered, the function simply returns without doing anything.
*/
    function handleGameOver(){
        if (!allQuestionsAnswered) return
        setGameOver(true)
        setShowResults(true)
    }

/*
Resets the game state by clearing the selected answers, hiding the results,
setting the game over state to false, and loading new questions. 
This function is called when the user clicks the "Restart" button.
*/
    function handleRestart(){
        setQuestions([])
        setSelectedAnswers({})
        setGameOver(false)
        setShowResults(false)
        setAllQuestionsAnswered(false)
        setAnsweredMoreThanFive(false)
        audioVictory.pause()
        audioFail.pause()
        getQuestions()
    }

    function handlePause(){
        audioVictory.pause()
        audioFail.pause()
    }
    
    return (
    <div>{answeredMoreThanFive && 
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <Confetti width={window.innerWidth} height={window.innerHeight} />
    </div>}
        <div className="quizzContainer">
            {error && (
                <div className="errorMessage">
                    <h1>{"Something went wrong please try again"}</h1>
                    <button onClick={props.toggleDisplay}>Back to Options</button>
                </div>
            )}
            {loading ? (
                <div className="loadingContainer">
                    <div className="loadingInsideContainer">
                        <div className="loadingSpinner"></div>
                        <p className="loadingMessage">Loading questions...</p>
                    </div>
                </div>
            ) : null}
    
            {!error && !loading && (
                <div>
                    {renderQuestion()}
                    <div className="endGame">
                        {showResults && <p className="endGameText"
                        >You scored {calculateScore().correctAnswers}/{calculateScore().totalQuestions} correct answers {calculateScore().correctAnswers >= calculateScore().totalQuestions / 2 ? "😄" : "😢"}
                        </p>}
                        {!gameOver ? (
                            <button onClick={() => {handleGameOver(), handleConfetti()}} disabled={!allQuestionsAnswered}>Submit</button>
                        ) : (
                            <div className="buttonsDiv">
                                <button onClick={handleRestart}>Restart Game</button>
                                <button onClick={() => {props.toggleDisplay() , handlePause()}}>Back to Options</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    </div>
    )
}
