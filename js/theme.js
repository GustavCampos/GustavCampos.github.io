function getBrowserTheme() {
	if (window.matchMedia && 
		window.matchMedia('(prefers-color-scheme: dark)').matches
	) {return "dark";}

	return "light";
}

function changeTheme(theme, mainThemeButton) {
	const evalTheme = ["dark", "light"].includes(theme) ? theme : getBrowserTheme();
	const themeClass = evalTheme === "dark" ? "primary" : "warning";
	const iconName = evalTheme === "dark" ? "moon" : "sun";
	const icon = mainThemeButton.querySelector("span i");

	document.documentElement.setAttribute("data-theme", evalTheme);
	
	icon.className = `fa-solid fa-${iconName}`;
	icon.parentElement.className = `icon has-text-${themeClass}`;
	
	// Scaling up to whole dropdown element
	const dropdownElement = mainThemeButton.parentElement.parentElement;
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
