import { recipesCollection, db } from "@/includes/firebase.js";
import { updateDoc, addDoc, doc } from "firebase/firestore";
import {
  getSingleDocument,
  getCollectionDocuments,
  uploadFile,
  updateDocument,
  createDocument,
  deleteFile,
  deleteDocument,
} from "../firebase-util";

async function getRecipes() {
  let recipes = await getCollectionDocuments(recipesCollection);
  return recipes;
}

async function getSingleRecipe(recipeId) {
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

  //Update document with pictures urls
  await updateDocument("recipes", recipeResult.id, {
    main_picture: {
      url: mainPictureUrl,
      path: mainPicturePath,
    },
    steps: modifiedSteps,
  });
}

async function editRecipe(id, recipe, steps, mainPicture, filesToDelete) {
  let currentRecipe = await getSingleRecipe(id);

  // Upload main picture
  let mainPictureUrl, mainPicturePath;
  if (!mainPicture.url.includes("firebase")) {
    mainPicturePath = `${id}/${mainPicture.name}`;
    mainPictureUrl = await uploadFile(mainPicturePath, mainPicture);
  } else {
    mainPicturePath = mainPicture.path;
    mainPictureUrl = mainPicture.url;
  }
  const docRef = doc(db, "recipes", id);

  for (let index = 0; index < steps.length; index++) {
    //Upload pictures which are not uploaded yet
    for (let picture of steps[index].pictures) {
      let picturesCopy = [...steps[index].pictures];
      console.log(picture);
      if (!picture.url.includes("firebase")) {
        const picturePath = `${id}/steps/${index}/${picture.name}`;
        console.log(picturePath, picture);
        const pictureUrl = await uploadFile(picturePath, picture);
        picturesCopy.splice(
          steps[index].pictures.findIndex(
            (element) => element.url == picture.url
          ),
          1
        );
        picturesCopy.push({
          url: pictureUrl,
          path: picturePath,
        });
      }
      steps[index].pictures = picturesCopy;
    }
  }

  //Delete pictures that are not used anymore
  filesToDelete.forEach(async (file) => {
    if (file.path) {
      await deleteFile(file.path);
    }
  });

  console.log({
    ...recipe,
    main_picture: {
      url: mainPictureUrl,
      path: mainPicturePath,
    },
    steps,
  });
  updateDoc(docRef, {
    ...recipe,
    main_picture: {
      url: mainPictureUrl,
      path: mainPicturePath,
    },
    steps,
  });
}

async function deleteRecipe(id, main_picture, steps) {
  //Main picture deletion
  await deleteFile(main_picture.path);

  //step pictures deletion
  for (let step of steps) {
    for (let picture of step.pictures) {
      await deleteFile(picture.path);
    }
  }

  //Document deletion
  await deleteDocument("recipes", id);
}

export { getRecipes, addRecipe, getSingleRecipe, editRecipe, deleteRecipe };
