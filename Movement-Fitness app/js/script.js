
const apiKey = "dda25a0db9msh23c2be3cd3778d6p17ea31jsn742136c66ecf";
const apiHost = "exercisedb.p.rapidapi.com";
const apiUrl = "https://exercisedb.p.rapidapi.com/exercises";

// Function to fetch exercise data from API
async function fetchExercises() {
  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "dda25a0db9msh23c2be3cd3778d6p17ea31jsn742136c66ecf",
      "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
    },
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error("Failed to fetch exercises");
  }
}

// Function to display exercise GIFs
function displayExerciseGIFs(exercises) {
  const exerciseContainer = document.getElementById("exercise-container");
  exerciseContainer.innerHTML = "";

  exercises.forEach((exercise) => {
    console.log(exercise);
    const gifUrl = exercise.gifUrl;
    if (gifUrl) {
      const exerciseCard = document.createElement("div");
      exerciseCard.className = "exercise-card";

      const gifElement = document.createElement("img");
      gifElement.classList.add("gif-img");
      gifElement.src = gifUrl;
      gifElement.alt = exercise.name;
      exerciseCard.appendChild(gifElement);

      const nameElement = document.createElement("h3");
      nameElement.textContent = exercise.name;
      exerciseCard.appendChild(nameElement);

      const bodyPartElement = document.createElement("p");
      bodyPartElement.textContent = "Body Part: " + exercise.bodyPart;
      exerciseCard.appendChild(bodyPartElement);

      const targetElement = document.createElement("p");
      targetElement.textContent = "Target: " + exercise.target;
      exerciseCard.appendChild(targetElement);

      const favoriteButton = document.createElement("button");
      favoriteButton.className = "favorite-button";
      favoriteButton.innerHTML = '<i class="far fa-heart fa-2x"></i>';
      exerciseCard.appendChild(favoriteButton);
    
      favoriteButton.addEventListener("click", (event) => {
        event.stopPropagation();
        const favoriteIcon = favoriteButton.querySelector("i");
        favoriteIcon.classList.toggle("fas");
      
        // Get the exercise ID or a unique identifier for the exercise
        const exerciseId = exercise.id; // Adjust this based on your exercise object structure
      
        // Retrieve the list of favorite exercises from the local storage
        let favoriteExercises = JSON.parse(localStorage.getItem("favoriteExercises")) || [];
      
        // Check if the exercise is already in the favorite list
        const index = favoriteExercises.findIndex((favExercise) => favExercise.id === exerciseId);
      
        if (index === -1) {
          // Add the exercise to the favorite list
          favoriteExercises.push(exercise);
        } else {
          // Remove the exercise from the favorite list
          favoriteExercises.splice(index, 1);
        }
      
        // Store the updated favorite list in the local storage
        localStorage.setItem("favoriteExercises", JSON.stringify(favoriteExercises));
      });
      
      exerciseCard.addEventListener("click",()=>{
        window.location.href=`exercise-details.html?id=${exercise.id}`;
      })

      exerciseContainer.appendChild(exerciseCard);
    }
  });
}

// Get references to the search input and search button
const searchInput = document.getElementById('exercise-search');
const searchButton = document.getElementById('search-button');

// Add event listener to the search button
searchButton.addEventListener('click', () => {
  const searchTerm = searchInput.value.trim();
  if (searchTerm !== '') {
    // Call a function to perform the search based on the searchTerm
    performSearch(searchTerm);
  }
});

