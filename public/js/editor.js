// Get composants from HTML file and assign them to variables
const blogTitleField = document.querySelector('.title');
const articleField = document.querySelector('.article');
let blogId = location.pathname.split("/");

const bannerImage = document.querySelector('#banner-upload');
const banner = document.querySelector(".banner");
let bannerPath;

const publishBtn = document.querySelector('.publish-btn');
const uploadInput = document.querySelector('#image-upload');

// Call shift() to delete the first element of blogId
blogId.shift();

// Call function upload when upload icon click
bannerImage.addEventListener('change', () => {
    uploadImage(bannerImage, "banner");
})

// function to upload an image from PC to folder "uploads/"
const uploadImage = (uploadFile, uploadType) => {
    const [file] = uploadFile.files;
    if(file && file.type.includes("image")){
        const formdata = new FormData();
        formdata.append('image', file);

        fetch('/upload', {
            method: 'post',
            body: formdata
        }).then(res => res.json())
        .then(data => {
            if(uploadType == "image"){
                addImage(data, file.name);
            } else{
                bannerPath = `${location.origin}/${data}`;
                banner.style.backgroundImage = `url("${bannerPath}")`;
            }
        })
    } else{
        alert("upload Image only");
    }
}

// Call function upload when upload icon click
uploadInput.addEventListener('change', () => {
    uploadImage(uploadInput, "image");
})

// function to add an image to the description of an article
const addImage = (imagepath, alt) => {
    let curPos = articleField.selectionStart;
    let textToInsert = `\r![${alt}](${imagepath})\r`;
    articleField.value = articleField.value.slice(0, curPos) + textToInsert + articleField.value.slice(curPos);
}

// Function to publish an article
publishBtn.addEventListener('click', () => {
    // Check if the post has a title and a description
    if(articleField.value.length && blogTitleField.value.length){
        let docName;

        if (blogId[0] == 'editor') {
            // generating id of the post
            let blogTitle = blogTitleField.value.split(" ").join("-");

            // setting up docName
            docName = `${blogTitle}`;

            // request to server to create a post
            fetch('/createpost', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({
                    name: docName,
                    title: blogTitleField.value,
                    description: articleField.value,
                    banner: bannerPath
                })
            }).then(res => res.json())
            .then(res => {
                console.log(res);
                // redirect to home page
                location.href = '/';
            });
        }
        else {
            docName = decodeURI(blogId[0]);

            // Make a request to server to update data of a post
            fetch('/updatepost', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({
                    name: docName,
                    title: blogTitleField.value,
                    description: articleField.value,
                    banner: bannerPath
                })
            }).then(res => res.json())
            .then(res => {
                console.log(res);
                location.href = `/${docName}`;
            });
        }
    }
})

// Function to get information of the post on edit post page
if (blogId[0] != "editor") {
    fetch('/getpost', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: blogId[0]
        })
        }).then(res => res.json())
        .then(res => {
            banner.style.backgroundImage = `url(${res.banner})`;
            blogTitleField.value = res.title;
            articleField.value = res.description;
        });
}