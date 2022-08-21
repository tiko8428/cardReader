const LoadWrapper = document.getElementById("load_section");
const fileInput = document.getElementById("file_input");
const table = document.getElementById("table");
const deleteButton = document.getElementById("deleteRow");
const editButton = document.getElementById("editRow");

const headerSortButtons = Array.from(document.querySelectorAll("thead tr td"));

let sortBy = "cardNumber";
let selectedItem = "";
LoadWrapper.addEventListener("mousedown", handelLoad);
fileInput.addEventListener("change", handelImage);

window.addEventListener("load", () => {
  for (let i = 1; i <= headerSortButtons.length - 1; i += 1) {
    const buttonItem = headerSortButtons[i];
    buttonItem.addEventListener("click", () => {
      sortBy = buttonItem.innerHTML;
      handelUpdateTable();
    });
  }
  handelUpdateTable();
  deleteButton.addEventListener("click", () => {
    if (selectedItem) {
      handelDeleteRow(selectedItem);
    }
  });
  editButton.addEventListener("click", () => {
    if (selectedItem) {
      axios
        .get(`/get-item?id=${selectedItem}`)
        .then((res) => res.data)
        .then((res) => {
          updatePopupData(res);
          handelOpenPopup();
        });
    }
  });
});

const handelUpdateTable = () => {
  headerSortButtons.forEach((item) => {
    if (item.innerHTML === sortBy) {
      item.style.color = "red";
    } else {
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

const updateSelection = () => {
  const checkboxes = document.querySelectorAll("table input");
  const checkboxArray = Array.from(checkboxes);
  checkboxArray.forEach((item) => {
    if (item.name !== selectedItem) {
      item.checked = false;
    }
  });
};

const handelDeleteRow = (id) => {
  const currentItem = JSON.stringify({ id: id });
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

    const actionCol = document.createElement("td");
    const selectCol = document.createElement("input");
    selectCol.classList.add("selectInput");

    selectCol.type = "checkbox";

    selectCol.name = item.id;
    selectCol.addEventListener("click", (e) => {
      const targetId = e.target.name;
      if (targetId === selectedItem) {
        selectedItem = "";
      } else {
        selectedItem = targetId;
      }
      updateSelection();
    });
    actionCol.classList.add("row_Action_Wrapper");
    actionCol.appendChild(selectCol);
    row.appendChild(actionCol);
    for (const key of Object.keys(item)) {
      const val = item[key];
      if ((key !== "id") & (key !== "systemImageName")) {
        const col = document.createElement("td");
        col.textContent = val;
        row.appendChild(col);
      }
    }
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
        handelUpdateTable();
      });
  });
}

// popup
const popup = document.getElementById("popup");
const closePopupButton = document.getElementById("closePopup");
const savePopupButton = document.getElementById("saveRow");

closePopupButton.addEventListener("click", () => {
  handelClosePopup();
  selectedItem = "";
  updateSelection();
});

savePopupButton.addEventListener("click", async ()=>{
  await handelSavePopup()
  handelClosePopup();
  selectedItem = "";
  updateSelection();
})

const updatePopupData = (data)=>{
  const inputs = popup.querySelectorAll("input");
  const inputArray = Array.from(inputs);
  inputArray.forEach(item=>{
    item.value = data[item.name];
  })
};
const handelOpenPopup = () => {
  popup.style.display = "flex";
};

const handelClosePopup = () => {
  popup.style.display = "none";
};

const handelSavePopup = async () => {
  
  const inputs = popup.querySelectorAll("input");
  const inputArray = Array.from(inputs);
  let data = {
    id: selectedItem
  };
  inputArray.forEach(item=>{
    const key = item.name
    const value = item.value 
    data[key] = value;
  })
  axios.post("updateRow", {
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    }
  }).then(res=>res.data)
  .then((data)=>{
    if(data.status === "error"){
      alert("error in server \n CONTACT TO TIKO")
    }
    handelUpdateTable();
  })
};
