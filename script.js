const container = document.querySelector(".container");
const seats = document.querySelectorAll(".row .seat:not(.occupied)");
const count = document.getElementById("count");
const total = document.getElementById("total");
const movieSelect = document.getElementById("movie");
const currencyEl = document.getElementById("currency");

populateUI();

let ticketPrice = +movieSelect.value;
let rate;

const options = [
  `Avengers: Endgame `,
  `Joker `,
  `Toy Story 4 `,
  `The Lion King `,
];

// Save selected movie index and price
function setMovieData(movieIndex, moviePrice) {
  localStorage.setItem("selectedMovieIndex", movieIndex);
  localStorage.setItem("selectedMoviePrice", moviePrice);
}

// Update total and count
function updateSelectedCount() {
  const selectedSeats = document.querySelectorAll(".row .seat.selected");

  const seatsIndex = [...selectedSeats].map((seat) => [...seats].indexOf(seat));

  localStorage.setItem("selectedSeats", JSON.stringify(seatsIndex));

  const selectedSeatsCount = selectedSeats.length;

  count.innerText = selectedSeatsCount;
  total.innerText =
    selectedSeatsCount * (ticketPrice * (rate ? rate : 1)).toFixed(2);

  setMovieData(movieSelect.selectedIndex, movieSelect.value);
}

// Get data from localstorage and populate UI
function populateUI() {
  const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats"));

  if (selectedSeats !== null && selectedSeats.length > 0) {
    seats.forEach((seat, index) => {
      if (selectedSeats.indexOf(index) > -1) {
        seat.classList.add("selected");
      }
    });
  }

  const selectedMovieIndex = localStorage.getItem("selectedMovieIndex");

  if (selectedMovieIndex !== null) {
    movieSelect.selectedIndex = selectedMovieIndex;
  }
}

// Get exchange rate
async function calculate() {
  try {
    let response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/USD`
    );
    let data = await response.json().then((data) => {
      const index = localStorage.getItem("selectedMovieIndex");
      rate = data.rates[currencyEl.value];
      console.log();
      // Change options rate
      options.forEach((element, key) => {
        if (element == options[index]) {
          movieSelect[key] = new Option(
            `${element} (${(movieSelect[key].value * rate).toFixed(2)} ${
              currencyEl.value
            })`,
            movieSelect[key].value,
            false,
            true
          );
        } else {
          movieSelect[key] = new Option(
            `${element} (${(movieSelect[key].value * rate).toFixed(2)} ${
              currencyEl.value
            })`,
            movieSelect[key].value
          );
        }
      });

      total.innerText = count.innerText * (ticketPrice * rate).toFixed(2);
    });
    return data;
  } catch (error) {
    alert(error);
  }
}

//Exchanges events
currencyEl.addEventListener("change", calculate);
total.addEventListener("change", calculate);

// Movie select event
movieSelect.addEventListener("change", (e) => {
  ticketPrice = +e.target.value;
  setMovieData(e.target.selectedIndex, e.target.value);
  updateSelectedCount();
});

// Seat click event
container.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("seat") &&
    !e.target.classList.contains("occupied")
  ) {
    e.target.classList.toggle("selected");

    updateSelectedCount();
  }
});

// Initial count and total set
updateSelectedCount();
