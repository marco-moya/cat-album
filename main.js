document.addEventListener("DOMContentLoaded", e => {

  const $fragments = document.createDocumentFragment(),
  $templateRandom = document.getElementById("template-random").content,
  $templateFavourite = document.getElementById("template-favourite").content,
  $catsRandom = document.getElementById("cats-random"),
  $catsFavourite = document.getElementById("cats-favourite"),
  apiKey = "live_YyJShBDtnP5oKR9w8WhpfeM0wXIy1mWT9VIggB0bvYMradJ8ph4v2LNThjfK9Kn7",
  urlApiCat = "https://api.thecatapi.com/v1/images/search?limit=20",
  urlApiFavouriteCat = "https://api.thecatapi.com/v1/favourites",
  urlApiUploadCat = "https://api.thecatapi.com/v1/images/upload";

  async function getCats() {
    try {
      let response = await fetch(`${urlApiCat}`, {
        headers: {
          "x-api-key": apiKey
        } 
      });
      let data = await response.json();
      
      if (!response.ok) throw {status: response.status, statusText: response.statusText};

      $catsRandom.innerHTML = "";
      const $fragment = document.createDocumentFragment();
      data.forEach(element => {
        $templateRandom.querySelector("img").setAttribute("src", element.url);
        $templateRandom.querySelector("img").setAttribute("id", element.id);
        //$templateRandom.querySelector("article").classList.add("col-lg");
        const clone = $templateRandom.cloneNode(true);
        $fragment.appendChild(clone);
      });
      $catsRandom.appendChild($fragment);
    } catch(error) {
      console.log("Estoy en el catch", error);
      let message = error.statusText || "Ocurrió un error";
      $catsRandom.innerText = `Error: ${error.status}: ${message}`;
    } 
  }

  async function postFavoriteCat(postID) {
    try {
      let response = await fetch(urlApiFavouriteCat, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey
        },
        body: JSON.stringify({
          image_id: `${postID}`
        })
      });
      let data = await response.json();
      console.log(`POST:`);
      console.log(data);
      loadFavouriteCat();
      if (!response.ok) throw {status: response.status, statusText: response.statusText}
    }
    catch(error) {
      console.log("Estoy en el catch", error);
      let message = error.statusText || "Ocurrió un error";
      document.getElementById("span").innerHTML = `Error: ${error.status}: ${error}`;
    }
  }

  async function loadFavouriteCat() {
    try {
      let response = await fetch(urlApiFavouriteCat, {
        headers: {
          "x-api-key": apiKey
        }
      });
      let data = await response.json();

      if (!response.ok) throw {status: response.status, statusText: response.statusText}

      $catsFavourite.innerHTML = "";
      const $fragment = document.createDocumentFragment();
      data.forEach(element => {
        $templateFavourite.querySelector("img").setAttribute("src", element.image.url);
        $templateFavourite.querySelector("img").setAttribute("id", element.id);
        const clone = $templateFavourite.cloneNode(true);
        $fragment.appendChild(clone);
      });
      $catsFavourite.appendChild($fragment);
    } catch(error) {
      console.log("Estoy en el catch", error);
      let message = error.statusText || "Ocurrió un error";
      $catsFavourite.innerHTML = `Error: ${error.status}: ${message} ${error.message}`;
    }
  }

  async function deleteFavouriteCat(deleteID) {
    try {
      let response = await fetch(`${urlApiFavouriteCat}/${deleteID}`, {
        method: "DELETE",
        headers: {
          "x-api-key": apiKey
        }
      });
      loadFavouriteCat();

      if (!response.ok) throw {status: response.status, statusText: response.statusText}

    } catch(error) {
      console.log("Estoy en el catch", error);
      let message = error.statusText || "Ocurrió un error";
      $catsFavourite.innerHTML = `Error: ${error.status}: ${message} ${error.message}`;
    }
  }

  async function uploadCat() {
    try {
      const form = document.getElementById("upload-cat");
      const formCatData = new FormData(form);
      const response = await fetch(urlApiUploadCat, {
        method: "POST",
        headers: {
          "x-api-key": apiKey
        },
        body: formCatData
      })
      const data = await response.json();
      postFavoriteCat(data.id);
    } catch(error) {
      console.log("Estoy en el catch", error);
      let message = error.statusText || "Ocurrió un error";
      document.getElementById("span").innerHTML = `Error: ${error.status}: ${error}`;
    }
  }

  function previewImage() {
    const file = document.getElementById("file").files;
    if (file.length > 0) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const $thumbnail = document.getElementById("thumbnail");
        document.querySelector(".preview").style.display = "block";
        $thumbnail.src = e.target.result;
        $thumbnail.alt = "imagen de miniatura";
        document.querySelector(".preview").appendChild($thumbnail);
      }
      fileReader.readAsDataURL(file[0]);
    }
  }

  function cancelPreviewImage() {
    document.querySelector(".preview").style.display = "none";
      document.getElementById("thumbnail").src = "";
      document.getElementById("file").value = "";
  }

  getCats();
  loadFavouriteCat();

  document.addEventListener("click", e => {
    if (e.target.matches("#change-cat") || e.target.matches("#change-cat i")) {
      getCats();
    }

    if (e.target.matches(".btn-favourite") || e.target.matches(".btn-favourite i")) {
      const postID = e.target.closest("article").querySelector("img").id;
      postFavoriteCat(postID);
      e.target.closest("article").querySelector("button").classList.add("select");
    }

    if (e.target.matches(".btn-delete") || e.target.matches(".btn-delete i")) {
      console.log("soy un boton");
      const deleteID = e.target.closest("article").querySelector("img").id;
      deleteFavouriteCat(deleteID);
    }

    if (e.target.matches("#btn-upload")) {
      uploadCat();
      cancelPreviewImage();
      document.querySelector(".page-upload").classList.remove("modal");
    }

    if (e.target.matches("#btn-uploadCancel")) {
      cancelPreviewImage();
      document.querySelector(".page-upload").classList.remove("modal");
    }

    if (e.target.matches("#btn-pageFavourites") || e.target.matches("#btn-pageFavourites i")) {
      document.getElementById("favoritesCat").classList.remove("hide-page");
      document.getElementById("randomCats").classList.remove("show-page");
      document.getElementById("randomCats").classList.add("hide-page");
      document.getElementById("btn-pageFavourites").classList.add("bright");
      document.getElementById("btn-pageRandom").classList.remove("bright");
    }
    
    if (e.target.matches("#btn-pageRandom") || e.target.matches("#btn-pageRandom i")) {
      document.getElementById("randomCats").classList.remove("hide-page");
      document.getElementById("favoritesCat").classList.add("hide-page");
      document.getElementById("randomCats").classList.add("show-page");
      document.getElementById("btn-pageFavourites").classList.remove("bright");
      document.getElementById("btn-pageRandom").classList.add("bright");
    }

    if (e.target.matches("#btn-pageUpload") || e.target.matches("#btn-pageUpload i")) {
      document.getElementById("file").click();
      document.querySelector(".page-upload").classList.add("modal");
    }

    if (e.target.matches("#btn-arrowUp") || e.target.matches("#btn-arrowUp i")) {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  });

  document.addEventListener("change", e => {
    if (e.target.matches("#file")) {
      previewImage();
    }
  });

  window.addEventListener("scroll", e => {
    if (window.scrollY > 1200) {
      document.getElementById("btn-arrowUp").classList.remove("hide-arrowUp");
    } else {
      document.getElementById("btn-arrowUp").classList.add("hide-arrowUp");
    }
  })
});
