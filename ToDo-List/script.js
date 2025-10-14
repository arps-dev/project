const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const pendingList = document.getElementById("pendingList");
const completedList = document.getElementById("completedList");

addBtn.addEventListener("click", addTask);

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleString();
}

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  const li = document.createElement("li");
  const taskInfo = document.createElement("div");
  taskInfo.classList.add("task-info");
  taskInfo.innerHTML = `<strong>${taskText}</strong><div class="task-time">Added: ${getCurrentTime()}</div>`;

  const btns = document.createElement("div");
  btns.classList.add("buttons");

  const completeBtn = document.createElement("button");
  completeBtn.innerHTML = "✅";
  completeBtn.onclick = () => completeTask(li, taskText);

  const editBtn = document.createElement("button");
  editBtn.innerHTML = "✏️";
  editBtn.onclick = () => editTask(li, taskText);

  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "🗑️";
  deleteBtn.onclick = () => li.remove();

  btns.append(completeBtn, editBtn, deleteBtn);
  li.append(taskInfo, btns);
  pendingList.appendChild(li);

  taskInput.value = "";
}

function completeTask(li, taskText) {
  li.remove();

  const completedLi = document.createElement("li");
  completedLi.classList.add("completed");

  const taskInfo = document.createElement("div");
  taskInfo.classList.add("task-info");
  taskInfo.innerHTML = `<strong>${taskText}</strong><div class="task-time">Completed: ${getCurrentTime()}</div>`;

  const btns = document.createElement("div");
  btns.classList.add("buttons");

  const editBtn = document.createElement("button");
  editBtn.innerHTML = "✏️";
  editBtn.onclick = () => editTask(completedLi, taskText, true);

  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "🗑️";
  deleteBtn.onclick = () => completedLi.remove();

  btns.append(editBtn, deleteBtn);
  completedLi.append(taskInfo, btns);
  completedList.appendChild(completedLi);
}

function editTask(li, oldText, isCompleted = false) {
  const newText = prompt("Edit your task:", oldText);
  if (newText === null || newText.trim() === "") return;

  li.querySelector(".task-info strong").textContent = newText.trim();
  if (isCompleted) {
    li.querySelector(".task-time").textContent = `Edited: ${getCurrentTime()}`;
  } else {
    li.querySelector(".task-time").textContent = `Updated: ${getCurrentTime()}`;
  }
}
