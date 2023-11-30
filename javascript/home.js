document.addEventListener("DOMContentLoaded", function () {
    // Get references to the necessary elements
    var carouselText = document.getElementById("carousel-text");
    var carousel = document.getElementById("carousel-1");

    // Add an event listener to the carousel
    carousel.addEventListener("slid.bs.carousel", function (event) {
        var activeSlide = event.relatedTarget;
        var slideIndex = Array.from(carousel.querySelectorAll(".carousel-item")).indexOf(activeSlide);

        // Update the text based on the current slide
        switch (slideIndex) {
            case 0:
                carouselText.textContent = "Play pictionary with your friends! Guess the word using only what you can see in the drawing. Try and beat the fastest time!";
                break;
            case 1:
                carouselText.textContent = "See our selection of games! Play with friends or against the computer!";
                break;
            case 2:
                carouselText.textContent = "Create an account to unlock more features! Play multiplayer with friends and gain access to saved game history!";
                break;
            default:
                carouselText.textContent = "Text Not Loaded";
        }
    });
});
