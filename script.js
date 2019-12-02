//********************************************************* */
//                LISTENER FUNCTIONS
//********************************************************* */
// The following functions listen for click button events.
function listenStartButton() {
    console.log("listenStartButton: Listening for Start button click");
    $('body').on('click', '#start', function (event) {
        console.log("listenStartButton: Start button selected")
        $('.darkMoneyImg').hide();
        $('.eleanorQuoteImg').hide();
        $('#dark-money').removeClass('black-box');
        $('#dark-money').removeClass('ask-question');
        renderQuestionAndOptions();
        renderScorecard('reset');
    });
}

function listenSubmitButton() {
    console.log("listenSubmitButton: Listening for Submit button click");
    $('body').on('submit', '#quiz-form', function (event) {
        console.log("listenSubmitButton: Submit button selected");
        //don't submit to a server
        event.preventDefault();
        //get user's answer
        const answer = $("input[type='radio']:checked").val();
        renderAnswer(answer);
        renderScorecard();
        //increment the question 
        handleQuestion();
    });
}

function listenNextButton() {
    console.log("listenNextButton: Listening for Next button click");
    $('body').on('click', '#next', function (event) {
        console.log("listenNextButton: Next button selected");   
        renderQuestionAndOptions();
        renderScorecard();   
    });
}

function listenRestartButton() {
    console.log("listenRestartButton: Listening for Restart button click");
    $('body').on('click', '#restart', function (event) {
        console.log("listenRestartButton: Restart button selected");
        resetScore();
        resetQuestion();
        //NOTE: Decided to send user to initial page.
        renderStartPage();
        renderScorecard('hide');
        //renderNewQuestionAndOptions();
        listenStartButton();
    });
}

//********************************************************* */
//                RENDER FUNCTIONS
//********************************************************* */
function renderScorecard(option) {
    if (option === 'hide') {
        console.log("renderScorecard: Hiding scorecard");
        $('.scorecard').hide();
    } else {
        console.log("renderScorecard: Rendering scorecard");
        if (option === 'reset') {
            console.log("renderScorecard: Resetting score and question");
            resetScore();
            resetQuestion();
        } 
        if (DATA.questionNum <= DATA.questions.length) {
            console.log("handleQuestion: Only update scorecard html if questionNum <= num Questions");
            //create content in html format, then insert into the dom
            console.log("renderScorecard: question number = " + DATA.questionNum);
            console.log("renderScorecard: score = " + DATA.score);
            const htmlToInsert = $(`
                <p id="question">Question: ${DATA.questionNum}/${DATA.questions.length}</p> 
                <p id="score">Score: ${DATA.score}/${DATA.questions.length}</p>`);
            $('.scorecard').show();
            $('.scorecard').html(htmlToInsert);
        } else {
            $('.scorecard').show();
        }
    }
}

function renderQuestion() {
    console.log("renderQuestion: Rendering the question text");
    //get options to display
    const questionAndOptions = DATA.questions[DATA.questionIndex];
    const questionText = questionAndOptions.question;
    console.log("renderQuestion: questionText = " + questionText);
    $('h2').html(questionText);
}

function renderQuestionAndOptions(option) {
    console.log("renderQuestionAndOptions: Making decision about whether to render quiz or final result");
    if (DATA.questionIndex < DATA.questions.length) {
        //user needs a new question/options 
        renderNewQuestionAndOptions();
    } else {
        //user needs the final result displayed
        renderFinalResult();
    }
}

