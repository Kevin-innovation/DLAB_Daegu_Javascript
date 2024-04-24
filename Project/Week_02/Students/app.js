// DOM ��� ����
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");

// �̺�Ʈ ������ ���
addTaskBtn.addEventListener("click", addTask);
taskList.addEventListener("click", handleTaskActions);

// �� �� �߰� �Լ�
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText) {
    const taskItem = createTaskItem(taskText);
    taskList.appendChild(taskItem);
    taskInput.value = "";
  }
}

// �� �� ��� ���� �Լ�
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

// �� �� ��� �׼� ó�� �Լ�
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
