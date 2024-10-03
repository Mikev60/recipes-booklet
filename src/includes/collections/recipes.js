import { recipesCollection, storageRef, db } from "@/includes/firebase.js";
import { getDocs, updateDoc, addDoc, doc } from "firebase/firestore";
import {
  uploadBytes,
  ref as refFunction,
  getDownloadURL,
} from "firebase/storage";

async function getRecipes() {
  let recipes = [];
  const querySnapshot = await getDocs(recipesCollection);
  querySnapshot.forEach((doc) => {
    recipes.push(doc.data());
  });
  return recipes;
}

async function addRecipe(recipe, mainPicture, steps) {
  //Create document
  const recipeResult = await addDoc(recipesCollection, recipe);

  // Upload main picture

  const mainPicturePath = `${recipeResult.id}/${mainPicture.name}`;
  const mainPictureRef = refFunction(storageRef, mainPicturePath);
  await uploadBytes(mainPictureRef, mainPicture);
  const mainPictureUrl = await getDownloadURL(mainPictureRef);

  //Upload other pictures
  let modifiedSteps = [...steps];
  for (let index = 0; index < modifiedSteps.length; index++) {
    let stepPictures = [];
    for (let picture of modifiedSteps[index].pictures) {
      const picturePath = `${recipeResult.id}/steps/${index}/${picture.name}`;
      const pictureRef = refFunction(storageRef, picturePath);
      await uploadBytes(pictureRef, picture);
      const pictureUrl = await getDownloadURL(pictureRef);
      stepPictures.push({
        pictureUrl,
        path: picturePath,
      });
      modifiedSteps[index].pictures = stepPictures;
    }
  }
  console.log(modifiedSteps);

  //Update document with pictures urls
  const docRef = doc(db, "recipes", recipeResult.id);
  updateDoc(docRef, {
    main_picture: {
      url: mainPictureUrl,
      path: mainPicturePath,
    },
    steps: modifiedSteps,
  });
}

export { getRecipes, addRecipe };
