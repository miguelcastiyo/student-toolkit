// Constants
const WEIGHTS = {
  programming: 0.10,
  labs: 0.15,
  quizzes: 0.15,
  midterm: 0.30,
  final: 0.30
};

const GRADE_RANGES = {
  'A': { min: 94, max: 100 },
  'A-': { min: 90, max: 93.99 },
  'B+': { min: 87, max: 89.99 },
  'B': { min: 84, max: 86.99 },
  'B-': { min: 80, max: 83.99 },
  'C+': { min: 77, max: 79.99 },
  'C': { min: 70, max: 76.99 },
  'D+': { min: 67, max: 69.99 },
  'D': { min: 64, max: 66.99 },
  'D-': { min: 61, max: 63.99 },
  'F': { min: 0, max: 60.99 }
};

// Helper Functions
function getGradeLetter(percentage) {
  for (const [letter, range] of Object.entries(GRADE_RANGES)) {
    if (percentage >= range.min && percentage <= range.max) {
      return letter;
    }
  }
  return 'F';
}

function getGradeRangeText(letter) {
  const range = GRADE_RANGES[letter];
  return `${letter} (${range.min} to ${range.max}%)`;
}

function clearResults() {
  document.getElementById("result").textContent = "";
  document.getElementById("explanation").innerHTML = "";
}

function displayResult(requiredFinal, explanation) {
  document.getElementById("result").textContent = `Required Final Grade: ${requiredFinal.toFixed(2)}%`;
  document.getElementById("explanation").innerHTML = explanation;
}

function createGradeDistributionList() {
  return `<p>Grade Distribution:</p>
          <ul>
            <li>Programming: 10%</li>
            <li>Labs: 15%</li>
            <li>Quizzes: 15%</li>
            <li>Midterm: 30%</li>
            <li>Final: 30%</li>
          </ul>`;
}

// Mode Toggle Handlers
document.getElementById("simple-mode-btn").addEventListener("click", function() {
  document.getElementById("simple-mode-btn").classList.add("active");
  document.getElementById("advanced-mode-btn").classList.remove("active");
  document.getElementById("simple-grade-form").classList.replace("hidden-form", "active-form");
  document.getElementById("advanced-grade-form").classList.replace("active-form", "hidden-form");
  clearResults();
});

document.getElementById("advanced-mode-btn").addEventListener("click", function() {
  document.getElementById("advanced-mode-btn").classList.add("active");
  document.getElementById("simple-mode-btn").classList.remove("active");
  document.getElementById("advanced-grade-form").classList.replace("hidden-form", "active-form");
  document.getElementById("simple-grade-form").classList.replace("active-form", "hidden-form");
  clearResults();
});

// Simple Mode Calculator
document.getElementById("simple-grade-form").addEventListener("submit", function(e) {
  e.preventDefault();
  
  const current = parseFloat(document.getElementById("currentGrade").value);
  const desiredGradeValue = parseFloat(document.getElementById("simpleDesiredGrade").value);
  
  if (isNaN(current) || isNaN(desiredGradeValue)) {
    alert("Please fill in all fields with valid numbers");
    return;
  }
  
  const currentWeight = WEIGHTS.programming + WEIGHTS.labs + WEIGHTS.quizzes + WEIGHTS.midterm;
  const requiredFinal = (desiredGradeValue - (current * currentWeight)) / WEIGHTS.final;
  
  document.getElementById("result").textContent = `Required Final Grade: ${requiredFinal.toFixed(2)}%`;
});

// Advanced Mode Calculator
document.getElementById("advanced-grade-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const grades = {
    programming: parseFloat(document.getElementById("programmingGrade").value),
    labs: parseFloat(document.getElementById("labsGrade").value),
    quizzes: parseFloat(document.getElementById("quizzesGrade").value),
    midterm: parseFloat(document.getElementById("midtermGrade").value)
  };
  
  const desiredGradeValue = parseFloat(document.getElementById("advancedDesiredGrade").value);

  if (Object.values(grades).some(isNaN) || isNaN(desiredGradeValue)) {
    alert("Please fill in all fields with valid numbers");
    return;
  }

  const currentContribution = Object.entries(grades).reduce(
    (sum, [key, value]) => sum + (value * WEIGHTS[key]), 0
  );

  let requiredFinal = (desiredGradeValue - currentContribution) / WEIGHTS.final;

  if (requiredFinal > grades.midterm) {
    const currentWithoutMidterm = currentContribution - (grades.midterm * WEIGHTS.midterm);
    requiredFinal = (desiredGradeValue - currentWithoutMidterm) / (WEIGHTS.final + WEIGHTS.midterm);
  }

  document.getElementById("result").textContent = `Required Final Grade: ${requiredFinal.toFixed(2)}%`;
});
