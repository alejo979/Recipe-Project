import uniqid from 'uniqid';

export default class List {
	constructor() {
		this.items = [];
	}
	
	addItem (count, unit, ingredients) {
		const item = {
			id: uniqid(),
			count,
			unit,
			ingredient
		}
		this.items.push(item);
		return item;
	}
	
	deleteItem(id) {
		const index = this.items.findIndex(el => el.id === id);
		
		// [2,4,8] splice(1, 1) -> returns 4, original array is [2, 8]    (start index, how many elements we want to take)
		// [2,4,8] slice(1, 2) -> returns 4, original array is [2, 4, 8]  (start index, end index)
		
		this.items.splice(index, 1);
	}
	
	updateCount(id, newCount) {
		this.items.find(el => el.id === id).count = newCount;
	}
}