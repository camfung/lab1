// gpt generated i hate dealing with dates it very annoying
function getCurrentTime() {
	const now = new Date();
	let hours = now.getHours();
	const minutes = now.getMinutes().toString().padStart(2, '0');
	const seconds = now.getSeconds().toString().padStart(2, '0');
	const ampm = hours >= 12 ? 'PM' : 'AM';

	hours = hours % 12;
	hours = hours ? hours : 12;
	const formattedHours = hours.toString().padStart(2, '0');

	return `${formattedHours}:${minutes}:${seconds} ${ampm}`;
}

// any time i access local storage i update the last updated display
function getLocalStorage() {
	const lastUpdatedElem = document.getElementById("lastUpdated")
	lastUpdatedElem.innerHTML = "Last updated at " + getCurrentTime()

	return localStorage
}

class Todo {
	static idCounter = 0
	constructor(note, id) {
		if (id === undefined) {
			this.id = Todo.idCounter;
		} else {
			this.id = id
		}
		++Todo.idCounter
		this.dateWritten = new Date();
		this.deleted = false;
		this.note = note;
	}
}

class TodoHandler {
	static todoArrayKey = "todos"
	constructor() {
		this.todos = {};
		this.readTodos()
	}

	addTodo(note) {
		const newTodo = new Todo(note);
		const strTodo = JSON.stringify(newTodo)
		getLocalStorage().setItem(newTodo.id, strTodo)
		this.todos[newTodo.id] = newTodo;
	}

	deleteTodo(index) {
		delete this.todos[index]
		getLocalStorage().removeItem(index.toString())
	}
	updateTodo(id, note) {
		this.todos[id].note = note
		const strTodo = JSON.stringify(this.todos[id])
		getLocalStorage().setItem(id, strTodo)
	}

	readTodos() {
		for (let i = 0; i < getLocalStorage().length; i++) {
			let key = getLocalStorage().key(i);
			let value = getLocalStorage().getItem(key);
			console.log(value)
			const todo = JSON.parse(value);
			this.todos[todo.id] = new Todo(todo.note, todo.id)
		}
	}
}

class WindowHandler {
	constructor(writable) {
		this.todoHandler = new TodoHandler()
		this.isWriter = writable

		this.todoWrapper = document.getElementById("todoWrapper")
		this.renderTodos()
	}

	renderTodos() {


		const sortedTodos = Object.keys(this.todoHandler.todos)
			.map(todoIndex => this.todoHandler.todos[todoIndex])
			// b then a for oldest at the top and  newest at the bottom
			.sort((b, a) => {

				if (a.note < b.note) return -1;
				if (a.note > b.note) return 1;
				return 0;
			});


		sortedTodos.forEach(todo => this.addTodoToDom(todo.note, todo.id));
	}

	addTodoToDom(note, id) {
		const todoDiv = document.createElement('div');
		todoDiv.id = id
		todoDiv.className = 'd-flex justify-content-between align-items-center';


		const noteTextarea = document.createElement('textarea');
		noteTextarea.className = 'form-control';
		noteTextarea.value = note;
		noteTextarea.rows = 3; // Optional: You can set the number of visible text rows
		if (this.isWriter) {

			noteTextarea.addEventListener('input', (event) => {
				const newNote = event.target.value;
				this.updateTodo(id, newNote);
			});


			const removeButton = document.createElement('button');
			removeButton.className = 'btn btn-danger';
			removeButton.innerText = 'Remove';


			removeButton.onclick = () => {
				console.log("button clicked: ", id);
				this.clicked(id);
			};
			todoDiv.appendChild(removeButton);
		}

		todoDiv.appendChild(noteTextarea);


		this.todoWrapper.appendChild(todoDiv);
	}

	updateTodo(id, note) {
		this.todoHandler.updateTodo(id, note)
	}

	removeElementById(id) {
		const element = document.getElementById(id);

		if (element) {
			element.parentNode.removeChild(element);
		} else {
			console.log(`Element with id "${id}" not found.`);
		}
	}

	clicked(id) {
		this.todoHandler.deleteTodo(id)
		this.removeElementById(id)
	}
	reRenderTodos() {
		let parent = document.getElementById("todoWrapper");
		while (parent.firstChild) {
			parent.removeChild(parent.firstChild);
		}
		this.todoHandler.todos = {}
		this.todoHandler.readTodos()
		this.renderTodos()
	}
	addTodo() {
		const todo = new Todo();
		this.todoHandler.addTodo("")
		this.addTodoToDom("", todo.id)
	}
}




