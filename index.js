$(document).ready(function() {
    $("#signup-btn").click(function() {
        $("#signup-dropdown").toggle();
    });

    $("#login-btn").click(function() {
        $("#login-dropdown").toggle();
    });
});

document.addEventListener('DOMContentLoaded', (event) => {
  const prevButton = document.getElementsByClassName('carousel-control-prev')[0];
  const nextButton = document.getElementsByClassName('carousel-control-next')[0];
  const carouselContent = document.getElementsByClassName('carousel-caption')[0];

  let isMoving = false;

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      if (!isMoving) {
        moveContent('prev');
      }
    });
  } else {
    console.error('Previous button not found');
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      if (!isMoving) {
        moveContent('next');
      }
    });
  } else {
    console.error('Next button not found');
  }

  function moveContent(direction) {
    isMoving = true;
    if (direction === 'prev') {
      carouselContent.style.transform = 'translateX(-100%)';
    } else if (direction === 'next') {
      carouselContent.style.transform = 'translateX(100%)';
    }
  }

  carouselContent.addEventListener('transitionend', () => {
    // Reset the position without animation
    carouselContent.style.transition = 'none';
    carouselContent.style.transform = 'translateX(0)';
    
    // Force a reflow to apply the transform reset
    carouselContent.offsetHeight;
    
    // Re-enable the transition
    carouselContent.style.transition = 'transform 0.5s ease';

    isMoving = false;
  });
});


