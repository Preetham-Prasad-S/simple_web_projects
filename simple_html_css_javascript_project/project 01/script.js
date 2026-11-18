console.log("StudyHub Javascript loaded")

const timer = document.getElementById("timer");

const startButton = document.getElementById("start-timer");

const pauseButton = document.getElementById("pause-timer");

const resetButton = document.getElementById("reset-timer");

const taskForm = document.querySelector(".tasks form");

const taskInput = document.getElementById("task");

const taskElements = document.querySelector(".tasks ul");

const completedTasks = document.getElementById("tasks-completed");

const totalTasks = document.getElementById("total-tasks");

const progressBar = document.getElementById("progress")

// Timer Logic

let timerInterval;

let timeRemaining = 25 * 60;

function updateTimer() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = String(timeRemaining % 60).padStart(2, "0");

    timer.textContent = `${minutes}:${seconds}`;
}

updateTimer();

startButton.addEventListener("click", function () {

    if(timerInterval){
        return;
    }

    timerInterval = setInterval(function () {
        timeRemaining--;
        updateTimer();

        if (timeRemaining <= 0){
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }, 1000)
})

pauseButton.addEventListener("click", function () {
    clearInterval(timerInterval);
    timerInterval = null
})

resetButton.addEventListener("click", function () {

    clearInterval(timerInterval);
    timerInterval = null;

    timeRemaining = 25 * 60; 

    timer.textContent = "25:00";
})


// Tasks and Progress Logic

const savedTasks = localStorage.getItem("data");

const tasks = savedTasks ? JSON.parse(savedTasks) : [];

updateProgress();

// const tasks = [
//     {
//         id : 1,
//         text: "Complete Javascript fundamentals",
//         completed : false
//     },
//     {
//         id : 2,
//         text: "Practice 5 DSA problems",
//         completed: false
//     },
//     {
//         id : 3,
//         text: "Complete one topic in Aptitude",
//         completed: false
//     }

// ];

function updateProgress() {

    let completedTasksCount = 0;

    let totalTasksCount = tasks.length;

    tasks.forEach(function (task) {
        if(task.completed === true){
            completedTasksCount++;
        }
    })

    completedTasks.textContent = completedTasksCount;

    totalTasks.textContent = totalTasksCount;

    const percentage = totalTasksCount === 0 ? 0 : (completedTasksCount / totalTasksCount) * 100;

    progressBar.value = percentage
}

function renderTask(task){
    const taskItem = document.createElement("li");
    taskItem.textContent = task.text

    if(task.completed){
        taskItem.classList.add("completed");
    }

    taskItem.addEventListener("click", function() {
        task.completed = !task.completed;

        taskItem.classList.toggle("completed");

        updateProgress();

        saveTasks();
    })

    const deleteItemButton = document.createElement("button");

    deleteItemButton.textContent = "Delete";
    deleteItemButton.classList.add("delete-button");

    deleteItemButton.addEventListener("click", function (event) {
            event.stopPropagation();

            const index = tasks.findIndex(function (item) {
                return item.id === task.id;
            })

            tasks.splice(index, 1);
        
            taskItem.remove();

            saveTasks();

            
        } )
    
    taskItem.appendChild(deleteItemButton);

    taskElements.appendChild(taskItem)

}

function saveTasks() {
    localStorage.setItem("data" , JSON.stringify(tasks));
}

tasks.forEach(function (task) {
    renderTask(task);
})



taskForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const taskText = taskInput.value.trim();

    if (taskText !== ""){

        const newTask = {
            id : tasks.length + 1,
            text : taskText,
            completed : false
        };

        tasks.push(newTask);

        renderTask(newTask);

        updateProgress();

        saveTasks();
    }

    taskInput.value = "";

    
});



