// ------------------------
// Sections & Questions
// ------------------------
const sections = [
    {
        title: "Interests & Passion",
        questions: [
            { q: "Do you enjoy working with numbers?", category: "math" },
            { q: "Do you like reading, writing, or analyzing texts?", category: "literature" },
            { q: "Do you enjoy creative activities like art, music, or design?", category: "creative" },
            { q: "Do you enjoy science experiments or research?", category: "science" }
        ]
    },
    {
        title: "Skills & Strengths",
        questions: [
            { q: "Are you good at problem-solving?", category: "problem_solving" },
            { q: "Do you have strong communication skills?", category: "communication" },
            { q: "Do you enjoy organizing and planning tasks?", category: "organization" },
            { q: "Do you like coding or using technology?", category: "tech" }
        ]
    },
    {
        title: "Personality & Work Style",
        questions: [
            { q: "Do you enjoy working in teams?", category: "teamwork" },
            { q: "Do you prefer routine tasks?", category: "routine" },
            { q: "Do you enjoy helping others?", category: "helping" },
            { q: "Do you enjoy leading and influencing people?", category: "leadership" }
        ]
    },
    {
        title: "Lifestyle & Environment",
        questions: [
            { q: "Do you prefer working indoors?", category: "indoors" },
            { q: "Do you like flexible and creative schedules?", category: "flexibility" },
            { q: "Do you enjoy fast-paced environments?", category: "fast_paced" }
        ]
    },
    {
        title: "Future Goals & Career Preferences",
        questions: [
            { q: "Do you want a high earning potential career?", category: "earning" },
            { q: "Do you want a career focused on research?", category: "research" },
            { q: "Do you want a career focused on helping others?", category: "impact" }
        ]
    }
];

// ------------------------
// DOM Elements
// ------------------------
const sectionTitle = document.getElementById("section-title");
const questionContainer = document.getElementById("quiz-container");
const nextBtn = document.getElementById("next-btn");

// ------------------------
// Quiz State
// ------------------------
let currentSectionIndex = 0;
let currentQuestionIndex = 0;
let answers = {};

// ------------------------
// Home Screen
// ------------------------
function showHomeScreen() {
    sectionTitle.textContent = "Find Your Ideal Major";
    questionContainer.innerHTML = `
        <div class="text-center">
            <p class="nav-fonta mb-4 text-lg">Take this quiz to discover the majors that suit you best!</p>
            <button id="startBtn" class="mt-4 px-6 py-3 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition">Start Quiz</button>
        </div>
    `;
    nextBtn.style.display = "none";

    document.getElementById("startBtn").addEventListener("click", () => {
        currentSectionIndex = 0;
        currentQuestionIndex = 0;
        answers = {};
        nextBtn.style.display = "block";
        showQuestion();
    });
}

// ------------------------
// Show Question (Horizontal Likert)
// ------------------------
function showQuestion() {
    const section = sections[currentSectionIndex];
    const question = section.questions[currentQuestionIndex];

    sectionTitle.textContent = section.title;

    const scale = [
        { text: "Strongly Disagree", value: 0, color: "bg-red-400"},
        { text: "Disagree", value: 1, color: "bg-orange-400" },
        { text: "Neutral", value: 2, color: "bg-yellow-400" },
        { text: "Agree", value: 3, color: "bg-green-400" },
        { text: "Strongly Agree", value: 4, color: "bg-blue-400" }
    ];

    let buttonsHTML = scale.map(s =>
        `<button class="nav-font answerBtn flex-1 py-3 rounded-lg text-white font-semibold transition transform duration-200 hover:scale-105 ${s.color}" data-value="${s.value}">${s.text}</button>`
    ).join("");

    questionContainer.innerHTML = `
        <p class="nav-font mb-6 font-medium text-lg">${question.q}</p>
        <div class=" nav-fonta flex gap-2">
            ${buttonsHTML}
        </div>
    `;

    const buttons = questionContainer.querySelectorAll(".answerBtn");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            answers[question.category] = parseInt(btn.dataset.value);

            // Clear previous selection
            buttons.forEach(b => b.classList.remove(
                "bg-white", "text-black", "scale-105", "shadow-xl", "ring-4", "ring-blue-500"
            ));

            // Highlight selected button
            btn.classList.add(
                "bg-white", "text-black", "scale-105", "shadow-xl", "ring-4", "ring-blue-500"
            );
        });
    });
}

