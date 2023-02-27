import { apiKey } from "./spoonacular";
const axios = require("axios").default;
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
  document.querySelector(".loadingScreen").style.display = "block";
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
  if (request.data.results.length > 0) {
    const recipeResults = request.data.results;
    console.log("req", recipeResults);
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
  //   const answer = await request.json();
});

const appendPageNumber = (index) => {
  const pageNumber = document.createElement("button");
  pageNumber.className = "paginationNumber";
  pageNumber.innerHTML = index;
  pageNumber.setAttribute("page-index", index);
  pageNumber.setAttribute("aria-label", "Page " + index);
  paginationNumbers.appendChild(pageNumber);
};

const recipeDisplayFunction = (rec) => {
  const recipeListItem = document.createElement("li");
  recipeListItem.setAttribute("tabindex", 0);
  recipeListItem.classList.add("recipeCard");
  recipeListItem.innerHTML = ` 
<div class="recipeImageHolder"><img src="${rec.image}" alt="picture of ${rec.title}"></div>
<h2>${rec.title}</h2>`;
  recipeList.appendChild(recipeListItem);
};

const setCurrentPage = (pageNum, recipes) => {
  currentPage = pageNum;
  handleActivePageNumber();
  handlePageButtonsStatus();
  const prevRange = (pageNum - 1) * paginationLimit;
  const currRange = pageNum * paginationLimit;
  recipes.forEach((item, index) => {
    // console.log("in loop", item, index);
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
