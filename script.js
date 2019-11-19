//********************************************************* */
//                LISTENER FUNCTIONS
//********************************************************* */
// The following functions listen for events.
function listenStartButton() {
    console.log("Listening for Start button click");
    //listen for start event
    $('body').on('click', '.start', function (event) {
        console.log("Hiding and toggling elements after selecting Start button")
        //hide start page elements
        $('.darkMoneyImg').hide();
        $('.eleanorQuoteImg').hide();
        $('#dark-money').removeClass('black-box');
        $('#dark-money').removeClass('ask-question');
        //display quiz
        renderQuestionAndOptions();
        renderScorecard();
    });
}

//no longer using
function listenRadioButton() {
    console.log("Listening for Radio button click");
    $('body').on('click', '#option', function (event) {
        //TODO - would like to use the index for the answer, not the text
        const answerText = $("input[type='radio']:checked").val();
        //const answers = $("#quiz-form input:radio[name='option']");
        //console.log(JSON.stringify(answers));
        //console.log("answers = " + answers);
        //const answer = answers.index(answers) 
        console.log("answerText = " + answerText);
        //renderScorecard();
        //console.log("answer = " + answerText);
        return answerText;
    });
    //if (!answer) {
    //    alert("Please choose an option");
    //return;
    //}
}

function listenSubmitButton() {
    console.log("Listening for Submit button click");
    $('body').on('click', '#submit', function (event) {
        //don't submit to a server
        event.preventDefault();
        //listen for user selection of an answer
        const answer = $("input[type='radio']:checked").val();
        console.log("answer = " + answer);
        renderAnswer(answer);
        renderScorecard();
    });
}

function listenNextButton() {
    console.log("Listening for Next button click");
    $('body').on('click', '.next', function (event) {
        renderButton('next');
        renderScorecard();
        renderQuestionAndOptions();
    });
}

function listenRestartButton() {
    console.log("Listening for Restart button click");
    $('body').on('click', '.restart', function (event) {
        resetQuiz();
        //bring back start page elements
        $('.darkMoneyImg').show();
        $('.eleanorQuoteImg').show();
        $('#dark-money').addClass('black-box');
        $('#dark-money').addClass('ask-question');
        renderButton('start');
    });
}

//********************************************************* */
//                RENDER FUNCTIONS
//********************************************************* */
function renderScorecard() {
    console.log("Rendering scorecard");

    //create content in html format, then insert into the dom
    console.log("question index = " + DATA.questionIndex);
    console.log("score = " + DATA.score);
    const htmlToInsert = $(`
    <p id="question">Question: ${DATA.questionIndex}/${DATA.questions.length}</p> 
    <p id="score">Score: ${DATA.score}/${DATA.questions.length}</p>`);
    $('.scorecard').html(htmlToInsert);
}

function renderQuestionAndOptions() {
    if (DATA.questionIndex < DATA.questions.length) {
        //user needs a new question/options 
        renderNewQuestionAndOptions();
    } else {
        //user needs the final result displayed
        renderButton('restart');
        renderFinalResult();
    }
}

function renderNewQuestionAndOptions() {
    console.log("Rendering new question/options, along with Submit button");

    //gather info
    console.log("question index = " + DATA.questionIndex);
    const questionAndOptions = DATA.questions[DATA.questionIndex];
    const questionText = questionAndOptions.question;
    console.log("questionText = " + questionText);
    const optionsArr = questionAndOptions.options;
    console.log("optionsArr = " + optionsArr);

    //create question/options quiz form
    //DEBUG3 - required isn't working
    const formHtml = $(`
        <form id="quiz-form" class="quiz-form">
            <ul style="list-style-type:none;">
                <li><input type="radio" name="options" id="option" value="${optionsArr[0]}"
                required>${optionsArr[0]}</li>
                <li><input type="radio" name="options" id="option" value="${optionsArr[1]}"
                required>${optionsArr[1]}</li>
                <li><input type="radio" name="options" id="option" value="${optionsArr[2]}"
                required>${optionsArr[2]}</li>
                <li><input type="radio" name="options" id="option" value="${optionsArr[3]}"
                required>${optionsArr[3]}</li>
            </ul>
            <button id="submit" type="submit" class="button">Submit</button>
        </form>
    `);

    //$('.button').html("Submit");
    //$('.button').addClass("submit");
    //return buttonHtml;
    //$('#dark-money').append(buttonHtml);
    //DEBUG1 - Various Submit button problems
    //display the submit button
    //buttonHtml = renderButton('submit');
    //$(buttonHtml).appendTo(formHtml);
    
    //insert html into the dom
    $('h2').html(questionText);
    $('#select-answer').html("Select the correct answer:");
    $('#possible-answers').html(formHtml);

    //increment questionIndex
    DATA['questionIndex'] = DATA.questionIndex + 1; 
}

