// Variables
let todos = [];
const listContent = document.querySelector("#listContent");
const searchTodoInput = document.querySelector("#searchTodo");
const addTodoInput = document.querySelector("#addTodoName");

// Event Listeners
document.querySelector("#addTodoButton").addEventListener("click", (e) => {
  e.preventDefault();
  addTodo();
});

document.querySelector("#clearAllButton").addEventListener("click", clearAllTodos);

searchTodoInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const storedTodos = getStoredTodos();
  updateList(storedTodos, searchTerm);
});

document.addEventListener("DOMContentLoaded", () => {
  const storedTodos = getStoredTodos();
  updateList(storedTodos, "");
});

// Functions
function addTodo() {
  const todoName = addTodoInput.value.trim();
  if (todoName === "") return;

  todos.push(todoName);
  storeTodos(todos);
  updateList(todos, searchTodoInput.value);
  addTodoInput.value = "";
  alert(`${todoName} added successfully`);
}

function clearAllTodos() {
  localStorage.clear();
  todos = [];
  listContent.innerHTML = "";
}

function getStoredTodos() {
  return JSON.parse(localStorage.getItem("todos")) || [];
}

function storeTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function updateList(items, searchTerm) {
  listContent.innerHTML = "";
  items.forEach((name, index) => {
    const listItem = document.createElement("div");
    listItem.classList.add("list-item");

    if (searchTerm && name.toLowerCase().includes(searchTerm)) {
      const highlightedName = name.replace(new RegExp(searchTerm, 'gi'), (match) => `<span class="highlight">${match}</span>`);
      listItem.innerHTML = `<span class="todo-name">${highlightedName}</span> <button class="deleteButton">Delete</button>`;
    } else {
      listItem.innerHTML = `<span class="todo-name">${name}</span> <button class="deleteButton">Delete</button>`;
    }

    listItem.querySelector('.deleteButton').addEventListener('click', () => {
      deleteTodo(index);
    });

    listContent.appendChild(listItem);
  });
}

function deleteTodo(index) {
  todos.splice(index, 1);
  storeTodos(todos);
  updateList(todos, searchTodoInput.value);
}

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}
