let addListPopup, listMenuPopup, clickedListId;
let lists = [];

window.onload = () => {
    addListPopup = document.getElementById("add-list-popup");
    listMenuPopup = document.getElementById("list-menu-popup");
    fetchData();
    limitWrapperHeight();
}


/* ------------------fetching data -------------------------------------*/

const END_POINT = "https://trello-clone-ppm.herokuapp.com";

function fetchData() {
    fetch(END_POINT + '/list')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            lists = data;
            const list = data.map(l => getList(l)).join('') + addAnotherListBtn;
            document.getElementById('wrapper').innerHTML = list;
        })
        .catch(error => {
            console.log(error);
        })
}

const addAnotherListBtn = ` <button class="btn btn-lg add-list text-left " id="add-list-btn" onclick="addNewList(event)">
                              <i class="fa fa-plus"></i> &nbsp;&nbsp;&nbsp;Add another list
                            </button> &nbsp;&nbsp;&nbsp;`;
/* ------------Display lists and cards ----------------------*/

const getList = (list) => {

    const cardString = list.cards ? list.cards.map(c => getCard(c, list)).join("") : "";

    return `<div class="trello-list rounded m-1 px-2 py-1 trello-fadein" list-id="${list.id}">
            <div class="d-flex justify-content-between align-items-center mb-1">
                <h6 class="pl-2">${list.title}</h6>
                <button class="btn btn-sm stretch-x" list-id="${list.id}" onclick="listOption(event)"><i class="fa fa-ellipsis-h"></i></button>
            </div>
            ${cardString}
            <div class="d-flex justify-content-between align-items-center mt-1">
                <button class="btn btn-sm text-left" id="add-new-card"><i class="fa fa-plus"></i>&nbsp;&nbsp;Add another card</button>
                <button class="btn btn-sm"><i class="fa fa-window-maximize"></i></button>
            </div>
          </div>`
}

const getCard = (card, list) => {
    const memberString = card.members ? card.members.map(member => getMemeberInitial(member)).join("") : "";
    const labelString = card.labels ? card.labels.map(label => getLabel(label)).join('') : "";
    const paddingTop = labelString ? '0' : '10px';
    return `<div class="trello-card my-1" data-toggle="modal" data-target="#exampleModal" style="padding-top: ${paddingTop}" onclick="cardClicked(event)" card-id="${card.id}" list-id="${list.id}">
             
              ${labelString}
              <h6 class="trello-title"> ${card.title} </h6>
              <div class="d-flex">
                <div class="mt-1"> 
                  <small class="d-inline-block m-1 mr-2 text-secondary"><i class="fa fa-bars"></i></small>
                  ${card.checklists.length ? '<small class="d-inline-block m-1 mr-2 text-secondary"> <i class="far fa-calendar-check"></i> </small>' : ''}
                </div>
                ${memberString}
              </div>
          </div>`
}

function getLabel(label) {

    return `<span class="trello-label d-inline-block my-2 mr-1" style="background-color:${label.color}"> &nbsp; </span>`
}

const getMemeberInitial = (member) => {
    const names = member.name.trim().split(" ");
    console.log(names);
    let initials = names[0][0]; //shae sone ka yk first leter 

    if (names.length > 1) {
        initials += names[names.length - 1][0];
    } else if (names[0].length > 1) {
        initials += names[0][1]
    }
    initials = initials.toUpperCase();

    if (!initials)
        return '';
    else
        return `<div class="avatar" id="test">${initials}</div>`;
}



function listOption(event) {
    event.stopPropagation();
    if (listMenuPopup.style.display == "block") {
        listMenuPopup.style.display = "none";
    } else {

        let btn = event.target;
        // console.log(btn.parentNode);

        if (btn.nodeName == "i" || btn.nodeName == "I") {
            btn = btn.parentNode;
        }
        clickedListId = btn.getAttribute("list-id");

        const loc = btn.getBoundingClientRect();

        listMenuPopup.style.top = loc.top + loc.height + 5 + "px";


        listMenuPopup.style.left = loc.left + "px";
        listMenuPopup.style.display = "block";
    }

}

