/**
 * CodeWithMe9120 Full Stack Development - Task 1 Client Script
 * Provides micro-interactions, character counter, and form UX enhancements
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('CodeWithMe9120 Task 1 Client UI Loaded.');

  // Auto update current year in footer
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Character Counter for Project Idea Textarea
  const projectIdeaTextarea = document.getElementById('projectIdea');
  const charCounter = document.getElementById('charCount');
  if (projectIdeaTextarea && charCounter) {
    projectIdeaTextarea.addEventListener('input', (e) => {
      const currentLength = e.target.value.length;
      charCounter.textContent = `${currentLength}/500`;
      if (currentLength > 450) {
        charCounter.style.color = 'var(--danger)';
      } else {
        charCounter.style.color = 'var(--text-muted)';
      }
    });
  }

  // Interactive Live Preview for Form Input
  const nameInput = document.getElementById('fullName');
  const liveBadge = document.getElementById('liveStudentName');
  if (nameInput && liveBadge) {
    nameInput.addEventListener('input', (e) => {
      liveBadge.textContent = e.target.value.trim() || 'Aspiring Full Stack Engineer';
    });
  }

  // Quick Poll Handler via Client Fetch
  const pollForm = document.getElementById('quickPollForm');
  const pollResult = document.getElementById('pollResult');
  if (pollForm && pollResult) {
    pollForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const selected = pollForm.querySelector('input[name="ssrKnowledge"]:checked');
      if (selected) {
        pollResult.innerHTML = `
          <div style="background: #dcfce7; color: #166534; padding: 12px; border-radius: 8px; font-size: 0.88rem; margin-top: 10px; border: 1px solid #bbf7d0;">
            <strong>Thank you for voting!</strong> You chose: <em>${selected.value}</em>.<br>
            Server-side rendering dynamically creates HTML templates on the Express server before sending them to your browser!
          </div>
        `;
        pollForm.reset();
      }
    });
  }
});
