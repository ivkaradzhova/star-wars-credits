function createElementFromHTMLString(str) {
    var div = document.createElement("div");
    div.innerHTML = str.trim();
    return div.firstChild;
}

function createListItem(title, id) {
    return createElementFromHTMLString(`
        <a class="nostyle" href="/#${id}">
            <div class="animation-list-item">
                <div class="top-part">
                    <h3 class="card-title">${title}</h3>
                    <button class="delete-btn"><img src="assets/images/delete_black_24dp.svg" alt="DELETE"></button>
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
}

fetch("/api/animation")
    .then((response) => response.json())
    .then((animations) => {
        animations.forEach(addToAnimationList);
    });