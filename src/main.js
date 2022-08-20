const LoadWrapper = document.getElementById("load_section");
const fileInput = document.getElementById("file_input");
const textDataListElem = document.getElementById("text_data_list");
const table = document.getElementById("table");
const headerSortButtons =Array.from( document.querySelectorAll("thead tr td"));

let sortBy = "cardNumber";

LoadWrapper.addEventListener("mousedown", handelLoad);
fileInput.addEventListener("change", handelImage);

window.addEventListener("load", () => {
  for(let i =0;i <= headerSortButtons.length-2 ;i+=1 ){
    const buttonItem = headerSortButtons[i];
    buttonItem.addEventListener("click",()=>{
      sortBy = buttonItem.innerHTML;
      handelUpdateTable();
    })
  } 
  handelUpdateTable();
});

const handelUpdateTable = () => {
  headerSortButtons.forEach(item=>{
    if(item.innerHTML === sortBy){
      item.style.color = "red";
    } else{
      item.style.color = "#fff";
    }
  });
  axios
    .get(`/all-in-db?sort=${sortBy}`)
    .then((res) => res.data)
    .then((res) => {
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
    deleteButton.classList.add("row_Action")
    actionCol.classList.add("row_Action_Wrapper")
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