function closeOptionMenu() {
    if (listMenuPopup.style.display == "block")
        listMenuPopup.style.display = "none";
    if (addListPopup.style.display === "block") {
        toggelAddListPopup(false);
    }
}

function toggelAddListPopup(isOpen) {
    if (addListPopup) {
        addListPopup.style.display = isOpen ? "block" : "none";
        if (isOpen) {
            document.getElementById("list-title-input").focus();
        }
    }
}



function addNewList(event) {
    event.stopPropagation();
    if (addListPopup) {
        const addNewListBtn = document.getElementById("add-list-btn");
        const rect = addNewListBtn.getBoundingClientRect();
        console.log(rect);

        addListPopup.style.top = rect.top + "px";
        addListPopup.style.left = rect.left + "px";
        addListPopup.style.width = rect.width + "px";
        toggelAddListPopup(true);
    }
}



function limitWrapperHeight() {
    // The document.documentElement property gives you the html element, while the document.body property gives you the body element.
    //clientHeight can be calculated as: CSS height + CSS padding - height of horizontal scrollbar (if present).
    const body = document.documentElement.clientHeight;
    const nav1 = document.getElementById("nav1").clientHeight;
    const nav2 = document.getElementById("nav2").clientHeight;
    const wrapper = document.getElementById("wrapper");
    wrapper.style.maxHeight = (body - nav1 - nav2) + "px";
    wrapper.style.minHeight = (body - nav1 - nav2) + "px";
}

function wrapperScrolled() {
    closeOptionMenu();
    if (addListPopup.style.display === "block") {
        const rect = document.getElementById("add-list-btn").getBoundingClientRect();
        addListPopup.style.top = rect.top + "px";
        addListPopup.style.left = rect.left + "px";
    }
}



const getListAndCardIds = (target) => {
    if (target.getAttribute("card-id")) {
        return [target.getAttribute("list-id"), target.getAttribute("card-id")];
    } else {
        return getListAndCardIds(target.parentElement);
    }
}

function cardClicked(e) {
    const [listId, cardId] = getListAndCardIds(e.target); // event.target returns the element that trigger the event 

    const list = lists.find(l => l.id == listId);
    const card = list.cards.find(c => c.id == cardId);

    document.getElementById("modal-h1").innerHTML = card.title;
    document.getElementById("modal-a").innerHTML = list.title;
    if (card.description)
        document.getElementById("modal-description").innerHTML = card.description;
    else
        document.getElementById("modal-description").innerHTML = 'No description';

    // const chkliStr = card.checklists.map(li => getChkliItem(li)).join("");
    // document.getElementById("chkli-wrapper").innerHTML = chkliStr || '<p style="opacity: 0.7">No Checklist</p>';
}


/* ---------------------------------------------
         delete list and save new list 
------------------------------------------------*/

function deleteList() {
    if (clickedListId) {
        closeOptionMenu();
        if (confirm("Are you sure to delete this list?")) {
            // setLoading(true);
            fetch(`${END_POINT}/list/${clickedListId}`, {
                    method: "DELETE"
                })
                .then(res => {
                    console.log(res);
                    // setLoading(false);
                    const listToRemove = document.querySelector(`.trello-list[list-id="${clickedListId}"]`);
                    if (res.ok && listToRemove) {
                        listToRemove.remove();
                        clickedListId = undefined;
                    }
                })
                .catch(err => {
                    console.log(err);
                    // setLoading(false);
                    clickedListId = undefined;
                })
        }
    }
}

function inputEntered(event) {
    if (event.keyCode == 13) { // 13 = enter key 
        // detect Enter key, if user hits enter then save new list
        saveNewList();
    }
}

function saveNewList() {
    const listTitleInput = document.getElementById("list-title-input");
    const listTitle = listTitleInput.value;
    if (listTitle) {
        //setLoading(true);
        fetch(END_POINT + "/list", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: listTitle,
                    position: lists.length + 1
                })
            })
            .then(res => res.json())
            .then(data => {
                //setLoading(false);
                listTitleInput.value = "";
                toggelAddListPopup(false);
                const doc = new DOMParser().parseFromString(getList(data), "text/html");
                const newlyAddedList = doc.body.children[0];
                document.getElementById("add-list-btn").before(newlyAddedList);
                lists.push(data);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            })
    }
}

