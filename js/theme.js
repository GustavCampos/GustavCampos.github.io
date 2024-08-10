document.addEventListener('DOMContentLoaded', () => {
	// Get all dropdowns
	const $dropdowns = document.querySelectorAll(".dropdown");

	// Get all "theme-button" elements
	const $themeButtons = document.querySelectorAll('button.theme-button');
	const $mainThemeButton = document.getElementById("theme-button");

	for (let dropdown of $dropdowns) {
		const mainButton = dropdown.querySelector(".dropdown-trigger button");

		console.log(mainButton);
	
		mainButton.addEventListener("click", () => {
			dropdown.classList.toggle("is-active");	
		});
	}

	// Close the dropdown if clicked outside
    document.addEventListener('click', (event) => {
    	for (let dropdown of $dropdowns) {
    		if (!dropdown.contains(event.target)) {
	    		dropdown.classList.remove("is-active");
    		}
    	}
    });

	// Add a click event on each of them
	for (let button of $themeButtons) {	
		button.addEventListener('click', () => {
			// Get the target from the "data-target" attribute
			const htmlElement = document.documentElement;
			const currentThemeImgs = $mainThemeButton.querySelectorAll("img");
			const dataSchema = button.getAttribute("data-schema");

			htmlElement.setAttribute("data-theme", dataSchema)

			const classType = {
				light: "warning",
				dark: "link",
				system: "primary",
			}

			for (let image of currentThemeImgs) {
				if (image.classList.contains(`fill-${classType[dataSchema]}`)) {
					image.classList.remove("is-hidden");
				} else {
					image.classList.add("is-hidden");
				}
			}
		});
	};

});
