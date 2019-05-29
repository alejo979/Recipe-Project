import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
	elements.searchInput.value = '';
};

export const clearResults = () => {
	elements.searchResList.innerHTML = '';
	elements.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {
	const resultsArr = Array.from(document.querySelectorAll('.results__link--active'));
	resultsArr.forEach(el => {
		el.classList.remove('results__link--active');
	});
	document.querySelector(`.results__link[href*="#${id}"]`).classList.add('.results__link--active');
};

// limit is number of characters
export const limitRecipeTitle = (title, limit = 17) => {
	
	// alternate approach:
	if(title.length<=limit) return title; // nothing to do
	if(title[limit]==' ') return title.substring(0,limit); // last word ends at the limit
	title = title.substring(0,limit); // crop title
	const lastSpace = title.lastIndexOf(' '); // find the end of the last entire word
	if(lastSpace==-1) return title; // very unlikely to happen, but it is good to be safe
	return title.substring(0,lastSpace); // return only entire words
	
		
	/*
	//Jonas won't work:
	const newTitle = [];
	if (title.length > limit) {

		// reduce: 1st parameter is the call back function, 2nd parameter is 0, the inicial value of the accumulator
		
		title.split(' ').reduce((acc, cur) => {
			
			if (acc + cur.lenght <= limit) {
				newTitle.push(cur);
			}
			
			return acc + cur.lenght;
			
		}, 0); 
		
		
		// return the result
		return `${newTitle.join(' ')} ...`;
	}
	return title;
	*/
	
};


// remove the export and 
export const renderRecipe = recipe => {
	const markup = `
		<li>
			<a class="results__link" href="#${recipe.recipe_id}">
				<figure class="results__fig">
					<img src="${recipe.image_url}" alt="${recipe.title}">
				</figure>
				<div class="results__data">
					<h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
					<p class="results__author">${recipe.publisher}</p>
				</div>
			</a>
		</li>		
	`;
	
//	const markup = `
//		<li>
//			<a class="results__link" href="#${recipe.idMeal}">
//				<figure class="results__fig">
//					<img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
//				</figure>
//				<div class="results__data">
//					<h4 class="results__name">${limitRecipeTitle(recipe.strMeal)}</h4>
//					<p class="results__author">"Themealdb"</p>
//				</div>
//			</a>
//		</li>		
//	`;
	
	elements.searchResList.insertAdjacentHTML('beforeend', markup);
};


const createButton = (page, type) => `
	<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
		<span>Page ${type === 'prev' ? page - 1 : page + 1}</span>				
		<svg class="search__icon">
			<use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
		</svg>

	</button>
`;


const renderButtons = (page, numResults, resPerPage) => {
	const pages = Math.ceil(numResults / resPerPage);
	
	let button;
	if (page == 1 && pages > 1) {
		// Only button to go to next page
		button = createButton(page, 'next')
	} else if (page < pages) {
		// Both buttons
		button = `
			${createButton(page, 'prev')}
			${createButton(page, 'next')}
		`;
	} else if (page === pages && pages > 1) {
		// Only button to go to previous page
		button = createButton(page, 'prev')
	}
	
	elements.searchResPages.insertAdjacentHTML('afterbegin', button);
	
};


export const renderResults = (recipes, page = 1, resPerPage = 10) => {
	// here we receive array with 30 recipes from the api call (old)
	
	// render results of current page 
	const start = (page - 1) * resPerPage;
	const end = page * resPerPage;
	
	recipes.slice(start, end).forEach(renderRecipe);
	
	// render pagination buttons
	renderButtons(page, recipes.length, resPerPage);
	
};