document.addEventListener('DOMContentLoaded', () => {
    const profileCarouselDiv = document.getElementById('profile-carousel');
    const carouselImages = profileCarouselDiv.querySelectorAll("img");
    const imageInterval = 5000; // 5 seconds

    setInterval(() => {
        const currentImage = Number(profileCarouselDiv.getAttribute("current-image"));
        const nextImage = (currentImage >= (carouselImages.length - 1)) ? 0 : (currentImage + 1);
        profileCarouselDiv.setAttribute("current-image", nextImage);

        for (let i = 0; i < carouselImages.length; i++)  {
            if (nextImage === i) {
                carouselImages[i].classList.remove("is-hidden");
                continue;
            }

            carouselImages[i].classList.add("is-hidden");
        }
    }, imageInterval);
});