import Auth from "../classes/auth.service";
import RecipeService from "../classes/recipe.service";
import FavoritesService from "../classes/favorites.service";

export const authFactory = () => {
    // define parameters for initialization here

    return new Auth();
};

export const recipeFactory = () => {
    // define parameters for initialization here

    return new RecipeService();
};

export const favoritesFactory = () => {
    // define parameters for initialization here

    return new FavoritesService();
};
