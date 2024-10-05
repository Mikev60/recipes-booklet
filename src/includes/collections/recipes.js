import { recipesCollection, db } from "@/includes/firebase.js";
import { updateDoc, addDoc, doc } from "firebase/firestore";
import {
  getSingleDocument,
  getCollectionDocuments,
  uploadFile,
  updateDocument,
  createDocument,
} from "../firebase-util";

async function getRecipes() {
  let recipes = await getCollectionDocuments(recipesCollection);
  return recipes;
}

async function getSingleRecipe(recipeId) {
  console.log("fait avec firebase");
  let recipe = await getSingleDocument(recipeId, "recipes");
  return recipe;
}

async function addRecipe(recipe, mainPicture, steps) {
  //Create document
  const recipeResult = await createDocument(recipesCollection, recipe);

  // Upload main picture
  const mainPicturePath = `${recipeResult.id}/${mainPicture.name}`;
  const mainPictureUrl = await uploadFile(mainPicturePath, mainPicture);

  //Upload other pictures
  let modifiedSteps = [...steps];
  for (let index = 0; index < modifiedSteps.length; index++) {
    let stepPictures = [];
    for (let picture of modifiedSteps[index].pictures) {
      const picturePath = `${recipeResult.id}/steps/${index}/${picture.name}`;
      const pictureUrl = await uploadFile(picturePath, picture);
      stepPictures.push({
        url: pictureUrl,
        path: picturePath,
      });
      modifiedSteps[index].pictures = stepPictures;
    }
  }
  console.log(modifiedSteps);

  //Update document with pictures urls
  await updateDocument("recipes", recipeResult.id, {
    main_picture: {
      url: mainPictureUrl,
      path: mainPicturePath,
    },
    steps: modifiedSteps,
  });
}

async function editRecipe(id, recipe, steps, mainPicture) {
  // Upload main picture
  const mainPicturePath = `${id}/${mainPicture.name}`;
  const mainPictureUrl = await uploadFile(mainPicturePath, mainPicture);

  console.log("edit");
  const docRef = doc(db, "recipes", id);
  updateDoc(docRef, {
    ...recipe,
    main_picture: {
      url: mainPictureUrl,
      path: mainPicturePath,
    },
    steps,
  });
}

export { getRecipes, addRecipe, getSingleRecipe, editRecipe };