// Function to perform the search
// Function to perform the search
function performSearch(searchTerm) {
  // Convert the search term to lowercase for case-insensitive search
  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  // Filter the exercises based on the search term
  const searchResults = exerciseDB.filter((exercise) => {
    // Check if the exercise name, body part, target, or any other relevant property contains the search term
    const { name, bodyPart, target } = exercise;
    return (
      name.toLowerCase().includes(lowerCaseSearchTerm) ||
      bodyPart.toLowerCase().includes(lowerCaseSearchTerm) ||
      target.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  // Display the search results on the page
  displayExerciseCards(searchResults);
}


// Function to display the search results on the page
function displayExerciseCards(exercises) {
  const exerciseContainer = document.getElementById('exercise-container');
  exerciseContainer.innerHTML = '';

  if (exercises.length === 0) {
    const noResultsMessage = document.createElement('p');
    noResultsMessage.textContent = 'No results found.';
    exerciseContainer.appendChild(noResultsMessage);
  } else {
    displayExerciseGIFs(exercises);
  }
}


// Handle pagination button click
function handlePagination(event) {
  const page = parseInt(event.target.dataset.page);
  if (!isNaN(page)) {
    fetchExercisesAndDisplay(page);
  }
}



// Fetch exercises and display based on page
async function fetchExercisesAndDisplay(page) {
  const exercises = await fetchExercises();
  const itemsPerPage = 10; // Number of exercises to display per page
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const exercisesToShow = exercises.slice(start, end);
  displayExerciseGIFs(exercisesToShow);

  const totalPages = Math.ceil(exercises.length / itemsPerPage);
  displayPagination(totalPages, page);
}







const exerciseTypes = ['All', 'Cardio', 'Back', 'Chest', 'Lower Arms', 'Lower Legs', 'Neck', 'Shoulders', 'Upper Arms', 'Upper Legs', 'Waist'];
const exerciseTypesContainer = document.querySelector('.exercise-types');
const prevArrow = document.querySelector('.prev-arrow');
const nextArrow = document.querySelector('.next-arrow');

const left_arrow=document.querySelector('.left-arrow');
const right_arrow=document.querySelector('.right-arrow');


const exercisePerPage = 10; // Number of exercises to display per page
let currentPage = 1; // Current page number
let currentPosition = 0;
const cardWidth = 220; // Width of each card
const cardMargin = 10; // Margin between cards
const cardsPerPage = 4; // Number of cards to display per page
const containerWidth = (cardWidth + cardMargin) * cardsPerPage; // Width of the container

prevArrow.addEventListener('click', scrollLeft);
nextArrow.addEventListener('click', scrollRight);
left_arrow.addEventListener('click', scrollLeft);
right_arrow.addEventListener('click', scrollRight);
exerciseTypesContainer.addEventListener('click', handleExerciseTypeClick);

let exerciseDB = []; // Array to store the fetched exercise data


// Display the pagination links
function displayPagination(exercises) {
  const pagination = document.querySelector('.pagination');
  const pageNumbers = document.querySelector('.page-numbers');
  const prevButton = document.querySelector('.prev-button');
  const nextButton = document.querySelector('.next-button');

  const totalPages = Math.ceil(exercises.length / exercisePerPage);

  pageNumbers.innerHTML = '';

  let pages = [];
  const maxVisiblePages = 5; // Maximum number of visible page numbers

  if (totalPages <= maxVisiblePages) {
    // Show all page numbers if there are fewer than maxVisiblePages
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);
    const startPage = Math.max(currentPage - halfMaxVisiblePages, 1);
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
  }

  pages.forEach((pageNumber) => {
    const pageLink = document.createElement('a');
    pageLink.href = '#';
    pageLink.textContent = pageNumber;
    pageLink.addEventListener('click', () => displayPage(pageNumber));
    pageNumbers.appendChild(pageLink);
  });

  // Update visibility of previous and next buttons
  if (currentPage === 1) {
    prevButton.style.display = 'none';
  } else {
    prevButton.style.display = 'inline-block';
  }

  if (currentPage === totalPages) {
    nextButton.style.display = 'none';
  } else {
    nextButton.style.display = 'inline-block';
  }
}


// Update the displayPage function
function displayPage(pageNumber) {
  currentPage = pageNumber;

  const start = (pageNumber - 1) * exercisePerPage;
  const end = start + exercisePerPage;
  const exercisesToShow = filteredExercises.slice(start, end);

  displayExerciseGIFs(exercisesToShow);
  displayPagination(filteredExercises);
}








// Update the fetchExerciseData function
function fetchExerciseData() {
  // Replace 'YOUR_API_KEY' with your actual RapidAPI key
  fetch('https://exercisedb.p.rapidapi.com/exercises', {
    headers: {
      'X-RapidAPI-Key': 'dda25a0db9msh23c2be3cd3778d6p17ea31jsn742136c66ecf',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      exerciseDB = data; // Store the fetched exercise data in the exerciseDB array
      createExerciseTypeCards();
      filteredExercises = exerciseDB; // Initially show all exercises
      displayPage(1);
    })
    .catch((error) => {
      console.error('Error fetching exercise data:', error);
    });
}

fetchExerciseData();

function createExerciseTypeCards() {
  exerciseTypes.forEach((exerciseType) => {



    const exerciseTypeCard = document.createElement('div');
    const image=document.createElement("img");
    image.src="./images/gym-logo.png";
    image.alt="gym logo";
    exerciseTypeCard.classList.add('exercise-types-card');

    const nameElement = document.createElement("h3");
      nameElement.textContent = exerciseType;
      exerciseTypeCard.appendChild(nameElement);

      
    // exerciseTypeCard.textContent = exerciseType;
    exerciseTypeCard.appendChild(image);

    exerciseTypesContainer.appendChild(exerciseTypeCard);
  });
}

function updateVisibility() {
  const exerciseTypeCards = document.querySelectorAll('.exercise-types-card');
  exerciseTypeCards.forEach((card, index) => {
    if (index >= currentPosition / (cardWidth + cardMargin) && index < (currentPosition / (cardWidth + cardMargin)) + cardsPerPage) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'flex';
    }
  });
}

// Update the scrollLeft and scrollRight functions
function scrollLeft() {
  currentPosition += (cardWidth + cardMargin) * cardsPerPage;
  if (currentPosition > 0) {
    currentPosition = 0;
  }
  exerciseTypesContainer.style.transition = 'transform 0.5s ease';
  exerciseTypesContainer.style.transform = `translateX(${currentPosition}px)`;
  updateVisibility();
  setTimeout(() => {
    exerciseTypesContainer.style.transition = '';
  }, 500);
}

function scrollRight() {
  const containerWidthOverflow = exerciseTypesContainer.scrollWidth - containerWidth;
  currentPosition -= (cardWidth + cardMargin) * cardsPerPage;
  if (currentPosition < -containerWidthOverflow) {
    currentPosition = -containerWidthOverflow;
  }
  exerciseTypesContainer.style.transition = 'transform 0.5s ease';
  exerciseTypesContainer.style.transform = `translateX(${currentPosition}px)`;
  updateVisibility();
  setTimeout(() => {
    exerciseTypesContainer.style.transition = '';
  }, 500);
}


// Update the handleExerciseTypeClick function
function handleExerciseTypeClick(event) {
  const exerciseType = event.target.textContent;
  filteredExercises = exerciseDB.filter((exercise) => {
    if (exerciseType === 'All') {
      return true;
    }
    const regex = new RegExp(exerciseType, 'i');
    return (
      regex.test(exercise.bodyPart) ||
      regex.test(exercise.equipment) ||
      regex.test(exercise.name) ||
      regex.test(exercise.target)
    );
  });

  displayPage(1);
}

updateVisibility();
// Add event listeners for previous and next buttons
const prevButton = document.querySelector('.prev-button');
const nextButton = document.querySelector('.next-button');
prevButton.addEventListener('click', () => displayPage(currentPage - 1));
nextButton.addEventListener('click', () => displayPage(currentPage + 1));


// Initial fetch and display
fetchExercisesAndDisplay(1);






// Add smooth scrolling to the "Exercise" link
const exerciseLink = document.querySelector('a[href="#search-section"]');

exerciseLink.addEventListener('click', (event) => {
  event.preventDefault();

  const searchSection = document.getElementById('ex-h1');

  // Scroll to the search section with smooth behavior
  searchSection.scrollIntoView({ behavior: 'smooth' });
});




