const LoadWrapper = document.getElementById("load_section");
const fileInput = document.getElementById("file_input");
const deleteButton = document.getElementById("deleteRow");
const editButton = document.getElementById("editRow");
const selectShow = document.getElementById("selectShow");

const downloadJson = document.getElementById("downloadJson");
const dwownloadSelect = document.getElementById("dwownloadSelect");

const creatButton = document.getElementById("creteRow");

const table = document.getElementById("table");
// const headerSortButtons = Array.from(document.querySelectorAll("thead tr td"));

let downloadJsonType = "en";

let sortBy = "cardNumber";
let selectedItem = "";
let show = "en";

window.addEventListener("load", () => {
  // ******** main header 

  dwownloadSelect.addEventListener("change", (e) => {
    downloadJsonType = e.target.value || "all"
  })

  downloadJson.addEventListener("click", () => {
    const a = document.createElement("a");
    a.setAttribute("href", `/src/json/data/${downloadJsonType}.json`)
    a.setAttribute("download", "")
    a.click();
  })

  //  main header ******** 

  LoadWrapper.addEventListener("mousedown", (e) => {
    e.preventDefault();
    if (fileInput) {
      fileInput.click();
    }
  });

  fileInput.addEventListener("change", handelImage);

  deleteButton.addEventListener("click", () => {
    if (selectedItem) {
      let r = confirm(`Are You Sure you want to delete ${selectedItem} from ${show.toUpperCase()} language `)
      if (r) {
        axios
          .delete(`/json/delete-row?cardNumber=${selectedItem}&lang=${show}`, {
          })
          .then((res) => {
            handelUpdateTable();
            selectedItem = ""
            success();
          }).catch(() => {
            error();
          });
      }
    } else {
      alert("pleas select a row")
    }
  });

  editButton.addEventListener("click", () => {
    if (selectedItem) {
      axios
        .get(`json/get-item?cardNumber=${selectedItem}&lang=${show}`)
        .then((res) => res.data)
        .then((res) => {
          handelOpenPopup(res, show);
        }).catch(err => {
          if (err.response?.data?.error) {
            alert(err.response.data.error)
          }
        });
    } else {
      alert("pleas select ROW")
    }
  });

  creatButton.addEventListener("click", () => {
    handelOpenCreatePopup()
  })

  selectShow.addEventListener("change", (e) => {
    show = e.target.value || "all"
    // download all in current file 
    handelUpdateTable();
  })
  show = selectShow.value
  downloadJsonType = dwownloadSelect.value
  handelUpdateTable();
});

const handelUpdateTable = () => {
  axios.get(`json/by-lang?lang=${show}`).then((res) => {
    updateTextDataListUi(res.data[show]);
  }).catch(() => { })
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


function updateTextDataListUi(data) {
  if (!data) return;
  table.innerHTML = "";
  let rowNum = 0
  const renderCol = ["cardNumber", "field1", "field2", "field3", "field4", "field5", "field6", "category",]
  for (const item in data) {
    const rowData = data[item];
    rowNum += 1;
    const row = document.createElement("tr");
    const actionCol = document.createElement("td");
    const selectCol = document.createElement("input");
    selectCol.classList.add("selectInput");

    selectCol.type = "checkbox";

    selectCol.name = item;
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
    const rowNumber = document.createElement("span");
    rowNumber.innerHTML = rowNum
    actionCol.appendChild(rowNumber);
    actionCol.appendChild(selectCol);
    row.appendChild(actionCol);

    renderCol.forEach(cal => {
      const col = document.createElement("td");
      const colData = rowData[cal] || "empty string"
      col.textContent = colData;
      if (colData === "empty string") {
        col.style.fontWeight = "bold";
      }
      row.appendChild(col);
    })
    table.appendChild(row);
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
      .post("/get-data-array", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        handelOpenPopup(data.row, data.lang)
        // handelUpdateTable();
        success();
      }).catch(err => {
        error()
      })
  });
}

