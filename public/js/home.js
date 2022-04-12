const blogSection = document.querySelector('.blogs-section');

function getAllPosts() {
    fetch('/getallposts', {
        method: 'GET',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
        }).then(res => res.json())
        .then(res => {
            for (let i = 0; i < res.length; i++) {
                if (res[i].name != decodeURI(location.pathname.split("/").pop())) createBlog(res[i]);
            }
        });
}

getAllPosts();

const createBlog = (blog) => {
    blogSection.innerHTML += `
    <div class="blog-card">
        <img src="${blog.banner}" class="blog-image" alt="">
        <h1 class="blog-title">${blog.title.substring(0, 100) + '...'}</h1>
        <p class="blog-overview">${blog.description.substring(0, 200) + '...'}</p>
        <a href="/${blog.name}" class="btn dark">read</a>
    </div>
    `;
}