// ------------------------
// Show Section Results
// ------------------------
// ------------------------
// Show Section Results
// ------------------------
function showSectionResults(callback) {
    fetch("/calculate_final", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ answers })
    })
    .then(res => res.json())
    .then(data => {
        const resultsBox = document.getElementById("section-results");
        const resultsBars = document.getElementById("section-results-bars");

        // Clear previous bars
        resultsBars.innerHTML = "";

        // Insert top 3 majors
        data.forEach(item => {
            const barContainer = document.createElement("div");
            barContainer.className = "bg-white p-4 rounded-2xl shadow-lg w-full"; // make container full width
            barContainer.innerHTML = `
                <div class=" nav-font flex justify-between items-center mb-2 font-medium text-lg w-full">
                    <span>${item.major}</span>
                    <span>${item.percent}%</span>
                </div>
                <div class="nav-fonta w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                    <div class="bg-gradient-to-r from-blue-400 to-purple-500 h-6" style="width:0%; transition: width 1s;"></div>
                </div>
            `;

        

            resultsBars.appendChild(barContainer);

            // Animate the bar
            setTimeout(() => {
                barContainer.querySelector("div div").style.width = item.percent + "%";
            }, 100);
        });

        // Show results box
        resultsBox.classList.remove("hidden");
        resultsBox.scrollIntoView({ behavior: "smooth" });

        // Wait 2 seconds before moving to next section
        setTimeout(() => {
            resultsBox.classList.add("hidden"); // hide before next section
            callback();
        }, 2500);
    });
}


// ------------------------
// Next Button
// ------------------------
nextBtn.addEventListener("click", () => {
    const section = sections[currentSectionIndex];
    const question = section.questions[currentQuestionIndex];

    if (answers[question.category] === undefined) {
        alert("Please select an option!");
        return;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < section.questions.length) {
        showQuestion();
    } else {
        // Section complete: show results
        nextBtn.disabled = true;
        showSectionResults(() => {
            currentSectionIndex++;
            currentQuestionIndex = 0;
            nextBtn.disabled = false;

            if (currentSectionIndex < sections.length) {
                showQuestion();
            } else {
                // Quiz complete: show final top majors with confetti
                fetch("/calculate_final", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({ answers })
                })
                .then(res => res.json())
                .then(data => {
                    questionContainer.innerHTML = "<h2 class='text-2xl font-bold text-center mb-4'>Your Top 3 Majors</h2>";
                    data.forEach(item => {
                        const barContainer = document.createElement("div");
                        barContainer.className = "bg-white p-4 rounded-2xl shadow-lg mb-4";
                        barContainer.innerHTML = `
                            <div class="nav-fonta flex justify-between mb-2 font-medium text-lg">
                                <span>${item.major}</span>
                                <span>${item.percent}%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                                <div class="bg-gradient-to-r from-blue-400 to-purple-500 h-6" style="width:${item.percent}%; transition: width 1s;"></div>
                            </div>
                        `;
                        questionContainer.appendChild(barContainer);
                    });
                    launchConfetti();
                    nextBtn.style.display = "none";
                });
            }
        });
    }
});

// ------------------------
// Confetti Animation
// ------------------------
function launchConfetti() {
    const confettiCount = 150;
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");
        confetti.style.position = "absolute";
        confetti.style.width = "8px";
        confetti.style.height = "8px";
        confetti.style.backgroundColor = `hsl(${Math.random()*360}, 70%, 50%)`;
        confetti.style.top = "-10px";
        confetti.style.left = Math.random() * window.innerWidth + "px";
        confetti.style.opacity = Math.random();
        confetti.style.transform = `rotate(${Math.random()*360}deg)`;
        confetti.style.borderRadius = "50%";
        confetti.style.pointerEvents = "none";
        document.body.appendChild(confetti);

        const fallDuration = Math.random()*3 + 2;
        confetti.animate([
            { transform: `translateY(0px) rotate(${Math.random()*360}deg)` },
            { transform: `translateY(${window.innerHeight + 50}px) rotate(${Math.random()*720}deg)` }
        ], { duration: fallDuration*1000, iterations: 1, easing: 'linear' });

        setTimeout(() => { confetti.remove(); }, fallDuration*1000);
    }
}

// ------------------------
// Initialize
// ------------------------
showHomeScreen();





