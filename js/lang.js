function changeLanguage(langCode) {
	const langTags = document.querySelectorAll("[data-lang]");

	for (let tag of langTags) {
		if (tag.getAttribute("data-lang") === langCode) {
			tag.classList.remove("is-hidden");
			tag.setAttribute("aria-hidden", "false");
		} else {
			tag.classList.add("is-hidden");
			tag.setAttribute("aria-hidden", "true");
		}
	}

	document.documentElement.setAttribute("lang", langCode);
}

document.addEventListener('DOMContentLoaded', () => {
	const buttonClass = ["is-primary", "is-selected"]

	changeLanguage("en");

	const langButtons = document.querySelectorAll(".lang-button");

	for (let button of langButtons) {
		button.addEventListener("click", () => {
			for (let button of langButtons) {button.classList.remove(...buttonClass);}
			
			changeLanguage(button.value);

			button.classList.add(...buttonClass);
		});
	}
});
