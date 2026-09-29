const { createClient } = window.supabase;


/* =========================
   SUPABASE
========================= */

const SUPABASE_URL =
    "https://vszlrvljidnlnwowuaex.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_tnIPTKErunWkGDhDZ2aY9Q_Tfe8EmnZ";

const supabaseClient =
    createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/* =========================
   ADMIN
========================= */

const ADMIN_UID =
    "5cf740b8-365b-4b73-8115-dfb370bffa96";


/* =========================
   ELEMENTS
========================= */

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

const loginBtn =
    document.getElementById("loginBtn");

const logoutBtn =
    document.getElementById("logoutBtn");

const loginModal =
    document.getElementById("loginModal");

const closeLoginBtn =
    document.getElementById("closeLoginBtn");

const submitLoginBtn =
    document.getElementById("submitLoginBtn");

const emailInput =
    document.getElementById("emailInput");

const passwordInput =
    document.getElementById("passwordInput");

const loginMessage =
    document.getElementById("loginMessage");


/* =========================
   CREATE
========================= */

function openCreatePost() {

    createSection.classList.remove("hidden");

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

closeBtn.addEventListener(
    "click",
    () => {
        createSection.classList.add("hidden");
    }
);


/* =========================
   LOGIN
========================= */

loginBtn.addEventListener(
    "click",
    () => {

        loginModal.classList.remove("hidden");

        emailInput.focus();

    }
);


closeLoginBtn.addEventListener(
    "click",
    () => {

        loginModal.classList.add("hidden");

    }
);


/* =========================
   ADMIN UI
========================= */

function showAdminUI() {

    loginBtn.classList.add("hidden");

    logoutBtn.classList.remove("hidden");

    createBtn.classList.remove("hidden");

    firstPostBtn.classList.remove("hidden");

    document
        .querySelectorAll(".delete-btn")
        .forEach(button => {

            button.classList.remove("hidden");

        });
}


function hideAdminUI() {

    loginBtn.classList.remove("hidden");

    logoutBtn.classList.add("hidden");

    createBtn.classList.add("hidden");

    firstPostBtn.classList.add("hidden");

    createSection.classList.add("hidden");

    document
        .querySelectorAll(".delete-btn")
        .forEach(button => {

            button.classList.add("hidden");

        });
}


/* =========================
   SESSION
========================= */

async function checkAdminSession() {

    const {
        data
    } =
        await supabaseClient
            .auth
            .getSession();


    const session =
        data.session;


    if (
        session &&
        session.user &&
        session.user.id === ADMIN_UID
    ) {

        showAdminUI();

    } else {

        hideAdminUI();

    }
}


/* =========================
   LOGIN
========================= */

submitLoginBtn.addEventListener(
    "click",
    async () => {

        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;


        if (!email || !password) {

            loginMessage.textContent =
                "Email and password enter cheyyi.";

            return;

        }


        submitLoginBtn.disabled = true;

        submitLoginBtn.textContent =
            "Logging in...";


        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .signInWithPassword({
                    email: email,
                    password: password
                });


        if (error) {

            loginMessage.textContent =
                error.message;

            submitLoginBtn.disabled =
                false;

            submitLoginBtn.textContent =
                "🔐 Login";

            return;
        }


        if (
            !data.user ||
            data.user.id !== ADMIN_UID
        ) {

            await supabaseClient
                .auth
                .signOut();


            loginMessage.textContent =
                "This account is not authorized as admin.";

            submitLoginBtn.disabled =
                false;

            submitLoginBtn.textContent =
                "🔐 Login";

            return;
        }


        loginMessage.textContent =
            "Login successful!";


        showAdminUI();


        setTimeout(
            () => {

                loginModal.classList.add(
                    "hidden"
                );

                loginMessage.textContent =
                    "";

                emailInput.value =
                    "";

                passwordInput.value =
                    "";

            },
            500
        );


        submitLoginBtn.disabled =
            false;

        submitLoginBtn.textContent =
            "🔐 Login";

    }
);


/* =========================
   LOGOUT
========================= */

logoutBtn.addEventListener(
    "click",
    async () => {

        await supabaseClient
            .auth
            .signOut();

        hideAdminUI();

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
   PUBLISH
========================= */

publishBtn.addEventListener(
    "click",
    publishPost
);


async function publishPost() {

    const {
        data: sessionData
    } =
        await supabaseClient
            .auth
            .getSession();


    const session =
        sessionData.session;


    if (
        !session ||
        session.user.id !== ADMIN_UID
    ) {

        alert(
            "Admin login required."
        );

        return;
    }


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
            .getElementById("descriptionInput")
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


    publishBtn.disabled = true;

    publishBtn.textContent =
        "Publishing...";


    try {

        let posterUrl = "";


        if (file) {

            const extension =
                file.name
                    .split(".")
                    .pop()
                    .toLowerCase();


            const fileName =
                `${Date.now()}-${Math.random()
                    .toString(36)
                    .substring(2)}.${extension}`;


            const {
                error: uploadError
            } =
                await supabaseClient
                    .storage
                    .from("posters")
                    .upload(
                        fileName,
                        file,
                        {
                            cacheControl: "3600",
                            upsert: false
                        }
                    );


            if (uploadError) {
                throw uploadError;
            }


            const {
                data: publicUrlData
            } =
                supabaseClient
                    .storage
                    .from("posters")
                    .getPublicUrl(
                        fileName
                    );


            posterUrl =
                publicUrlData.publicUrl;
        }


        const {
            error: insertError
        } =
            await supabaseClient
                .from("posts")
                .insert({

                    title: title,

                    platform: platform,

                    streaming_date:
                        date || null,

                    description:
                        description,

                    poster_url:
                        posterUrl,

                    category:
                        "Movies"

                });


        if (insertError) {
            throw insertError;
        }


        alert(
            "🎉 Post published successfully!"
        );


        clearForm();


        createSection.classList.add(
            "hidden"
        );


        await loadPosts();


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


    } catch (error) {

        console.error(
            "Publish error:",
            error
        );


        alert(
            "Post publish avvaledu:\n" +
            error.message
        );

    }


    publishBtn.disabled = false;

    publishBtn.textContent =
        "🚀 Publish Update";
}


/* =========================
   LOAD POSTS
========================= */

async function loadPosts() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("posts")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Load posts error:",
            error
        );

        return;
    }


    renderPosts(data || []);
}


