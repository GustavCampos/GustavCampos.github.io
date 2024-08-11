document.addEventListener('DOMContentLoaded', () => {
	// Get all dropdowns
	const $dropdowns = document.querySelectorAll(".dropdown");

	// Open dropdown on trigger button click
	for (let dropdown of $dropdowns) {
		const mainButton = dropdown.querySelector(".dropdown-trigger button");
	
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
 });