function renderNewQuestionAndOptions() {
    console.log("renderNewQuestionAndOptions: Rendering new question/options");
    //get options to display
    const questionAndOptions = DATA.questions[DATA.questionIndex];
    const questionText = questionAndOptions.question;
    const optionsArr = questionAndOptions.options;
    console.log("renderNewQuestionAndOptions: optionsArr = " + optionsArr);

    //TODO - do I need to add the question inside a fieldset?
    const questionHtml = $(`
    <fieldset>
        <legend class="question-text">${questionText}>/legend>
    </fieldset>`);

    //create question/options quiz form
    const formHtml = $(`
    <form role="form" id="quiz-form" class="quiz-form">
        <section id="dark-money" class="inner-container">
                <p id="select-answer" class="select-answer">Select the correct answer:</p>
                <ul id="list-options" style="list-style-type:none;">
                    <li><input type="radio" name="options" id="option" value="${optionsArr[0]}"
                required>${optionsArr[0]}</li>
                    <li><input type="radio" name="options" id="option" value="${optionsArr[1]}"
                required>${optionsArr[1]}</li>
                    <li><input type="radio" name="options" id="option" value="${optionsArr[2]}"
                required>${optionsArr[2]}</li>
                    <li><input type="radio" name="options" id="option" value="${optionsArr[3]}"
                required>${optionsArr[3]}</li>
                </ul>
        </section>
        <button id="submit" type="submit" class="button">Submit</button>
    </form>
    `);

    //insert html into the dom
    renderQuestion();
    $('main').html(formHtml);
}

function renderButton(option) {
    console.log("renderButton: Rendering button: " + option);
    let buttonHtml = "";
    if (option === "next") {
        console.log("renderButton: Changing Submit button to Next button");
        buttonHtml = $(`
            <button id="next" type="button" class="button">Next</button>
        `);
        $('#submit').hide();
        $('#quiz-form').append(buttonHtml);
    } else if (option === "start") {
        console.log("renderButton: Changing Restart button to Start button");
        buttonHtml = $(`
            <button id="start" type="button" class="button">Start</button>
        `);

        $('#restart').hide();
        $('#quiz-form').append(buttonHtml);

    } else if (option === "restart") {
        console.log("renderButton: Changing Next button to Restart button");
        buttonHtml = $(`
            <button id="restart" type="button" class="button">Restart</button>
        `);
        $('#next').hide();
        $('#quiz-form').append(buttonHtml);
    }
}

function renderAnswer(answer) {
    console.log("renderAnswer: Rendering the answer");
    
    //call handleAnswer to get pass or fail result
    const result = handleAnswer(answer);

    //hide the quiz options
    $('#select-answer').remove();
    $('#list-options').remove();

    //render the correct response to the result
    if (result === 0) {
        renderRightAnswer();
    } else {
        renderWrongAnswer();
    }
    renderButton('next');
}

function renderRightAnswer() {
    console.log("renderRightAnswer: Rendering correct answer");

    //generate the html to display
    const headerHtml = "Great job! You are lighting the way for Democracy.";
    const answerHtml = $(`<img src="images/AnswerYes.png" alt="Woman shines light" class="WomanLightImg">`);

    //insert html into the dom
    $('h2').html(headerHtml);
    $('#dark-money').removeClass('inner-container');
    $('#dark-money').append(answerHtml);
}

function renderWrongAnswer() {
    console.log("renderWrongAnswer: Rendering wrong answer");

    //get the correct answer
    const questionAndOptions = DATA.questions[DATA.questionIndex];
    const optionsArr = questionAndOptions.options;
    const curCorrectAnswer = questionAndOptions.correctAnswer;
    console.log("renderWrongAnswer: correct answer = " + curCorrectAnswer);

    //generate the html to display
    const headerHtml = "A Democracy needs an educated electorate!";
    const answerHtml = $(`<img src="images/AnswerNo.png" alt="Ben Franklin Oh No" class="UhOhImg">
    <p class="correct-answer">The correct answer is:</p>
    <ul>
      <li>“${curCorrectAnswer}"</li>
    </ul>
    `);

    //insert html into the dom
    $('#dark-money').removeClass('black-box');
    $('h2').html(headerHtml);
    $('#dark-money').append(answerHtml);
}

function renderFinalResult() {
    console.log("renderFinalResult: Rendering final result");
    //get the final results
    console.log("renderFinalResult: questionIndex is " + DATA.questionIndex);

    if (DATA.score === DATA.questions.length) {
        renderWonResult();
    } else {
        renderLostResult();
    }
    renderButton('restart');
}

