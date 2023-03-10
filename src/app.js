// import { apiKey } from "./spoonacular";
// const axios = require("axios").default;
const recipeForm = document.querySelector(".recipeSearchForm");
const recipeList = document.querySelector(".recipeList");
const recipeSearchInput = document.querySelector(".recipeSearchInput");
const paginationNumbers = document.querySelector("#paginationNumbers");
const nextButton = document.querySelector("#nextButton");
const prevButton = document.querySelector("#prevButton");
const paginationLimit = 5;
let currentPage = 1;
let pageCount;
let cuisineFilterArray = [];
recipeForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  document.querySelector(".loadingScreen").style.display = "flex";
  const cuisineList = cuisineFilterArray.join(",");
  const searchQuery = recipeSearchInput.value;
  const initCall = await fetch(`/.netlify/functions/hideKey?cuisineList=${cuisineList}&searchQuery=${searchQuery}`)
  const request = await initCall.json()
    .catch((e) => {
      console.error("error", e);
      document.querySelector(".loadingScreen").style.display = "none";
    });
  if (request.results.length > 0) {
    const recipeResults = request.results;
    recipeList.innerHTML = "";
    pageCount = Math.ceil(recipeResults.length / paginationLimit);
    // let currentPage
    getPaginationNumbers(pageCount);
    recipeResults.forEach((rec) => {
      recipeDisplayFunction(rec);
    });
    const appendedListItems = document.querySelectorAll(".recipeCard");
    setCurrentPage(1, appendedListItems);
    prevButton.addEventListener("click", () => {
      setCurrentPage(currentPage - 1, appendedListItems);
    });
    nextButton.addEventListener("click", () => {
      setCurrentPage(currentPage + 1, appendedListItems);
    });
    document.querySelectorAll(".paginationNumber").forEach((button) => {
      const pageIndex = Number(button.getAttribute("page-index"));
      if (pageIndex) {
        button.addEventListener("click", () => {
          setCurrentPage(pageIndex, appendedListItems);
        });
      }
    });
    document.querySelector(".loadingScreen").style.display = "none";
  } else {
    console.error("empty response");
    document.querySelector(".loadingScreen").style.display = "none";
  }
});

const appendPageNumber = (index) => {
  const pageNumber = document.createElement("button");
  pageNumber.className = "paginationNumber";
  pageNumber.innerHTML = index;
  pageNumber.setAttribute("page-index", index);
  pageNumber.setAttribute("aria-label", "Page " + index);
  paginationNumbers.appendChild(pageNumber);
};

const getRecipeInfo = async (e) => {
  e.preventDefault();
  const recipeId = e.target.attributes[0].value;

  const initCall = await fetch(
    `/.netlify/functions/hideKeyDetail?recipeId=${recipeId}`
  )
  const request = await initCall.json();
  if (request) {
    const recipeSummary = document.querySelector(".recipeSummary");
    const recipeName = request.title;
    const ingredientList = document.querySelector(".ingredientList");
    const instructionsList = document.querySelector(".instructionsList");
    const dietList = document.querySelector(".dietList");
    const recipeInstructions = request.analyzedInstructions[0].steps;
    const recipeIngredients = request.extendedIngredients;
    const recipeImage = request.image;
    const recipeDiet = request.diets;

    recipeSummary.innerHTML = ` <div class="recipeDetailsImageHolder"> <img src="${recipeImage}" alt="${recipeName}">
 </div> <h3 class="recipeDetailsTitle">${recipeName}</h3> `;
    dietList.innerHTML = "";
    ingredientList.innerHTML = "";
    instructionsList.innerHTML = "";
    if (recipeDiet) {
      recipeDiet.map((el) => {
        resultsLoop(dietList, el);
      });
    }
    recipeIngredients.map((ing) => {
      const ingredientStr = `${ing.amount} ${ing.unit} ${ing.name}`;
      resultsLoop(ingredientList, ingredientStr);
    });

    recipeInstructions.map((rec) => {
      resultsLoop(instructionsList, rec.step);
    });
    document.addEventListener(
      "click",
      (e) => {
        if (
          e.target.matches(".closeButton") ||
          !e.target.closest(".recipeDetailCard")
        ) {
          handleModalClose();
        }
      },
      false
    );
    document.body.classList.add("modalOpen");
    document.querySelector(".recipeModal").classList.remove("hidden");
  } else {
    console.error("empty response");
  }
};

const resultsLoop = (appendTo, str) => {
  const listItem = document.createElement("li");
  listItem.innerText = `${str}`;
  appendTo.append(listItem);
};

const recipeDisplayFunction = (rec) => {
  const recipeListItem = document.createElement("li");
  recipeListItem.setAttribute("tabindex", 0);
  recipeListItem.classList.add("recipeCard");
  const recipeBtn = document.createElement("button");
  recipeBtn.innerText = "Show Recipe";
  recipeBtn.setAttribute("data-id", rec.id);
  recipeBtn.addEventListener("click", getRecipeInfo);
  recipeListItem.innerHTML = ` 
<div class="recipeImageHolder"><img src="${rec.image}" alt="picture of ${rec.title}"></div>
<h2>${rec.title}</h2>`;
  recipeListItem.appendChild(recipeBtn);
  recipeList.appendChild(recipeListItem);
};

const handleModalClose = () => {
  document.body.classList.remove("modalOpen");
  document.querySelector(".recipeModal").classList.add("hidden");
};

const setCurrentPage = (pageNum, recipes) => {
  currentPage = pageNum;
  handleActivePageNumber();
  handlePageButtonsStatus();
  const prevRange = (pageNum - 1) * paginationLimit;
  const currRange = pageNum * paginationLimit;
  recipes.forEach((item, index) => {
    item.classList.add("hidden");
    if (index >= prevRange && index < currRange) {
      item.classList.remove("hidden");
    }
  });
};

const getPaginationNumbers = (numOfPages) => {
  paginationNumbers.innerHTML = "";
  for (let i = 1; i <= numOfPages; i++) {
    appendPageNumber(i);
  }
};

const handleActivePageNumber = () => {
  document.querySelectorAll(".paginationNumber").forEach((button) => {
    button.classList.remove("active");

    const activePage = Number(button.getAttribute("page-index"));
    if (activePage == currentPage) {
      button.classList.add("active");
    }
  });
};

const disableButton = (button) => {
  button.classList.add("disabled");
  button.setAttribute("disabled", true);
};
const enableButton = (button) => {
  button.classList.remove("disabled");
  button.removeAttribute("disabled");
};
const handlePageButtonsStatus = () => {
  if (currentPage === 1) {
    disableButton(prevButton);
  } else {
    enableButton(prevButton);
  }
  if (pageCount === currentPage) {
    disableButton(nextButton);
  } else {
    enableButton(nextButton);
  }
};

function checkboxSelect(e) {
  if (e.currentTarget.checked) {
    cuisineFilterArray.push(e.target.value);
  } else {
    let removeItem = cuisineFilterArray.indexOf(e.target.value);
    cuisineFilterArray.splice(removeItem, 1);
  }
}

document.querySelectorAll(".cuisineFilter").forEach((filter) => {
  filter.addEventListener("change", checkboxSelect);
});