//////////////////////// EDIT popup
const popup = document.getElementById("popupEdit");
const closePopupButton = document.getElementById("closeEditPopup");
const savePopupButton = document.getElementById("saveChanges");

closePopupButton.addEventListener("click", () => {
  handelClosePopup();
  selectedItem = "";
  updateSelection();
});

savePopupButton.addEventListener("click", () => {
  const inputs = popup.querySelectorAll("input");
  const editLanguage = popup.querySelectorAll("select")[0];
  const inputArray = Array.from(inputs);
  let data = {};
  inputArray.forEach(item => {
    const key = item.name
    const value = item.value
    data[key] = value;
  })
  data.imageName = "";
  axios.put("json/updateRow", {
    body: { row: data, language: editLanguage.value, oldCardNumber: selectedItem},
    headers: {
      "Content-Type": "application/json",
    }
  }).then(res => {
    handelClosePopup();
    selectedItem = "";
    handelUpdateTable();
  }).catch(err => {
    if (err.response.error) {
      alert("error in server \n CONTACT TO TIKO")
    }
  })
})

const updatePopupData = (data) => {
  const inputs = popup.querySelectorAll("input");
  const inputArray = Array.from(inputs);
  inputArray.forEach(item => {
    item.value = data[item.name];
  })
};

const handelOpenPopup = (res, lang) => {
  const inputs = popup.querySelectorAll("input");
  const inputArray = Array.from(inputs);
  const selectLanguage = popup.querySelectorAll("select")[0];
  selectLanguage.value = lang;
  inputArray.forEach(item => {
    item.value = res[item.name];
  })
  popup.style.display = "flex";
};

const handelClosePopup = () => {
  popup.style.display = "none";
};

//////////////////////    /////////////////////////
///////// CRETE POPUP ////////////////////

const createPopup = document.getElementById("popupCreate");
const closeCreatePopupButton = document.getElementById("closeCreatePopup");
const saveCreatePopupButton = document.getElementById("saveNewRow");
const selectCreateLanguage = document.getElementById("selectCreateLanguage");

closeCreatePopupButton.addEventListener("click", () => {
  handelCloseCreatePopup();
});

saveCreatePopupButton.addEventListener("click", async (e) => {
  const formatedData = {
    cardNumber: "",
    field1: "",
    field2: "",
    field3: "",
    field4: "",
    field5: "",
    field6: "",
    category: "",
    imageName: "",
  }
  const fieldElements = document.querySelectorAll("#crateFieldWrapper input");
  const fields = Array.from(fieldElements);
  fields.forEach(field => {
    const fieldName = field.name;
    const fieldValue = field.value;
    formatedData[fieldName] = fieldValue;
  })
  console.log(formatedData);
  axios.post("json/newRow", {
    body: {
      language: selectCreateLanguage.value,
      row: formatedData
    },
    headers: {
      "Content-Type": "application/json",
    },
  }).then(res => {
    // update tabele
    handelCloseCreatePopup();
    handelUpdateTable()
    success()
  }).catch(err => {
    console.log(err.response.data.error);
    if (err.response.data?.error) {
      alert(err.response.data.error);
    } else {
      error()
    }
  })
})

const resetCreatePopupData = () => {
  const inputs = createPopup.querySelectorAll("input[type=text]");
  const inputArray = Array.from(inputs);
  inputArray.forEach(item => {
    item.value = "";
  })
  selectCreateLanguage.value = show
};

function handelOpenCreatePopup() {
  resetCreatePopupData()
  createPopup.style.display = "flex";
};

const handelCloseCreatePopup = () => {
  createPopup.style.display = "none";
};
/////////////// CREATE POPUP /////////////////
function success() {
  const elem = document.getElementById("success");
  elem.style.display = "block";
  setTimeout(() => {
    elem.style.display = "none"
  }, 2500)
}

function error() {
  const elem = document.getElementById("error");
  elem.style.display = "block";
  setTimeout(() => {
    elem.style.display = "none"
  }, 2500)
}