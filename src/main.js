const LoadWrapper = document.getElementById("load_section");
const fileInput = document.getElementById("file_input");
const textDataListElem = document.getElementById("text_data_list");
const table = document.getElementById("table");
const sortButton = document.getElementById("sort_by_card_number")
const downloadDB = document.getElementById("download_Db")

LoadWrapper.addEventListener("mousedown", handelLoad);
fileInput.addEventListener("change", handelImage);

window.addEventListener("load", () => {
  handelUpdateTable();
});

sortButton.addEventListener("click", ()=>{
  axios
    .get("/all-in-db?sort=cardNumber")
    .then((res) => res.data)
    .then((res) => {
      // data = res;
      updateTextDataListUi(res);
    });
})

const handelUpdateTable = () => {
  axios
    .get("/all-in-db")
    .then((res) => res.data)
    .then((res) => {
      // data = res;
      updateTextDataListUi(res);
    });
};

const handelDeleteRow = (item, e) => {
  const currentItem = JSON.stringify(item);
  axios
    .post("/delete-row", {
      body: currentItem,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      handelUpdateTable();
    });
};

function updateTextDataListUi(data) {
  table.innerHTML = "";
  for (const item of data) {
    const row = document.createElement("tr");
    for (const key of Object.keys(item)) {
      const val = item[key];
      if (key !== "id" & key !== "systemImageName") {
        const col = document.createElement("td");
        col.textContent = val;
        row.appendChild(col);
      }
    }

    const actionCol = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "DELETE";
    deleteButton.name = item.id;
    deleteButton.addEventListener("click", (e) => {
      handelDeleteRow(item, e);
    });
    actionCol.style.textAlign = "center";
    actionCol.style.cursor = "pointer";
    actionCol.appendChild(deleteButton);
    row.appendChild(actionCol);

    table.appendChild(row);
  }
}

function handelLoad(e) {
  e.preventDefault();
  if (fileInput) {
    fileInput.click();
  }
}

function handelImage(e) {
  if (e.target.files.length > 0) {
    const images = Array.from(e.target.files);
    if (images.length > 0) {
      filesToBase64(images);
    }
  }
}

function filesToBase64(images) {
  images.forEach((file) => {
    let formData = new FormData();
    formData.append("file", file);
    axios
      .post("/get-image-data", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        handelUpdateTable();
      });
  });
}

// function getBase64(file) {
//   var reader = new FileReader();
//   reader.readAsDataURL(file);

//   reader.onload = async () => {
//     const newBase64 = reader.result.replace(/^data:image\/[a-z]+;base64,/, "");
//     const textData = await getTextFromImage(newBase64).then((response) =>
//       response.json()
//     );
//   };

//   reader.onerror = function (error) {
//     console.log("Error: ", error);
//   };
// }

// function getTextFromImage(imageData) {
//   return new Promise((resolve, reject) => {
//     fetch("/get-image-data", {
//       method: "post",
//       body: JSON.stringify({ text: imageData }),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }).then((res) => {
//       resolve(res);
//     });
//   });
// }
