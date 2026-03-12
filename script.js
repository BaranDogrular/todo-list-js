let tasks = []

const input = document.getElementById("taskInput")
const addBtn = document.getElementById("addBtn")
const list = document.getElementById("taskList")

addBtn.addEventListener("click", addTask)

input.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        addTask()
    }
})

function addTask(){

    const text = input.value.trim()

    if(text === "") return

    tasks.push(text)

    createTaskElement(text)

    saveTasks()

    updateTaskCount()

    input.value = ""
}

function createTaskElement(text){

    const li = document.createElement("li")
    li.innerText = text

    li.draggable = true

    li.addEventListener("dragstart", () => {
        li.classList.add("dragging")
    })

    li.addEventListener("dragend", () => {
        li.classList.remove("dragging")
    })


    const deleteBtn = document.createElement("button")
    deleteBtn.textContent = "Sil"
    deleteBtn.onclick = function(){
        li.remove()
        tasks = tasks.filter(t => t !== text)
        saveTasks()
        updateTaskCount()
    }
    li.appendChild(deleteBtn)

  
    li.addEventListener("click", function(){
        li.classList.toggle("completed")
    })

   
    li.addEventListener("dblclick", function(){
        const newText = prompt("Görevi düzenle:", text)
        if(newText){
            li.childNodes[0].nodeValue = newText
            tasks = tasks.map(t => t === text ? newText : t)
            saveTasks()
        }
    })

    list.appendChild(li)
}

function saveTasks(){
    localStorage.setItem("tasks", JSON.stringify(tasks))
}

function loadTasks(){

    const data = localStorage.getItem("tasks")
    if(data){
        tasks = JSON.parse(data)
    }

    tasks.forEach(task => {
        createTaskElement(task)
    })

    updateTaskCount()
}

function updateTaskCount(){
    document.getElementById("taskCount").innerText =
    tasks.length + " görev"
}


function filterTasks(type){
    const items = document.querySelectorAll("#taskList li")
    items.forEach(li => {
        if(type === "all") li.style.display = "block"
        if(type === "active") li.style.display = li.classList.contains("completed") ? "none" : "block"
        if(type === "completed") li.style.display = li.classList.contains("completed") ? "block" : "none"
    })
}

function clearAll(){
    tasks = []
    list.innerHTML = ""
    saveTasks()
    updateTaskCount()
}

function toggleDarkMode(){
    document.body.classList.toggle("dark")
}

list.addEventListener("dragover", (e) => {
    e.preventDefault()
    const dragging = document.querySelector(".dragging")
    const afterElement = getDragAfterElement(list, e.clientY)
    if(afterElement == null){
        list.appendChild(dragging)
    }else{
        list.insertBefore(dragging, afterElement)
    }
})

function getDragAfterElement(container, y){
    const elements = [...container.querySelectorAll("li:not(.dragging)")]
    return elements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2
        if(offset < 0 && offset > closest.offset){
            return {offset: offset, element: child}
        }else{
            return closest
        }
    }, {offset: Number.NEGATIVE_INFINITY}).element
}


loadTasks()