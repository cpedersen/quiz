//********************************************************* */
//                LISTENER FUNCTIONS
//********************************************************* */
// The following functions listen for click button events.
function listenStartButton() {
    $('body').on('click', '#start', function (event) {
        $('.darkMoneyImg').hide();
        $('.eleanorQuoteImg').hide();
        $('#dark-money').removeClass('black-box');
        $('#dark-money').removeClass('ask-question');
        renderQuestionAndOptions();
        renderScorecard('reset');
    });
}

function listenSubmitButton() {
    $('body').on('submit', '#quiz-form', function (event) {
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
    $('body').on('click', '#next', function (event) {
        renderQuestionAndOptions();
        renderScorecard();   
    });
}

function listenRestartButton() {
    $('body').on('click', '#restart', function (event) {
        resetScore();
        resetQuestion();
        renderStartPage();
        renderScorecard('hide');
        listenStartButton();
    });
}

//********************************************************* */
//                RENDER FUNCTIONS
//********************************************************* */
function renderScorecard(option) {
    if (option === 'hide') {
        $('.scorecard').hide();
    } else {
        if (option === 'reset') {
            resetScore();
            resetQuestion();
        } 
        if (DATA.questionNum <= DATA.questions.length) {
            //create content in html format, then insert into the dom
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
    //get options to display
    const questionAndOptions = DATA.questions[DATA.questionIndex];
    const questionText = questionAndOptions.question;
    $('h2').html(questionText);
}

function renderQuestionAndOptions(option) {
    if (DATA.questionIndex < DATA.questions.length) {
        //user needs a new question/options 
        renderNewQuestionAndOptions();
    } else {
        //user needs the final result displayed
        renderFinalResult();
    }
}

function renderNewQuestionAndOptions() {
    //get options to display
    const questionAndOptions = DATA.questions[DATA.questionIndex];
    const questionText = questionAndOptions.question;
    const optionsArr = questionAndOptions.options;

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
    let buttonHtml = "";
    if (option === "next") {
        buttonHtml = $(`
            <button id="next" type="button" class="button">Next</button>
        `);
        $('#submit').hide();
        $('#quiz-form').append(buttonHtml);
    } else if (option === "start") {
        buttonHtml = $(`
            <button id="start" type="button" class="button">Start</button>
        `);

        $('#restart').hide();
        $('#quiz-form').append(buttonHtml);

    } else if (option === "restart") {
        buttonHtml = $(`
            <button id="restart" type="button" class="button">Restart</button>
        `);
        $('#next').hide();
        $('#quiz-form').append(buttonHtml);
    }
}

function renderAnswer(answer) {
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
    //generate the html to display
    const headerHtml = "Great job! You are lighting the way for Democracy.";
    const answerHtml = $(`<img src="images/AnswerYes.png" alt="Woman shines light" class="WomanLightImg">`);

    //insert html into the dom
    $('h2').html(headerHtml);
    $('#dark-money').removeClass('inner-container');
    $('#dark-money').append(answerHtml);
}

function renderWrongAnswer() {
    //get the correct answer
    const questionAndOptions = DATA.questions[DATA.questionIndex];
    const optionsArr = questionAndOptions.options;
    const curCorrectAnswer = questionAndOptions.correctAnswer;

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
    //get the final results
    if (DATA.score === DATA.questions.length) {
        renderWonResult();
    } else {
        renderLostResult();
    }
    renderButton('restart');
}

function renderLostResult() {
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
    if (DATA.questionNum <= DATA.questions.length) {
        incrQuestion();
    } 
}

function handleAnswer(answer) {
    //report whether the answer is right or wrong
    if (DATA.questionIndex < DATA.questions.length) {
        //get expected answer from DATA object
        const questionAndOptions = DATA.questions[DATA.questionIndex];
        const optionsArr = questionAndOptions.options;
        const curCorrectAnswer = questionAndOptions.correctAnswer;
        //compare answer to correct answer, then return 0/1 (pass/fail)
        if (answer.localeCompare(curCorrectAnswer) == 0) {
            incrScore();
            return 0;
        } else {
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
}

//increment question index & number displayed to user
function incrQuestion() {
    DATA['questionIndex'] = DATA.questionIndex + 1;
    DATA['questionNum'] = DATA.questionNum + 1;
}

//reset the score and question
function resetScore() {
    DATA['score'] = 0;
}

function resetQuestion() {
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