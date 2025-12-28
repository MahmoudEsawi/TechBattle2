(function() {
    var bool = [true, true, true, true, true, true, true, true];
    var button = "";
    var correct = new Audio("../assets/sounds/correct_answer.mp3");
    var wrong = new Audio("../assets/sounds/wrong_answer.mp3");
    var TimerTickTock = new Audio("../assets/sounds/EchoingClockTick.mp3");
    let answersRoundOne = [ "Python", "C++", "Java", "C", "C#", "JavaScript"];     
    let answersRoundTwo = ["Facebook", "YouTube", "WhatsApp", "Instagram", "TikTok", "Messenger"];
    let answersRoundThree = ["China", "India", "United States", "Indonesia", "Pakistan","Nigeria"];
    let answersRoundFour =["Bubble sort","Insertion sort","Selection sort","Quick sort","Merge sort","Heap sort"];
    
    // Use questions from match file if available
    let timerQuestions;
    if (typeof MATCH_QUESTIONS !== 'undefined' && MATCH_QUESTIONS.timer) {
        timerQuestions = MATCH_QUESTIONS.timer;
    } else if (typeof TIMER_QUESTIONS !== 'undefined') {
        timerQuestions = TIMER_QUESTIONS;
    } else {
        timerQuestions = ["No questions loaded"];
    }
    let buzzerQuestions1 = (typeof BUZZER_QUESTIONS_A !== 'undefined') ? BUZZER_QUESTIONS_A : ["No questions loaded"];
    let buzzerQuestions2 = (typeof BUZZER_QUESTIONS_B !== 'undefined') ? BUZZER_QUESTIONS_B : ["No questions loaded"];
    let buzzerQuestions3 = (typeof BUZZER_QUESTIONS_C !== 'undefined') ? BUZZER_QUESTIONS_C : ["No questions loaded"];
    let buzzerQuestions4 = (typeof BUZZER_SEMI_A !== 'undefined') ? BUZZER_SEMI_A : ["No questions loaded"];
    let buzzerQuestions5 = (typeof BUZZER_SEMI_B !== 'undefined') ? BUZZER_SEMI_B : ["No questions loaded"];
    let buzzerQuestions6 = (typeof BUZZER_FINAL !== 'undefined') ? BUZZER_FINAL : ["No questions loaded"];
    
    let timerQuestionIndex = 0;
    
    if (document.getElementById("round") != null) {
        switch (document.getElementById("round").value) {
            case "2":
                answersRoundOne = answersRoundTwo;
                break;
            case "3":
                answersRoundOne = answersRoundThree;
                break;
            case "4":
                answersRoundOne = answersRoundFour;
                break;
        }
    }
    
    function first_answer(answer, buttonNumber) {
        button = "myButton" + buttonNumber;
        if (bool[buttonNumber - 1]) {
            document.getElementById(button).classList.toggle("test");
            document.getElementById('back'+buttonNumber).innerHTML = answer;
            correct.currentTime = 0;
            correct.play();
            bool[buttonNumber - 1] = false;
        }
    }

    document.addEventListener("keydown", function(event) {
        const key = event.key;

        if (key >= "1" && key <= "6") {
            first_answer(answersRoundOne[key - 1], key);
        }

        if (key === "x"||key === "X") {
            wrong.currentTime = 0;
            wrong.play();
            showWrongAnswerImage();
        }

        // T = Open Tournament page
        if (key === "t" || key === "T") {
            window.location.href = "./tournament.html";
        }

        if(key === "s" || key === "S"){
            timeLeft=30;
            $("#Seconds").text(timeLeft);
            timerCountDown();
            TimerTickTock.play();
            if($('.timer').hasClass("timer_stop")){
                $('.timer').removeClass("timer_stop");
            }            
            $("#Seconds").css("font-size","120px");
        }
        if(key === "r" || key === "R"){
            TimerTickTock.pause();
            TimerTickTock.currentTime=0;
            resetTimer();
        }
        if(key === 'n' || key === 'N'){
            resetTimer();
            TimerTickTock.pause();
            TimerTickTock.currentTime=0;
            timerQuestionIndex++;
            
            // Timer
            if(timerQuestionIndex >= timerQuestions.length) timerQuestionIndex = 0;
            $("#questionP").text(timerQuestions[timerQuestionIndex]);
            
            // Buzzer Round 1
            if(timerQuestionIndex < buzzerQuestions1.length) $("#questionAvsB").text(buzzerQuestions1[timerQuestionIndex]);
            if(timerQuestionIndex < buzzerQuestions2.length) $("#questionCvsD").text(buzzerQuestions2[timerQuestionIndex]);
            if(timerQuestionIndex < buzzerQuestions3.length) $("#questionEvsF").text(buzzerQuestions3[timerQuestionIndex]);
            
            // Buzzer Round 2 & Final
            if(timerQuestionIndex < buzzerQuestions4.length) $("#questionAvsB2").text(buzzerQuestions4[timerQuestionIndex]);
            if(timerQuestionIndex < buzzerQuestions5.length) $("#questionCvsD2").text(buzzerQuestions5[timerQuestionIndex]);
            if(timerQuestionIndex < buzzerQuestions6.length) $("#questionAvsB3").text(buzzerQuestions6[timerQuestionIndex]);
        }
        if(key === 'p' || key === 'P'){
            resetTimer();
            TimerTickTock.pause();
            TimerTickTock.currentTime=0;
            timerQuestionIndex--;
            
            if(timerQuestionIndex < 0) timerQuestionIndex = timerQuestions.length - 1;
            $("#questionP").text(timerQuestions[timerQuestionIndex]);
            
            // Buzzer Round 1
            if(timerQuestionIndex < buzzerQuestions1.length) $("#questionAvsB").text(buzzerQuestions1[timerQuestionIndex]);
            if(timerQuestionIndex < buzzerQuestions2.length) $("#questionCvsD").text(buzzerQuestions2[timerQuestionIndex]);
            if(timerQuestionIndex < buzzerQuestions3.length) $("#questionEvsF").text(buzzerQuestions3[timerQuestionIndex]);
            
            // Buzzer Round 2 & Final
            if(timerQuestionIndex < buzzerQuestions4.length) $("#questionAvsB2").text(buzzerQuestions4[timerQuestionIndex]);
            if(timerQuestionIndex < buzzerQuestions5.length) $("#questionCvsD2").text(buzzerQuestions5[timerQuestionIndex]);
            if(timerQuestionIndex < buzzerQuestions6.length) $("#questionAvsB3").text(buzzerQuestions6[timerQuestionIndex]);
        }
    });

    function showWrongAnswerImage() {
        const imageContainer = document.getElementById("wrong-answer-image-container");
        if(imageContainer) {
            imageContainer.style.display = "block";
            setTimeout(function() {
                imageContainer.style.display = "none";
            }, 1000); 
        }
    }

    // Initialize questions on page load
    $("#questionP").text(timerQuestions[0]);
    $("#questionAvsB").text(buzzerQuestions1[0]);
    $("#questionCvsD").text(buzzerQuestions2[0]);
    $("#questionEvsF").text(buzzerQuestions3[0]);
    $("#questionAvsB2").text(buzzerQuestions4[0]);
    $("#questionCvsD2").text(buzzerQuestions5[0]);
    $("#questionAvsB3").text(buzzerQuestions6[0]);

    let timeLeft = 3;
    function timerCountDown(){
        let timer = setInterval(function () {
            timeLeft--;
            $("#Seconds").text(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timer);
                $("#Seconds").css("font-size","50px");
                $("#Seconds").text("Time's Up!");
                $('.timer').addClass("timer_stop");
            }
        }, 1000);
    }

    function resetTimer(){
        timeLeft=0;
        if($('.timer').hasClass("timer_stop")){
            $('.timer').removeClass("timer_stop");
        }
        $("#Seconds").text("30");
        $("#Seconds").css("font-size","120px");
    }
    
    console.log('Timer loaded! Questions:', timerQuestions.length);
})();
