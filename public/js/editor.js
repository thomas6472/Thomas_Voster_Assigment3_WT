const blogTitleField = document.querySelector('.title');
const articleField = document.querySelector('.article');
let blogId = location.pathname.split("/");
blogId.shift();

// banner
const bannerImage = document.querySelector('#banner-upload');
const banner = document.querySelector(".banner");
let bannerPath;

const publishBtn = document.querySelector('.publish-btn');
const uploadInput = document.querySelector('#image-upload');

bannerImage.addEventListener('change', () => {
    uploadImage(bannerImage, "banner");
})

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

uploadInput.addEventListener('change', () => {
    uploadImage(uploadInput, "image");
})

const addImage = (imagepath, alt) => {
    let curPos = articleField.selectionStart;
    let textToInsert = `\r![${alt}](${imagepath})\r`;
    articleField.value = articleField.value.slice(0, curPos) + textToInsert + articleField.value.slice(curPos);
}

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

publishBtn.addEventListener('click', () => {
    if(articleField.value.length && blogTitleField.value.length){
        let docName;

        if (blogId[0] == 'editor') {
            // generating id
            let letters = 'abcdefghijklmnopqrstuvwxyz';
            let blogTitle = blogTitleField.value.split(" ").join("-");
            let id = '';
            for(let i = 0; i < 4; i++){
                id += letters[Math.floor(Math.random() * letters.length)];
            }

            // setting up docName
            docName = `${blogTitle}`;

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
            .then(res => console.log(res));
        }
        else {
            docName = decodeURI(blogId[0]);

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