/* =========================
   RENDER
========================= */

function renderPosts(posts) {

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
                post.poster_url
                    ? `
                        <img
                            class="post-image"
                            src="${escapeHTML(post.poster_url)}"
                            alt="${escapeHTML(post.title)}"
                        >
                    `
                    : "";


            const dateHTML =
                post.streaming_date
                    ? `
                        <div class="post-date">
                            📅 Streaming:
                            ${formatDate(
                                post.streaming_date
                            )}
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
                            class="delete-btn hidden"
                            data-id="${post.id}">

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


            const deleteButton =
                article.querySelector(
                    ".delete-btn"
                );


            deleteButton.addEventListener(
                "click",
                () => deletePost(
                    post.id,
                    post.poster_url
                )
            );


            feed.appendChild(article);

        }
    );


    checkAdminSession();

}


/* =========================
   DELETE
========================= */

async function deletePost(
    id,
    posterUrl
) {

    const answer =
        confirm(
            "Ee post delete cheyyala?"
        );


    if (!answer) return;


    try {

        const {
            error
        } =
            await supabaseClient
                .from("posts")
                .delete()
                .eq(
                    "id",
                    id
                );


        if (error) {
            throw error;
        }


        if (posterUrl) {

            try {

                const url =
                    new URL(
                        posterUrl
                    );


                const marker =
                    "/storage/v1/object/public/posters/";


                const index =
                    url.pathname.indexOf(
                        marker
                    );


                if (index !== -1) {

                    const filePath =
                        decodeURIComponent(
                            url.pathname.substring(
                                index +
                                marker.length
                            )
                        );


                    await supabaseClient
                        .storage
                        .from("posters")
                        .remove([
                            filePath
                        ]);

                }

            } catch (storageError) {

                console.warn(
                    "Poster delete warning:",
                    storageError
                );

            }

        }


        await loadPosts();


    } catch (error) {

        console.error(
            "Delete error:",
            error
        );


        alert(
            "Delete avvaledu:\n" +
            error.message
        );

    }
}


/* =========================
   CLEAR FORM
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

    return new Date(
        date + "T00:00:00"
    ).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text ?? "";

    return div.innerHTML;
}


/* =========================
   REALTIME
========================= */

supabaseClient
    .channel("posts-feed")
    .on(
        "postgres_changes",
        {
            event: "*",
            schema: "public",
            table: "posts"
        },
        () => {

            loadPosts();

        }
    )
    .subscribe();


/* =========================
   AUTH STATE
========================= */

supabaseClient
    .auth
    .onAuthStateChange(
        () => {

            checkAdminSession();

        }
    );


/* =========================
   START
========================= */

async function startApp() {

    await checkAdminSession();

    await loadPosts();

}


startApp();