function renderButton(option) {
    //DEBUG2 - render button issues
    console.log("Rendering button: " + option);
    if (option === "submit") {
        //$('#start').hide('.start');
        const buttonHtml = $(`
        <button id="submit" type="submit" class="button">Submit</button>
    `);
        //$('.button').html("Submit");
        //$('.button').addClass("submit");
        //return buttonHtml;
        $('#dark-money').append(buttonHtml);
    } else if (option === "next") {
        const buttonHtml = $(`
            <button id="next" type="button" class="button">Next</button>
        `);
        //$('#start').show('.start');
        //$('.button').html("Next");
        //$('.button').addClass("next");
        $('#button').hide();
        $('#dark-money').append(buttonHtml);
    } else if (option === "start") {
        const buttonHtml = $(`
            <button id="start" type="button" class="button">Start</button>
        `);
        //$('#start').show('.start');
        //$('.button').html("Start");
        //$('.button').addClass("start");
        $('#button').hide();
        $('#dark-money').append(buttonHtml);
    } else if (option === "restart") {
        const buttonHtml = $(`
            <button id="restart" type="button" class="button">Restart</button>
        `);
        //$('#start').show('.start');
        //$('.button').html("Restart");
        //$('.button').addClass("restart");
        $('#button').hide();
        $('#dark-money').append(buttonHtml);
    }
    //$('#button').empty();
    //$('.button').html(buttonHtml);
    
}

function renderAnswer() {
    console.log("renderAnswer");

    //call handleAnswer to get pass or fail

    //call either renderCorrectAnswer or renderWrongAnswer
    renderButton('next');
}

function renderCorrectAnswer(indexAnswer) {
    console.log("renderCorrectAnswer");

    //generate the html to display

    //insert html into the dom

}

function renderWrongAnswer(indexAnswer) {
    console.log("renderWrongAnswer");
    //generate the html to display

    //insert html into the dom
}

function renderFinalResult() {
    console.log("Rendering final result, along with Restart button");

    if (result === true) {
        renderWonResult();
    } else {
        renderLostResult();
    }
    renderButton('restart');
}

function renderLostResult() {
console.log("renderLostResult");
    //generate the html to display

    //insert html into the dom

}

function renderWonResult() {
    console.log("renderWrongResult");
    //generate the html to display

    //insert html into the dom
}


//********************************************************* */
//                HANDLE FUNCTIONS
//********************************************************* */
function handleAnswer(answer) {
    console.log("Handling the selected answer");
    console.log("number of questions = " + DATA.questions.length);

    //compare answer to expected answer
    //result = 0 or 1

    //update DATA object with result

    if (DATA.questionIndex < DATA.questions.length) {
        console.log("question index = " + DATA.questionIndex);
        const questionAndOptions = DATA.questions[DATA.questionIndex];
        const questionText = questionAndOptions.question;
        console.log("questionText = " + questionText);
        const optionsArr = questionAndOptions.options;
        console.log("optionsArr = " + optionsArr);
    }

    //console.log("User selection: " + option);

    //Get the current question and answer
    let currentQuestion = DATA.questions[DATA.questionIndex];



    //return pass or fail
}


//********************************************************* */
//                UTILITY FUNCTIONS
//********************************************************* */
// The following functions are used by the above functions.
function updateScorecard(score) {
    //increment score
    score++;

    //display score
    $('.score').text(score);
}

//keep track of which question we're on
function updateQuestion() {

}

//reset the score and question number we're on
function resetQuiz() {
    DATA['score'] = 0;
    DATA['questionIndex'] = 0;
}



//********************************************************* */
//               RUN QUIZ 
//********************************************************* */
function runQuiz() {
    //listen for major events
    listenStartButton();
    listenSubmitButton();
    /*istenNextButton();*/
    /*listenRestartButton();*/
}

$(runQuiz);