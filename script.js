// --- APPLICATION DATA ---
const CREW_DATA = [
    { id: '1111', name: 'Fadi Saliba' },
    { id: '2222', name: 'Wajih Aburislan' },
    { id: '3333', name: 'Kifah' },
    { id: '4444', name: 'Yassin' },
    { id: '5555', name: 'Angie' },
    { id: '6666', name: 'Bassma' },
    { id: '7777', 'name': 'Sana' },
    { id: '8888', name: 'Ali' },
    { id: '9999', name: 'Wisam' },
    { id: '1010', name: 'Mhd' }
];

const SAFETY_QUESTIONS = [
    {
        q: "What indicates that the PBE oxygen supply time has finished?",
        options: ["A loud whistle sound", "Increase of temperature, breathing resistance, and PBE deflates", "The neck seal widens"],
        answer: "Increase of temperature, breathing resistance, and PBE deflates"
    },
    {
        q: "After activating the PBE oxygen flow, approximately how long does the slight hissing sound last?",
        options: ["5 seconds", "50 seconds", "Until the PBE is removed"],
        answer: "50 seconds"
    },
    {
        q: "What is a required step to activate the oxygen flow after donning the PBE?",
        options: ["Close the observation window", "Pull down the lanyard", "Remove the vacuum bag"],
        answer: "Pull down the lanyard"
    },
    {
        q: "What is the immediate WARNING after removing a PBE?",
        options: ["Immediately place it in a wet area", "Do not smoke or expose yourself to fire", "Place it near a source of heat to dry"],
        answer: "Do not smoke or expose yourself to fire"
    }
];

const FIRST_AID_QUESTIONS = [
    {
        q: "What is the required action if an adult or child (>1 year) casualty shows signs of mild airway obstruction (effective cough)?",
        options: ["Give 5 back blows immediately", "Start CPR", "Encourage them to continue coughing"],
        answer: "Encourage them to continue coughing"
    },
    {
        q: "For a conscious adult with severe airway obstruction, where should abdominal thrusts be placed?",
        options: ["On the breastbone (sternum)", "Between the navel (umbilicus) and the bottom end of the sternum", "Just below the ribs"],
        answer: "Between the navel (umbilicus) and the bottom end of the sternum"
    },
    {
        q: "If 5 back blows fail to relieve severe airway obstruction in a conscious adult, what is the next action (up to 5 times)?",
        options: ["Start CPR immediately", "Give 5 chest compressions", "Give 5 abdominal thrusts"],
        answer: "Give 5 abdominal thrusts"
    },
    {
        q: "For pregnant women with severe airway obstruction, what should replace abdominal thrusts?",
        options: ["Nothing, only 5 back blows are used", "Chest thrusts", "Use the Heimlich maneuver gently"],
        answer: "Chest thrusts"
    }
];

// --- STATE MANAGEMENT ---
let loggedInUser = null;
let selectedQuestions = [];
const ADMIN_EMAIL = 'wajeehaborslan6@gmail.com'; // تم تثبيت الإيميل

// --- TIMER VARIABLES ---
const TOTAL_TEST_TIME = 40; // 40 ثانية إجمالي
let timeRemaining = TOTAL_TEST_TIME;
let countdownInterval;
let answersSubmitted = false;
// --- END TIMER VARIABLES ---


