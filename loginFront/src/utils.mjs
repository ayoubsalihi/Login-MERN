export const signUpButton = document.getElementById('signUp');
export const signInButton = document.getElementById('signIn');
export const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});