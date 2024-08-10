function changeLanguage(langCode) {
	const langTags = document.querySelectorAll("[data-lang]");

	for (let tag of langTags) {
		if (tag.getAttribute("data-lang") === langCode) {
			tag.classList.remove("is-hidden");
		} else {
			tag.classList.add("is-hidden");
		}
	}

	document.documentElement.setAttribute("lang", langCode);
}

document.addEventListener('DOMContentLoaded', () => {
	changeLanguage("en");

	const langButtons = document.querySelectorAll(".lang-button");

	for (let button of langButtons) {
		button.addEventListener("click", () => {
			for (let button of langButtons) {button.classList.remove("is-info", "is-selected");}
			
			changeLanguage(button.value);

			button.classList.add("is-info", "is-selected");
		});
	}
});
