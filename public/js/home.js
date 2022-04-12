// Get the composant "blogs-section" and assign it to a variable
const blogSection = document.querySelector('.blogs-section');

// Function to get all posts on the DB and create posts on home page
function getAllPosts() {
    fetch('/getallposts', {
        method: 'GET',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
        }).then(res => res.json())
        .then(res => {
            for (let i = (res.length - 1); i >= 0; i--) {
                // Check if the post is print on the page and print only the ten lasts posts
                if (res[i].name != decodeURI(location.pathname.split("/").pop()) && (res.length - i) < 11) createBlog(res[i]);
            }
        });
}

// Call the function to get all posts
getAllPosts();

// Function to create a post on footer of the page
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