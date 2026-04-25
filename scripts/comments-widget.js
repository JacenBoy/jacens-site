const API_BASE = 'https://comments.jacen.moe/api';

class CommentSystem {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.articleId = this.container.dataset.articleId;
    this.csrfToken = null;
    this.user = null;
    this.comments = [];

    this.init();
  }

  async init() {
    this.renderLoading();
    try {
      await this.fetchCsrf();
      await this.checkAuth();
      await this.fetchComments();
      this.render();
    } catch (e) {
      console.error('Failed to initialize comment system', e);
      this.renderError();
    }
  }

  // API Methods
  async fetchWithAuth(url, options = {}) {
    options.credentials = 'include';
    options.headers = options.headers || {};
    options.headers['Content-Type'] = 'application/json';
    if (this.csrfToken && options.method && options.method !== 'GET') {
      options.headers['X-CSRF-Token'] = this.csrfToken;
    }

    const response = await fetch(`${API_BASE}${url}`, options);
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return response.json();
    } else {
      return { success: response.ok, status: response.status };
    }
  }

  async fetchCsrf() {
    const data = await this.fetchWithAuth('/auth/csrf');
    if (data && data.csrf_token) {
      this.csrfToken = data.csrf_token;
    }
  }

  async checkAuth() {
    const data = await this.fetchWithAuth('/auth/me');
    if (data && data.id) {
      this.user = data;
    } else {
      this.user = null;
    }
  }

  async fetchComments() {
    const data = await this.fetchWithAuth(`/comments?article_id=${encodeURIComponent(this.articleId)}`);
    if (data && data.comments) {
      this.comments = data.comments;
    }
  }

  // Render Methods
  renderLoading() {
    this.container.innerHTML = `
      <div class="text-center my-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading comments...</span>
        </div>
      </div>
    `;
  }

  renderError() {
    this.container.innerHTML = `
      <div class="alert alert-danger my-4">
        Failed to load comments. Please try again later.
      </div>
    `;
  }

  render() {
    let html = `
      <div class="comments-section mt-5">
        <h3>Comments</h3>
        <hr/>
        ${this.renderAuthSection()}
        <div class="comments-list mt-4">
          ${this.comments.length > 0 ? this.renderCommentsList(this.comments) : '<p class="text-muted">No comments yet. Be the first to share your thoughts!</p>'}
        </div>
      </div>
    `;
    this.container.innerHTML = html;
    this.attachEventListeners();
  }

  renderAuthSection() {
    if (this.user) {
      return `
        <div class="card mb-4">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="card-title mb-0">Leave a comment</h5>
              <div>
                <small class="text-muted me-2">Logged in as ${this.user.display_name || this.user.email}</small>
                <button class="btn btn-sm btn-outline-danger" id="jacen-logout-btn">Logout</button>
              </div>
            </div>
            <form id="jacen-comment-form">
              <div class="mb-3">
                <textarea class="form-control" id="jacen-comment-content" rows="3" required placeholder="What are your thoughts?"></textarea>
              </div>
              <button type="submit" class="btn btn-primary">Post Comment</button>
            </form>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="card mb-4" id="jacen-login-card">
          <div class="card-body">
            <h5 class="card-title">Log in to comment</h5>
            <form id="jacen-otp-request-form">
              <div class="input-group mb-3">
                <input type="email" class="form-control" id="jacen-login-email" placeholder="Email address" required>
                <button class="btn btn-primary" type="submit" id="jacen-request-otp-btn">Send OTP</button>
              </div>
              <div class="form-text">We'll send a one-time password to your email. No password required!</div>
            </form>
            <form id="jacen-otp-verify-form" class="d-none">
              <div class="alert alert-success py-2 mb-3"><small>OTP sent to your email!</small></div>
              <div class="input-group mb-3">
                <input type="text" class="form-control" id="jacen-login-otp" placeholder="Enter 6-digit OTP" required>
                <button class="btn btn-success" type="submit" id="jacen-verify-otp-btn">Verify & Log In</button>
              </div>
            </form>
          </div>
        </div>
      `;
    }
  }

  renderCommentsList(comments, isReply = false) {
    let html = '';
    comments.forEach(comment => {
      const date = new Date(comment.created_at).toLocaleString();
      const author = comment.author || 'Anonymous';
      const authorBadge = comment.is_admin ? '<span class="badge bg-danger ms-2">Admin</span>' : '';
      
      html += `
        <div class="card mb-3 ${isReply ? 'ms-4 border-start border-3 border-primary' : ''}">
          <div class="card-header d-flex justify-content-between align-items-center py-2">
            <div>
              <strong>${author}</strong> ${authorBadge}
            </div>
            <small class="text-muted">${date}</small>
          </div>
          <div class="card-body py-2">
            <p class="card-text mb-2">${this.escapeHtml(comment.content)}</p>
            ${this.user ? `<button class="btn btn-sm btn-link p-0 text-decoration-none reply-btn" data-comment-id="${comment.id}">Reply</button>` : ''}
            <div class="reply-form-container mt-2 d-none" id="reply-container-${comment.id}">
              <form class="jacen-reply-form" data-parent-id="${comment.id}">
                <div class="mb-2">
                  <textarea class="form-control form-control-sm" rows="2" required placeholder="Write a reply..."></textarea>
                </div>
                <button type="submit" class="btn btn-sm btn-primary">Post Reply</button>
                <button type="button" class="btn btn-sm btn-secondary cancel-reply-btn">Cancel</button>
              </form>
            </div>
          </div>
        </div>
      `;
      if (comment.replies && comment.replies.length > 0) {
        html += `<div class="replies-container ms-3">`;
        html += this.renderCommentsList(comment.replies, true);
        html += `</div>`;
      }
    });
    return html;
  }

  escapeHtml(unsafe) {
    return (unsafe || '').toString()
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
  }

  // Event Listeners
  attachEventListeners() {
    // Logout
    const logoutBtn = document.getElementById('jacen-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        await this.fetchWithAuth('/auth/logout', { method: 'POST' });
        this.user = null;
        this.render();
      });
    }

    // OTP Request
    const otpRequestForm = document.getElementById('jacen-otp-request-form');
    if (otpRequestForm) {
      otpRequestForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('jacen-login-email').value;
        const btn = document.getElementById('jacen-request-otp-btn');
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
        
        try {
          const res = await this.fetchWithAuth('/auth/request-otp', {
            method: 'POST',
            body: JSON.stringify({ email })
          });
          
          if (res.success) {
            otpRequestForm.classList.add('d-none');
            document.getElementById('jacen-otp-verify-form').classList.remove('d-none');
          } else {
            alert(res.message || 'Failed to request OTP');
            btn.disabled = false;
            btn.innerHTML = 'Send OTP';
          }
        } catch (err) {
          alert('Network error requesting OTP');
          btn.disabled = false;
          btn.innerHTML = 'Send OTP';
        }
      });
    }

    // OTP Verify
    const otpVerifyForm = document.getElementById('jacen-otp-verify-form');
    if (otpVerifyForm) {
      otpVerifyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('jacen-login-email').value;
        const otp = document.getElementById('jacen-login-otp').value;
        const btn = document.getElementById('jacen-verify-otp-btn');
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Verifying...';

        try {
          const res = await this.fetchWithAuth('/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ email, otp })
          });
          
          if (res.success) {
            this.user = res.user;
            this.render();
          } else {
            alert(res.message || 'Invalid OTP');
            btn.disabled = false;
            btn.innerHTML = 'Verify & Log In';
          }
        } catch (err) {
          alert('Network error verifying OTP');
          btn.disabled = false;
          btn.innerHTML = 'Verify & Log In';
        }
      });
    }

    // New Comment Submit
    const commentForm = document.getElementById('jacen-comment-form');
    if (commentForm) {
      commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const content = document.getElementById('jacen-comment-content').value;
        const btn = commentForm.querySelector('button[type="submit"]');
        btn.disabled = true;

        try {
          const res = await this.fetchWithAuth('/comments', {
            method: 'POST',
            body: JSON.stringify({
              article_id: this.articleId,
              content: content
            })
          });

          if (res.success) {
            // Re-fetch and render comments
            await this.fetchComments();
            this.render();
          } else {
            alert(res.message || 'Failed to post comment');
            btn.disabled = false;
          }
        } catch (err) {
          alert('Network error posting comment');
          btn.disabled = false;
        }
      });
    }

    // Reply Buttons
    const replyBtns = document.querySelectorAll('.reply-btn');
    replyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const commentId = e.target.dataset.commentId;
        const container = document.getElementById(`reply-container-${commentId}`);
        container.classList.remove('d-none');
        e.target.classList.add('d-none');
      });
    });

    // Cancel Reply Buttons
    const cancelReplyBtns = document.querySelectorAll('.cancel-reply-btn');
    cancelReplyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const form = e.target.closest('form');
        const commentId = form.dataset.parentId;
        const container = document.getElementById(`reply-container-${commentId}`);
        container.classList.add('d-none');
        const replyBtn = document.querySelector(`.reply-btn[data-comment-id="${commentId}"]`);
        if (replyBtn) replyBtn.classList.remove('d-none');
      });
    });

    // Reply Form Submit
    const replyForms = document.querySelectorAll('.jacen-reply-form');
    replyForms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const content = form.querySelector('textarea').value;
        const parentId = form.dataset.parentId;
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;

        try {
          const res = await this.fetchWithAuth('/comments', {
            method: 'POST',
            body: JSON.stringify({
              article_id: this.articleId,
              content: content,
              parent_id: parseInt(parentId, 10)
            })
          });

          if (res.success) {
            await this.fetchComments();
            this.render();
          } else {
            alert(res.message || 'Failed to post reply');
            btn.disabled = false;
          }
        } catch (err) {
          alert('Network error posting reply');
          btn.disabled = false;
        }
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CommentSystem('jacen-comments');
});
