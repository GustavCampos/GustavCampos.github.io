function getBrowserTheme() {
	if (window.matchMedia && 
		window.matchMedia('(prefers-color-scheme: dark)').matches
	) {return "dark";}

	return "light";
}

function changeTheme(theme, mainThemeButton) {
	const evalTheme = ["dark", "light"].includes(theme) ? theme : getBrowserTheme();
	const buttonClass = evalTheme === "dark" ? "primary" : "warning";
	const imgs = mainThemeButton.querySelectorAll("img");
	// Scaling up to whole dropdown element
	const dropdownElement = mainThemeButton.parentElement.parentElement;
	
	document.documentElement.setAttribute("data-theme", evalTheme);

	imgs.forEach(img => img.classList.add("is-hidden"));

	mainThemeButton.querySelector(`.${buttonClass}`).classList.remove('is-hidden');

	dropdownElement.classList.remove("is-active");
}


document.addEventListener('DOMContentLoaded', () => {
	// Get all "theme-button" elements
	const $themeButtons = document.querySelectorAll('button.theme-button');
	const $mainThemeButton = document.getElementById("theme-button");

	changeTheme(null, $mainThemeButton);

	// Add a click event on each of them
	for (let button of $themeButtons) {	
		button.addEventListener('click', () => {
			changeTheme(button.getAttribute("data-schema"), $mainThemeButton);
		});
	};

});
