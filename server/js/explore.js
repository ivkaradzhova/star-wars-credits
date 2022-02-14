function createElementFromHTMLString(str) {
    var div = document.createElement("div");
    div.innerHTML = str.trim();
    return div.firstChild;
}

function deleteAnimation(event, id) {
    event.preventDefault();
    fetch(`/api/animation/${id}`, {
            method: "DELETE"
        })
        .then(() => {
            console.log("deleted successfully");
            loadAnimationList()
        });
    return false;
}

function createListItem(title, id) {
    return createElementFromHTMLString(`
        <a class="nostyle" href="/#${id}">
            <div class="animation-list-item">
                <span class="animation-id">${id}</span>
                <div class="top-part">
                    <h3 class="card-title">${title}</h3>
                    <button class="delete-btn" onclick="deleteAnimation(event, ${id})"><img src="assets/images/delete_black_24dp.svg" alt="DELETE"></button>
                </div>
                <div class="color-bar"></div>
            </div>
        </a>
    `);
}

const animationList = document.getElementById("animationList");

function addToAnimationList(animation) {
    console.log("fetched animation:", animation);
    const listItem = createListItem(animation.name, animation.id);
    animationList.appendChild(listItem);
    if (animation.background_color !== "#262626") {
        const colorBar = listItem.querySelector(".color-bar");
        colorBar.style["background"] = animation.background_color;
    }
}

function loadAnimationList() {
    animationList.innerHTML = "";
    fetch("/api/animation")
        .then((response) => response.json())
        .then((animations) => {
            animations.forEach(addToAnimationList);
        });
}

loadAnimationList();