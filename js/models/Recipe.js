import axios from 'axios';
import { key, proxy } from '../config';

export default class Recipe {
	constructor(id) {
		this.id = id;
	}
	
	async getRecipe() {
		try {
			// online
			const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
//			const res = await response;
			this.title = res.data.recipe.title;
			this.author = res.data.recipe.publisher;
			this.img = res.data.recipe.image_url;
			this.url = res.data.recipe.source_url;
			this.ingredients = res.data.recipe.ingredients;
			console.log(res);
			
			
		} catch (error) {
			console.log(error);
			alert('Something went wrong in Recipe.js getRecipe() call! :(');
		}
	}
	
	// Assuming that we need 15 min for each 3 ingredients
	calcTime() {
		const numIng = this.ingredients.length;
		const periods = Math.ceil(numIng / 3);
		this.time = periods * 15;
	}
	
	calcServings () {
		this.servings = 4;
	}
	
	parseIngredients() {
		
		const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
		const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
		const units = [...unitsShort, 'kg', 'g'];
		
		const newIngredients = this.ingredients.map(el => {
			// 1. Uniform units
			let ingredient = el.toLowerCase();
			unitsLong.forEach((unit, i) => {
				ingredient = ingredient.replace(unit, unitsShort[i]);
			});
			
			// 2. Remove parenthesis
			ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
			
			// 3. Parse ingredients into count, unit and ingredient
			const arrIng = ingredient.split(' ');
			const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
			
			let objIng;
			if (unitIndex > -1) {   // -1 means it couldn't find the element
				// There is a unit
				// e.g. 4 1/2 cups, arrCount = [4, 1/2] ---> eval("4+1/2") --> 4.5
				// e.g. 4 cups, arrCount = [4]
				
				const arrCount = arrIng.slice(0, unitIndex);   // last one is EXCLUDING.
				
				let count;
				if (arrCount.length === 1) {
					count = eval(arrIng[0].replace('-', '+'));
				} else {
					count = eval(arrIng.slice(0, unitIndex).join('+'))
				}
				
				objIng = {
					count,
					unit: arrIng[unitIndex],
					ingredient: arrIng.slice(unitIndex + 1).join(' ')
				}
				
			} else if (parseInt(arrIng[0], 10)) {   // a number base 10 (not binary or some other options)
				// There is no unit, but 1st element is a number
				objIng = {
					count: parseInt(arrIng[0], 10),
					unit: '',
					ingredient: arrIng.slice(1).join(' ')
				}
					   
			} else if (unitIndex === -1) {
				// There is no unit and NO number in first position
				objIng = {
					count: 1,
					unit: '',
					ingredient  //leave like this and it will assign the value for the variable that already exists.
				}
			}
			
			
			return objIng;
		});
		this.ingredients = newIngredients;
	}
	
	updateServings (type) {
		// Servings
		const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
		
		// Ingredients
		this.ingredients.forEach(ing => {
			ing.count = ing.count * (newServings / this.servings);
		});
		
		this.servings = newServings;
		
	}
	
}

const response = {data: {"recipe": {"publisher": "The Pioneer Woman", "f2f_url": "http://food2fork.com/view/46956", "ingredients": ["1-1/3 cup Shortening (may Substitute Butter)", "1-1/2 cup Sugar", "1 teaspoon Orange Zest", "1 teaspoon Vanilla", "2 whole Eggs", "8 teaspoons Whole Milk", "4 cups All-purpose Flour", "3 teaspoons Baking Powder", "1/2 teaspoon Salt", "2 jars (13 Ounces Each) Marshmallow Creme", "2 packages (8 Ounces Each) Cream Cheese", "Peaches", "Kiwi Fruit", "Blueberries", "Pears", "Raspberries", "Other Fruit Optional"], "source_url": "http://thepioneerwoman.com/cooking/2012/01/fruit-pizza/", "recipe_id": "46956", "image_url": "http://static.food2fork.com/fruitpizza9a19.jpg", "social_rank": 100.0, "publisher_url": "http://thepioneerwoman.com", "title": "Deep Dish Fruit Pizza"}}}