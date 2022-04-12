// Get the ID of the current page
let blogId = decodeURI(location.pathname.split("/").pop());

// Get composants of the HTML page and assign them to variables
const banner = document.querySelector('.banner');
const blogTitle = document.querySelector('.title');
const titleTag = document.querySelector('title');
const blogArticle = document.querySelector('.article');
let titlePage = document.getElementById('ttl');

// Function to get datas of a post depending of the blogID and print them on the front page
function getPost(blogId) {
    fetch('/getpost', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: blogId
        })
        }).then(res => res.json())
        .then(res => {
            banner.style.backgroundImage = `url(${res.banner})`;
            titleTag.innerHTML += blogTitle.innerHTML = res.title;
            titlePage = res.title;
            addArticle(blogArticle, res.description);
        });
}

// Call the function to get data of a post
getPost(blogId);


// function to parse description of articles
const addArticle = (ele, data) => {
    data = data.split("\n").filter(item => item.length);

    data.forEach(item => {
        // check for heading
        if(item[0] == '#'){
            let hCount = 0;
            let i = 0;
            while(item[i] == '#'){
                hCount++;
                i++;
            }
            let tag = `h${hCount}`;
            ele.innerHTML += `<${tag}>${item.slice(hCount, item.length)}</${tag}>`
        } 
        //checking for image format
        else if(item[0] == "!" && item[1] == "["){
            let seperator;

            for(let i = 0; i <= item.length; i++){
                if(item[i] == "]" && item[i + 1] == "(" && item[item.length - 1] == ")"){
                    seperator = i;
                }
            }

            let alt = item.slice(2, seperator);
            let src = item.slice(seperator + 2, item.length - 1);
            ele.innerHTML += `
            <img src="${src}" alt="${alt}" class="article-image">
            `;
        }

        else{
            ele.innerHTML += `<p>${item}</p>`;
        }
    })
}

// Function to delete a post from DB
function deletePost() {
    fetch('/deletepost', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: blogId
        })
    }).then(res => res.json())
    .then(res => {
        console.log(res);
    });
}

// Function to edit data of a post from DB
function editPost() {
    let btn = document.getElementById('edit-button');
    let docName = decodeURI(blogId);
    btn.href = `http://localhost:3000/${docName}/editor`;
}