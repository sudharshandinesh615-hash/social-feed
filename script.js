async function loadPosts() {
    let feed = document.getElementById("feed");
    feed.innerHTML = "Loading...";

    let res = await fetch("http://localhost:3000/posts");
    let posts = await res.json();
    feed.innerHTML = "";

    posts.reverse().forEach((post, index) => {
        let commentsHTML = post.comments.map(c => <div class="comment">💬 ${c}</div>).join("");

        feed.innerHTML += `
        <div class="post">
            <b>${post.user}</b> <br>
            ${post.message} <br>
            <small>${post.time}</small> <br><br>

            ❤ ${post.likes}

            <button class="likeBtn" onclick="likePost(${index})">Like</button>

            <input class="commentBox" id="c${index}" placeholder="Write a comment...">
            <button class="commentBtn" onclick="commentPost(${index})">Comment</button>

            <div>${commentsHTML}</div>
        </div>
        `;
    });
}

async function createPost() {
    let user = document.getElementById("user").value;
    let msg = document.getElementById("msg").value;

    if (!user || !msg) return alert("Enter name and message!");

    await fetch("http://localhost:3000/add", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({user, message: msg})
    });

    document.getElementById("msg").value = "";
    loadPosts();
}

async function likePost(id) {
    await fetch("http://localhost:3000/like", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id})
    });
    loadPosts();
}

async function commentPost(id) {
    let comment = document.getElementById("c" + id).value;
    if (!comment) return;

    await fetch("http://localhost:3000/comment", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id, comment})
    });

    loadPosts();
}

loadPosts();
