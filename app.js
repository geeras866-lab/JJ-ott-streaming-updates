const createBtn =
    document.getElementById("createBtn");

const closeBtn =
    document.getElementById("closeBtn");

const firstPostBtn =
    document.getElementById("firstPostBtn");

const createSection =
    document.getElementById("createSection");

const publishBtn =
    document.getElementById("publishBtn");

const feed =
    document.getElementById("feed");

const emptyState =
    document.getElementById("emptyState");

const postCount =
    document.getElementById("postCount");

const imageInput =
    document.getElementById("imageInput");

const imagePreview =
    document.getElementById("imagePreview");


/* =========================
   OPEN CREATE
========================= */

function openCreatePost() {

    createSection.classList.remove(
        "hidden"
    );

    createSection.scrollIntoView({
        behavior: "smooth"
    });
}


createBtn.addEventListener(
    "click",
    openCreatePost
);


firstPostBtn.addEventListener(
    "click",
    openCreatePost
);


/* =========================
   CLOSE
========================= */

closeBtn.addEventListener(
    "click",
    () => {

        createSection.classList.add(
            "hidden"
        );

    }
);


/* =========================
   IMAGE PREVIEW
========================= */

imageInput.addEventListener(
    "change",
    () => {

        const file =
            imageInput.files[0];


        if (!file) {

            imagePreview.innerHTML = `

                <div class="poster-placeholder">

                    <span>🎬</span>

                    <p>Select Poster</p>

                </div>

            `;

            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            function(event) {

                imagePreview.innerHTML = `

                    <img
                        src="${event.target.result}"
                        alt="Poster"
                    >

                `;

            };


        reader.readAsDataURL(file);

    }
);


/* =========================
   LOAD POSTS
========================= */

let posts =
    JSON.parse(
        localStorage.getItem(
            "jjOttPosts"
        )
    ) || [];


/* =========================
   PUBLISH
========================= */

publishBtn.addEventListener(
    "click",
    () => {

        const title =
            document
                .getElementById("titleInput")
                .value
                .trim();


        const platform =
            document
                .getElementById("platformInput")
                .value;


        const date =
            document
                .getElementById("dateInput")
                .value;


        const description =
            document
                .getElementById(
                    "descriptionInput"
                )
                .value
                .trim();


        const file =
            imageInput.files[0];


        if (!title) {

            alert(
                "Movie / Series name enter cheyyi."
            );

            return;
        }


        if (!platform) {

            alert(
                "OTT platform select cheyyi."
            );

            return;
        }


        if (!description) {

            alert(
                "Information enter cheyyi."
            );

            return;
        }


        if (file) {

            const reader =
                new FileReader();


            reader.onload =
                function(event) {

                    savePost(
                        title,
                        platform,
                        date,
                        description,
                        event.target.result
                    );

                };


            reader.readAsDataURL(file);

        } else {

            savePost(
                title,
                platform,
                date,
                description,
                ""
            );

        }

    }
);


/* =========================
   SAVE
========================= */

function savePost(
    title,
    platform,
    date,
    description,
    image
) {

    const newPost = {

        id: Date.now(),

        title: title,

        platform: platform,

        date: date,

        description: description,

        image: image

    };


    posts.unshift(newPost);


    localStorage.setItem(
        "jjOttPosts",
        JSON.stringify(posts)
    );


    clearForm();

    renderPosts();

    createSection.classList.add(
        "hidden"
    );

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================
   RENDER
========================= */

function renderPosts() {

    feed.innerHTML = "";


    postCount.textContent =
        `${posts.length} ${
            posts.length === 1
                ? "Post"
                : "Posts"
        }`;


    if (posts.length === 0) {

        emptyState.classList.remove(
            "hidden"
        );

        return;
    }


    emptyState.classList.add(
        "hidden"
    );


    posts.forEach(
        post => {

            const article =
                document.createElement(
                    "article"
                );


            article.className =
                "post";


            const imageHTML =
                post.image
                ? `
                    <img
                        class="post-image"
                        src="${post.image}"
                        alt="${escapeHTML(
                            post.title
                        )}"
                    >
                `
                : "";


            const dateHTML =
                post.date
                ? `
                    <div class="post-date">

                        📅 Streaming:
                        ${formatDate(post.date)}

                    </div>
                `
                : "";


            article.innerHTML = `

                ${imageHTML}

                <div class="post-content">

                    <div class="post-top">

                        <div>

                            <h2 class="post-title">

                                ${escapeHTML(
                                    post.title
                                )}

                            </h2>

                            <span class="platform">

                                📺 ${escapeHTML(
                                    post.platform
                                )}

                            </span>

                        </div>


                        <button
                            class="delete-btn"
                            onclick="deletePost(${post.id})">

                            🗑️ Delete

                        </button>

                    </div>


                    ${dateHTML}


                    <p class="post-description">

                        ${escapeHTML(
                            post.description
                        )}

                    </p>

                </div>

            `;


            feed.appendChild(article);

        }
    );

}


/* =========================
   DELETE
========================= */

window.deletePost =
    function(id) {

        const answer =
            confirm(
                "Ee post delete cheyyala?"
            );


        if (!answer) {

            return;

        }


        posts =
            posts.filter(
                post =>
                    post.id !== id
            );


        localStorage.setItem(
            "jjOttPosts",
            JSON.stringify(posts)
        );


        renderPosts();

    };


/* =========================
   CLEAR
========================= */

function clearForm() {

    document.getElementById(
        "titleInput"
    ).value = "";


    document.getElementById(
        "platformInput"
    ).value = "";


    document.getElementById(
        "dateInput"
    ).value = "";


    document.getElementById(
        "descriptionInput"
    ).value = "";


    imageInput.value = "";


    imagePreview.innerHTML = `

        <div class="poster-placeholder">

            <span>🎬</span>

            <p>Select Poster</p>

        </div>

    `;

}


/* =========================
   DATE
========================= */

function formatDate(date) {

    return new Date(date)
        .toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

}


/* =========================
   SECURITY
========================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =========================
   START
========================= */

renderPosts();