// js/posts.js

const POSTS_STORAGE_KEY = 'blogPosts';

// --- Data Retrieval ---

function getPosts() {
    const storedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
    if (storedPosts) {
        try {
            const parsedPosts = JSON.parse(storedPosts);
            if (Array.isArray(parsedPosts)) {
                return parsedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
            }
        } catch (error) {
            console.error("Error parsing posts from Local Storage:", error);
        }
    }
    if (typeof initialPosts !== 'undefined' && Array.isArray(initialPosts)) {
        const sortedInitial = initialPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        savePosts(sortedInitial);
        return sortedInitial;
    }
    console.warn("Initial post data not found.");
    return [];
}

function findPostById(id) {
    const posts = getPosts();
    const postIdNumber = Number(id);
    return posts.find(post => post.id === postIdNumber);
}

// --- Data Storage ---

function savePosts(posts) {
    if (Array.isArray(posts)) {
        try {
            localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
        } catch (error) {
            console.error("Error saving posts to Local Storage:", error);
            alert("Could not save posts. Local Storage might be full or disabled.");
        }
    } else {
        console.error("Attempted to save invalid posts data:", posts);
    }
}

// --- Display Logic (Homepage - index.html) ---

function createPostCardHTML(post) {
    if (!post || !post.id || !post.title || !post.date || !post.content) {
        console.warn("Skipping invalid post object:", post);
        return '';
    }

    const excerpt = post.content.length > 150
        ? post.content.substring(0, 150) + "..."
        : post.content;

    const imageSrc = post.image || 'assets/images/post_placeholder.jpg';

    return `
        <div class="post-card">
            <div class="post-card-image">
                <a href="post.html?id=${post.id}">
                    <img src="${imageSrc}" alt="${post.title}" loading="lazy">
                </a>
            </div>
            <div class="post-card-content">
                <h3 class="post-card-title">
                    <a href="post.html?id=${post.id}">${post.title}</a>
                </h3>
                <div class="post-meta">
                    <span><i class="fa fa-calendar"></i> ${new Date(post.date).toLocaleDateString()}</span>
                    ${post.author ? `<span><i class="fa fa-user"></i> ${post.author}</span>` : ''}
                </div>
                <p class="post-excerpt">${excerpt}</p>
                <a href="post.html?id=${post.id}" class="read-more-btn">Read More</a>
            </div>
        </div>
    `;
}

function loadAndDisplayPosts() {
    const postListContainer = document.getElementById('post-list');
    if (!postListContainer) {
        console.error("Element with ID 'post-list' not found.");
        return;
    }

    const posts = getPosts();

    if (posts.length === 0) {
        postListContainer.innerHTML = '<p>No blog posts found. Why not create one?</p>';
        return;
    }

    const postsHTML = posts.map(createPostCardHTML).join('');
    postListContainer.innerHTML = postsHTML;
}

// --- Display Logic (Single Post Page - post.html) ---

function loadAndDisplaySinglePost(postId) {
    const postContentContainer = document.getElementById('single-post-content');
    if (!postContentContainer) {
        console.error("Element with ID 'single-post-content' not found.");
        return;
    }

    const post = findPostById(postId);

    if (!post) {
        postContentContainer.innerHTML = `
            <h1 class="post-title">Post Not Found</h1>
            <p class="error-message">Sorry, the post you are looking for does not exist or may have been removed.</p>
            <p style="text-align: center;"><a href="index.html" class="btn btn-primary">Back to Home</a></p>
        `;
        document.title = "Post Not Found - My Awesome Blog";
        const commentsSection = document.querySelector('.comments-section');
         if(commentsSection) commentsSection.style.display = 'none';
        return;
    }

    document.title = `${post.title} - My Awesome Blog`;

    const imageSrc = post.image || 'assets/images/post_placeholder.jpg';

    const postHTML = `
        <h1 class="post-title">${post.title}</h1>
        <div class="post-meta">
            <span>Published on: ${new Date(post.date).toLocaleDateString()}</span>
            ${post.author ? `<span> by ${post.author}</span>` : ''}
        </div>
        ${post.image ? `<img src="${imageSrc}" alt="${post.title}" class="post-image">` : ''}
        <div class="post-content">
            ${
                post.content.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('')
            }
        </div>
    `;
    postContentContainer.innerHTML = postHTML;
}

// --- Create Post Logic (create-post.html) ---

function setupCreatePostForm() {
    const form = document.getElementById('create-post-form');
    const successMessage = document.getElementById('success-message');

    if (!form) {
        return;
    }
    if (!successMessage) {
        console.warn("Success message element not found.");
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const titleInput = document.getElementById('post-title');
        const authorInput = document.getElementById('post-author');
        const imageInput = document.getElementById('post-image');
        const contentInput = document.getElementById('post-content');

        if (!titleInput.value.trim() || !contentInput.value.trim() || !authorInput.value.trim()) {
            alert('Please fill in Title, Author, and Content fields.');
            return;
        }

        const newPost = {
            id: Date.now() + Math.floor(Math.random() * 100),
            title: titleInput.value.trim(),
            author: authorInput.value.trim(),
            date: new Date().toISOString().split('T')[0],
            content: contentInput.value.trim(),
            image: imageInput.value.trim() || null
        };

        const currentPosts = getPosts();
        currentPosts.push(newPost);
        savePosts(currentPosts);

        if (successMessage) {
            successMessage.style.display = 'block';
        }
        form.reset();

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    });
}
