import { Injectable } from '@nestjs/common';
import { stringify } from 'querystring';
import { FileReaderService } from 'src/utils/fileReader.service';

// https://adventofcode.com/2020/day/21

interface FoodItem {
  ingredients: string[],
  allergens: string[];
}

interface Allergen {
  name: string;
  ingredientsThatMightContain: string[];
}

interface Ingredient {
  name: string;
  possibleAllergens: string[];
}

@Injectable()
export class Day21Service implements Processor{
  constructor(private readonly fileReaderService: FileReaderService) {}

  processInput(): string {
    const fileContent = this.fileReaderService
      .readFileAsString('./input/day21.txt')
      .split('\n');
    
    const foodList = this.generateFoodListFromInput(fileContent);
    const ingredients = this.processIngredientsAndAllergens(foodList);

    return `Part 01 [${this.countIngredientsWithNoAllergensInList(ingredients, foodList)}] Part 02 [${this.getCanonicalDangerousIngredientList(ingredients)}]`;
  }  

  generateFoodListFromInput(input: string[]): FoodItem[] {
    return input.filter(line => line.length > 1).map(line => {
      const ingredientsAndAllergens = line.replace(/[\(\)]/g, "").split("contains");
      const ingredients = ingredientsAndAllergens[0].trim().split(" ");
      const allergens = ingredientsAndAllergens[1].trim().split(",").map(item => item.trim());
      return <FoodItem>{ingredients: ingredients, allergens: allergens};
    });
  }

  countIngredientsWithNoAllergensInList(ingredients: Ingredient[], foodList: FoodItem[]) : number {
    return ingredients.filter(ingredient => ingredient.possibleAllergens.length === 0).map(ingredient => 
      foodList.filter(item => item.ingredients.includes(ingredient.name)).length
    ).reduce((sum,cur) => sum + cur);
  }

  getCanonicalDangerousIngredientList(ingredients: Ingredient[]) : string {
    return ingredients.filter(ingredient => ingredient.possibleAllergens.length === 1)
                      .sort((iA, iB) => iA.possibleAllergens[0].localeCompare(iB.possibleAllergens[0]))
                      .map(ingredient => ingredient.name)
                      .join(",");
  }

  processIngredientsAndAllergens(foodList: FoodItem[]) : Ingredient[] {
    const ingredients = new Array<Ingredient>();
    const allergens = new Array<Allergen>();

    // Create a list containing all the allergen names
    const allAllergens = foodList.map(item => item.allergens).reduce((uniqueAllergens, allergens) => {
      allergens.forEach(allergen => uniqueAllergens.add(allergen)); 
      return uniqueAllergens}, 
    new Set<string>());

    // Create a list containing all the ingredients
    const allIngredients = foodList.map(item => item.ingredients).reduce((uniqueIngredients, ingredients) => {
      ingredients.forEach(ingredient => uniqueIngredients.add(ingredient)); 
      return uniqueIngredients}, 
    new Set<string>());

    allAllergens.forEach(allergenName => {
      // The possible ingredients that contain the allergen is the intersection of the ingredients of all food items that contain the allergen
      // Admittedly, it took me a while to reach this conclusion 🤦‍♂️
      const possibleIngredients = 
        foodList.filter(item => item.allergens.includes(allergenName))
                .map(item => item.ingredients)
                .reduce((ingredientsA, ingredientsB) => ingredientsA.filter(iA => ingredientsB.includes(iA)));

      allergens.push({name: allergenName, ingredientsThatMightContain: possibleIngredients})      
    });

    allIngredients.forEach(ingredientName => {
      const possibleAllergens = 
        allergens.filter(allergen => allergen.ingredientsThatMightContain.includes(ingredientName)).map(allergen => allergen.name);
      ingredients.push({name: ingredientName, possibleAllergens: possibleAllergens});
    });

    // Part02: post process the ingredients => ensure that each one has only one allergen
    let currentEvaluationIndex = 0;
    while(ingredients.some(ingredient => ingredient.possibleAllergens.length > 1)) {
      const currentIngredient = ingredients[currentEvaluationIndex % ingredients.length];
      currentEvaluationIndex++;
      if(currentIngredient.possibleAllergens.length !== 1){
        continue;
      }

      ingredients.forEach(ingredient => {
        if(ingredient.name === currentIngredient.name) return;
        ingredient.possibleAllergens = ingredient.possibleAllergens.filter(allergen => allergen !== currentIngredient.possibleAllergens[0]);
      });
    }

    return ingredients;
  }
}
