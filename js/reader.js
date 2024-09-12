let windowHandler = new WindowHandler(false)
window.addEventListener('storage', () => {
	windowHandler.reRenderTodos()
});