function renderLostResult() {
    console.log("renderLostResult: Rendering unsuccessful final result");
    //generate the html to display
    const headerHtml = "You lost! Dark Money is consuming our Democracy!";
    const imgHtml = $(`
        <img src="images/YouLost.png" alt="Black hole of money" class="youLostImg">
    `);

    //insert html into the dom
    $('h2').html(headerHtml);
    $('#dark-money').empty();
    $('#dark-money').removeClass('inner-container');
    $('#dark-money').addClass('you-lost-box');
    $('#dark-money').append(imgHtml);
}

function renderWonResult() {
    console.log("renderWonResult: Rendering successful final result");
    //generate the html to display
    const headerHtml = "You won! Our elections can't be bought!";
    const imgHtml = $(`
        <img src="images/YouWon.png" alt="Statue of Liberty" class="youWonImg">
    `);

    //insert html into the dom
    $('h2').html(headerHtml);
    $('#dark-money').empty();
    $('#dark-money').removeClass('inner-container');
    $('#dark-money').addClass('you-won-box');
    $('#dark-money').append(imgHtml);
}

function renderStartPage() {
    console.log("renderStartPage: Rendering start page again");
    //generate the html to display
    const headerHtml = "Can you save our Democracy?";
    const imgHtml = $(`
        <img src="images/DarkMoney.png" alt="Dark Money spooky image" class="darkMoneyImg">
        <img src="images/EleanorRooseveltQuote.png" alt="Quote about education" class="eleanorQuoteImg">
    `);

    //insert html into the dom
    $('h2').html(headerHtml);
    $('#dark-money').empty();
    $('#dark-money').addClass('inner-container');
    $('#dark-money').append(imgHtml);
    $('#dark-money').removeClass('you-lost-box');
    $('#dark-money').addClass('black-box');
    renderButton('start');
}

//********************************************************* */
//                HANDLE FUNCTIONS
//********************************************************* */
function handleQuestion() {
    console.log("handleQuestion: Handling the question");
    if (DATA.questionNum <= DATA.questions.length) {
        console.log("handleQuestion: Only increment question if questionNum <= num Questions");
        incrQuestion();
    } else {
        console.log("handleQuestion: Don't increment question");
    }
}

function handleAnswer(answer) {
    console.log("handleAnswer: Handling the selected answer");
    //report whether the answer is right or wrong
    if (DATA.questionIndex < DATA.questions.length) {
        //get expected answer from DATA object
        const questionAndOptions = DATA.questions[DATA.questionIndex];
        const optionsArr = questionAndOptions.options;
        const curCorrectAnswer = questionAndOptions.correctAnswer;
        console.log("handleAnswer: correct answer = " + curCorrectAnswer);
        console.log("handleAnswer: answer = " + answer);
        //compare answer to correct answer, then return 0/1 (pass/fail)
        if (answer.localeCompare(curCorrectAnswer) == 0) {
            incrScore();
            console.log("handleAnswer: PASS: Answer is correct");
            return 0;
        } else {
            console.log("handleAnswer: FAIL: Answer is wrong");
            return 1;
        }
    }
}

//********************************************************* */
//                UTILITY FUNCTIONS
//********************************************************* */
// The following functions are used by the above functions.

//increment score 
function incrScore() {
    DATA['score'] = DATA.score + 1;
    console.log("incrScore: Incrementing score to " + DATA.score);
}

//increment question index & number displayed to user
function incrQuestion() {
    console.log("incrQuestion: Incrementing questionIndex and questionNum")
    DATA['questionIndex'] = DATA.questionIndex + 1;
    DATA['questionNum'] = DATA.questionNum + 1;
    console.log("incrQuestion: Updating question index to " + DATA.questionIndex);
    console.log("incrQuestion: Updating question number to " + DATA.questionNum);
}

//reset the score and question
function resetScore() {
    console.log("resetScore: Resetting score");
    DATA['score'] = 0;
}

function resetQuestion() {
    console.log("resetQuestion: Resetting question numbering");
    DATA['questionIndex'] = 0;
    DATA['questionNum'] = 1;  
}

//********************************************************* */
//               RUN QUIZ 
//********************************************************* */
function runQuiz() {
    //listen for major events
    listenStartButton();
    listenSubmitButton();
    listenNextButton();
    listenRestartButton();
}

$(runQuiz);