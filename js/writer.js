let windowHandler = new WindowHandler(true)
const button = document.getElementById('addbutton');

button.addEventListener('click', () => { windowHandler.addTodo() });
