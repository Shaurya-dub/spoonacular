import { apiKey } from "./spoonacular";
const axios = require("axios").default;
const recipeForm = document.querySelector(".recipeSearchForm");
const recipeList = document.querySelector(".recipeList");
const recipeSearchInput = document.querySelector(".recipeSearchInput");
const paginationNumbers = document.querySelector("#paginationNumbers");
const nextButton = document.querySelector("nextButton");
const prevButton = document.querySelector("prevButton");
const paginationLimit = 5;
let currentPage;
let cuisineFilterArray = [];
recipeForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const cuisineList = cuisineFilterArray.join(",");
  const searchQuery = recipeSearchInput.value;
  const request = await axios.get(
    `https://api.spoonacular.com/recipes/complexSearch`,
    {
      params: {
        apiKey: apiKey,
        cuisine: cuisineList,
        query: searchQuery,
      },
    }
  );
  if (request) {
    console.log("req", request);
    recipeList.innerHTML = "";
    request.data.results.forEach((rec) => {
      recipeDisplayFunction(rec);
    });
  } else {
    console.error("empty response");
  }
  //   const answer = await request.json();
});

const recipeDisplayFunction = (rec) => {
  const recipeListItem = document.createElement("li");
  recipeListItem.setAttribute("tabindex", 0);
  recipeListItem.classList.add("recipeCard");
  recipeListItem.innerHTML = ` 
<div class="recipeImageHolder"><img src="${rec.image}" alt="picture of ${rec.title}"></div>
<h2>${rec.title}</h2>`;
  recipeList.appendChild(recipeListItem);
};

function checkboxSelect(e) {
  if (e.currentTarget.checked) {
    cuisineFilterArray.push(e.target.value);
    console.log(cuisineFilterArray);
  } else {
    let removeItem = cuisineFilterArray.indexOf(e.target.value);
    cuisineFilterArray.splice(removeItem, 1);
    console.log("non check", cuisineFilterArray);
  }
}

document.querySelectorAll(".cuisineFilter").forEach((filter) => {
  filter.addEventListener("change", checkboxSelect);
});
