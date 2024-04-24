// DOM 요소 선택
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");

// 이벤트 리스너 등록
addTaskBtn.addEventListener("click", addTask);
taskList.addEventListener("click", handleTaskActions);

// 할 일 추가 함수
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText) {
    const taskItem = createTaskItem(taskText);
    taskList.appendChild(taskItem);
    taskInput.value = "";
  }
}

// 할 일 요소 생성 함수
function createTaskItem(text) {
  const taskItem = document.createElement("li");
  taskItem.className = "task-item";

  const taskText = document.createElement("span");
  taskText.className = "task-text";
  taskText.textContent = text;

  const editBtn = document.createElement("button");
  editBtn.className = "edit-btn";
  editBtn.textContent = "Edit";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "Delete";

  taskItem.appendChild(taskText);
  taskItem.appendChild(editBtn);
  taskItem.appendChild(deleteBtn);

  return taskItem;
}

// 할 일 요소 액션 처리 함수
function handleTaskActions(event) {
  const target = event.target;
  const taskItem = target.parentNode;

  if (target.classList.contains("edit-btn")) {
    const taskText = taskItem.querySelector(".task-text");
    const newText = prompt("Edit task:", taskText.textContent);
    if (newText !== null && newText.trim()) {
      taskText.textContent = newText.trim();
    }
  } else if (target.classList.contains("delete-btn")) {
    taskList.removeChild(taskItem);
  }
}