// --- DOM ELEMENTS ---
const loginScreen = document.getElementById('login-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const loginForm = document.getElementById('login-form');
const quizForm = document.getElementById('quiz-form');
const loginError = document.getElementById('login-error');
const logoutButton = document.getElementById('logout-button'); 
const timerDisplay = document.getElementById('countdown-timer'); 


// --- HELPER FUNCTIONS ---
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function renderQuestion(question, qTextId, qOptionsId, namePrefix) {
    document.getElementById(qTextId).textContent = question.q;
    const optionsContainer = document.getElementById(qOptionsId);
    optionsContainer.innerHTML = '';
    
    const shuffledOptions = shuffle([...question.options]);

    shuffledOptions.forEach((option, index) => {
        const inputId = `${namePrefix}-option-${index}`;
        const label = document.createElement('label');
        label.setAttribute('for', inputId);
        
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.id = inputId;
        radio.name = namePrefix;
        radio.value = option;
        radio.required = true;
        
        label.appendChild(radio);
        label.appendChild(document.createTextNode(option));
        optionsContainer.appendChild(label);
    });
}

/**
 * Updates timer display and handles timeout.
 */
function updateTimer() {
    timeRemaining--;
    timerDisplay.textContent = `Time Left: ${timeRemaining}s`;

    if (timeRemaining <= 10) {
        timerDisplay.style.color = 'red';
    } else {
         timerDisplay.style.color = 'black';
    }

    if (timeRemaining <= 0) {
        clearInterval(countdownInterval);
        alert("Time's up for the entire test! Submitting your answers now.");
        
        // Force submission after timeout
        quizForm.dispatchEvent(new Event('submit'));
    }
}

/**
 * Initializes the quiz by selecting, displaying questions, and starting the main timer (40s).
 */
function startQuiz() {
    // Reset timer and state
    timeRemaining = TOTAL_TEST_TIME;
    timerDisplay.textContent = `Time Left: ${timeRemaining}s`;
    timerDisplay.style.color = 'black';
    answersSubmitted = false;

    const safeIndex = Math.floor(Math.random() * SAFETY_QUESTIONS.length);
    const safetyQ = SAFETY_QUESTIONS[safeIndex];

    const firstAidIndex = Math.floor(Math.random() * FIRST_AID_QUESTIONS.length);
    const firstAidQ = FIRST_AID_QUESTIONS[firstAidIndex];

    selectedQuestions = [safetyQ, firstAidQ];

    renderQuestion(safetyQ, 'q1-text', 'q1-options', 'answer1');
    renderQuestion(firstAidQ, 'q2-text', 'q2-options', 'answer2');

    // Start the single overall 40-second timer
    countdownInterval = setInterval(updateTimer, 1000); 
}


/**
 * Common function to handle the logout logic.
 */
function handleLogout() {
    // Stop timer interval if running
    clearInterval(countdownInterval);
    
    // 1. Clear user data and state
    loggedInUser = null; 
    selectedQuestions = [];
    answersSubmitted = false;
    
    // 2. Clear Quiz screen content (if any)
    quizForm.reset(); 

    // 3. Switch screens: Hide others, show login
    resultsScreen.style.display = 'none';
    quizScreen.style.display = 'none';
    loginScreen.classList.add('active'); 
    
    // 4. Optional cleanup
    document.getElementById('crew-id').value = '';
    document.getElementById('login-error').textContent = '';
}


// --- EVENT HANDLERS ---

// 1. Handle Login Form Submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const crewId = document.getElementById('crew-id').value.trim();
    const user = CREW_DATA.find(crew => crew.id === crewId);

    if (user) {
        loggedInUser = user;
        loginError.textContent = '';
        
        document.getElementById('welcome-message').textContent = `Welcome, ${loggedInUser.name}`;

        loginScreen.classList.remove('active');
        quizScreen.style.display = 'block';

        startQuiz(); // Start quiz and timer

    } else {
        loginError.textContent = 'Invalid Crew ID. Please check your number.';
    }
});

// 2. Handle Quiz Form Submission (Answer Check & Email Generation)
quizForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (answersSubmitted) return;
    answersSubmitted = true;
    
    // Stop the running timer upon manual submission
    clearInterval(countdownInterval);

    // Get answers (or set "Not Answered" if timer forced submission)
    const q1Answer = document.querySelector('input[name="answer1"]:checked')?.value || 'Not Answered (Timeout)';
    const q2Answer = document.querySelector('input[name="answer2"]:checked')?.value || 'Not Answered (Timeout)';

    const q1Correct = (q1Answer === selectedQuestions[0].answer);
    const q2Correct = (q2Answer === selectedQuestions[1].answer);
    
    // Generate results table for email body
    const resultsTable = 
        `Test Results for ${loggedInUser.name} (${loggedInUser.id})\n\n` +
        `----------------------------------------------------------------------\n` +
        `| Category  | Question | Result | Crew Answer | Correct Answer |\n` +
        `----------------------------------------------------------------------\n` +
        `| Safety    | ${selectedQuestions[0].q.substring(0, 30)}... | ${q1Correct ? 'Correct' : 'Incorrect'} | ${q1Answer.substring(0, 30)}... | ${selectedQuestions[0].answer.substring(0, 30)}... |\n` +
        `| First Aid | ${selectedQuestions[1].q.substring(0, 30)}... | ${q2Correct ? 'Correct' : 'Incorrect'} | ${q2Answer.substring(0, 30)}... | ${selectedQuestions[1].answer.substring(0, 30)}... |\n` +
        `----------------------------------------------------------------------\n` +
        `| Overall Score | | ${q1Correct + q2Correct}/2 |\n` +
        `----------------------------------------------------------------------`;
    
    const emailSubject = encodeURIComponent(`Crew Test Result: ${loggedInUser.name} (${loggedInUser.id})`);
    const emailBody = encodeURIComponent(resultsTable);

    const mailtoLink = `mailto:${ADMIN_EMAIL}?subject=${emailSubject}&body=${emailBody}`;

    // Switch to results screen and open the email client
    quizScreen.style.display = 'none';
    resultsScreen.style.display = 'block';

    alert("A new email window will open. PLEASE press the 'SEND' button inside that email to submit your results.");

    window.location.href = mailtoLink;
});

// 3. Handle Logout Button
logoutButton.addEventListener('click', handleLogout);