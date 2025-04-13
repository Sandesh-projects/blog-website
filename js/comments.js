// js/comments.js

const COMMENTS_STORAGE_KEY_PREFIX = 'blogComments_';

function getComments(postId) {
    if (!postId) return [];

    const storageKey = `${COMMENTS_STORAGE_KEY_PREFIX}${postId}`;
    const storedComments = localStorage.getItem(storageKey);

    if (storedComments) {
        try {
            const parsedComments = JSON.parse(storedComments);
            if (Array.isArray(parsedComments)) {
                return parsedComments.sort((a, b) => a.timestamp - b.timestamp);
            }
        } catch (error) {
            console.error(`Error parsing comments for post ${postId}:`, error);
        }
    }
    return [];
}

function saveComments(postId, comments) {
     if (!postId || !Array.isArray(comments)) {
        console.error("Invalid arguments for saveComments:", postId, comments);
        return;
     }

    const storageKey = `${COMMENTS_STORAGE_KEY_PREFIX}${postId}`;
    try {
        localStorage.setItem(storageKey, JSON.stringify(comments));
    } catch (error) {
        console.error(`Error saving comments for post ${postId}:`, error);
        alert("Could not save comment. Local Storage might be full or disabled.");
    }
}

function createCommentHTML(comment) {
    if (!comment || !comment.name || !comment.message || !comment.timestamp) {
        return '';
    }
    const commentDate = new Date(comment.timestamp).toLocaleString();

    return `
        <div class="comment">
            <p class="comment-author">${escapeHTML(comment.name)}</p>
            <span class="comment-date">${commentDate}</span>
            <p class="comment-message">${escapeHTML(comment.message)}</p>
        </div>
    `;
}

function loadAndDisplayComments(postId) {
    const commentsListContainer = document.getElementById('comments-list');
    if (!commentsListContainer) {
        console.error("Element with ID 'comments-list' not found.");
        return;
    }

    const comments = getComments(postId);

    if (comments.length === 0) {
        commentsListContainer.innerHTML = '<p class="no-comments">No comments yet. Be the first to comment!</p>';
    } else {
        const commentsHTML = comments.map(createCommentHTML).join('');
        commentsListContainer.innerHTML = commentsHTML;
    }
}

function setupCommentForm(postId) {
    const commentForm = document.getElementById('comment-form');
    const successMessage = document.getElementById('comment-success-message');
    const hiddenPostIdInput = document.getElementById('post-id-hidden');

    if (!commentForm) {
        return;
    }
     if (!successMessage) {
        console.warn("Comment success message element not found.");
     }
     if (!hiddenPostIdInput) {
        console.error("Hidden post ID input not found in comment form.");
        return;
     }

    hiddenPostIdInput.value = postId;

    commentForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const nameInput = document.getElementById('comment-name');
        const messageInput = document.getElementById('comment-message');
        const currentPostId = document.getElementById('post-id-hidden').value;

        if (!nameInput.value.trim() || !messageInput.value.trim()) {
            alert('Please enter both your name and comment.');
            return;
        }

        const newComment = {
            postId: Number(currentPostId),
            name: nameInput.value.trim(),
            message: messageInput.value.trim(),
            timestamp: Date.now()
        };

        const currentComments = getComments(currentPostId);
        currentComments.push(newComment);
        saveComments(currentPostId, currentComments);

        commentForm.reset();

        if (successMessage) {
             successMessage.style.display = 'block';
             setTimeout(() => { successMessage.style.display = 'none'; }, 2000);
        }

        loadAndDisplayComments(currentPostId);
    });
}

function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}