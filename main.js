/**
 * ExamAI Core Logic & Components
 */

// 1. AI Chat Assistant Logic
class AIChat {
  constructor() {
    this.chatHistory = document.querySelector('.chat-history');
    this.chatInput = document.querySelector('.ai-panel input');
    this.sendBtn = document.querySelector('.ai-panel button');

    this.init();
  }

  init() {
    if (!this.sendBtn) return;

    this.sendBtn.addEventListener('click', () => this.handleSendMessage());
    this.chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleSendMessage();
    });
  }

  handleSendMessage() {
    const message = this.chatInput.value.trim();
    if (!message) return;

    this.addMessage('user', message);
    this.chatInput.value = '';

    this.showTypingIndicator();
    setTimeout(() => {
      this.removeTypingIndicator();
      const response = this.getMockResponse(message);
      this.addMessage('ai', response);
    }, 1000);
  }

  addMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    
    const styles = {
      user: 'background: var(--primary); color: white; align-self: flex-end;',
      ai: 'background: var(--background); color: var(--text-main); align-self: flex-start;'
    };

    msgDiv.style.cssText = `
      ${styles[sender]}
      padding: var(--space-md);
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      max-width: 85%;
      margin-bottom: var(--space-sm);
      animation: fadeIn 0.3s ease;
    `;

    msgDiv.textContent = text;
    this.chatHistory.appendChild(msgDiv);
    this.chatHistory.scrollTop = this.chatHistory.scrollHeight;
  }

  showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'typing-indicator';
    indicator.style.cssText = 'font-size: 0.75rem; color: var(--text-muted); margin-bottom: var(--space-sm);';
    indicator.textContent = 'Exie가 생각 중...';
    this.chatHistory.appendChild(indicator);
    this.chatHistory.scrollTop = this.chatHistory.scrollHeight;
  }

  removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
  }

  getMockResponse(input) {
    if (input.includes('안녕')) return '안녕하세요! 오늘 어떤 과목을 같이 공부해볼까요?';
    if (input.includes('수학')) return '수학은 개념 이해가 중요해요! "삼각함수" 공식 암기 카드를 만들어드릴까요?';
    if (input.includes('시험')) return '시험이 얼마 남지 않았네요. "벼락치기 모드"를 활성화해서 핵심만 짚어드릴 수 있어요!';
    if (input.includes('벼락치기')) return '벼락치기 모드를 실행합니다. 핵심 요약 10선과 오답률이 높은 문제 5개를 선별했어요!';
    return '좋은 질문이에요! 그 부분에 대해 더 자세히 설명해 드릴까요, 아니면 관련 예상 문제를 만들어 드릴까요?';
  }
}

// 2. Upload & Analysis Simulation
class UploadManager {
  constructor() {
    this.modal = document.getElementById('upload-modal');
    this.addBtn = document.getElementById('add-exam-btn');
    this.closeBtn = document.getElementById('close-modal');
    this.startBtn = document.getElementById('start-upload');
    this.progressContainer = document.getElementById('upload-progress');
    this.progressBar = document.getElementById('progress-bar');
    this.statusText = document.getElementById('analysis-status');
    this.dropZone = document.getElementById('drop-zone');

    this.init();
  }

  init() {
    this.addBtn.addEventListener('click', () => {
      this.modal.style.display = 'flex';
      this.resetModal();
    });

    this.closeBtn.addEventListener('click', () => {
      this.modal.style.display = 'none';
    });

    this.startBtn.addEventListener('click', () => this.simulateUpload());
  }

  resetModal() {
    this.progressContainer.style.display = 'none';
    this.progressBar.style.width = '0%';
    this.statusText.textContent = '파일 분석 중...';
    this.dropZone.style.display = 'block';
    this.startBtn.disabled = false;
  }

  simulateUpload() {
    this.startBtn.disabled = true;
    this.dropZone.style.display = 'none';
    this.progressContainer.style.display = 'block';

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        this.statusText.textContent = '분석 완료! 대시보드에 추가되었습니다.';
        setTimeout(() => {
          this.modal.style.display = 'none';
          this.addNewTask();
        }, 1000);
      }
      this.progressBar.style.width = `${progress}%`;
      
      if (progress > 30) this.statusText.textContent = '핵심 키워드 추출 중...';
      if (progress > 70) this.statusText.textContent = '예상 문제 생성 중...';
    }, 300);
  }

  addNewTask() {
    const taskContainer = document.querySelector('.upcoming-tasks div');
    const newTask = document.createElement('div');
    newTask.className = 'card';
    newTask.style.cssText = 'display: flex; align-items: center; gap: var(--space-md); animation: fadeIn 0.5s ease;';
    newTask.innerHTML = `
      <input type="checkbox" style="width: 20px; height: 20px;">
      <div style="flex: 1;">
        <p style="font-weight: 600;">새로운 학습 자료: 분석된 핵심 요약</p>
        <p style="font-size: 0.75rem; color: var(--text-muted);">방금 추가됨</p>
      </div>
      <span style="background: var(--primary-light); color: var(--primary); font-size: 0.75rem; padding: 2px 8px; border-radius: var(--radius-full);">신규</span>
    `;
    taskContainer.prepend(newTask);
  }
}

// 3. Panic Mode Logic
const initPanicMode = () => {
  const toggle = document.getElementById('panic-mode-toggle');
  const root = document.documentElement;

  toggle.addEventListener('change', (e) => {
    if (e.target.checked) {
      // Emergency Red Theme
      root.style.setProperty('--primary', '#e11d48');
      root.style.setProperty('--primary-light', '#fff1f2');
      document.body.style.backgroundColor = '#fff1f2';
      alert('🚨 벼락치기 모드 활성화! 최적의 압축 경로를 생성합니다.');
    } else {
      // Normal Blue Theme
      root.style.setProperty('--primary', '#2563eb');
      root.style.setProperty('--primary-light', '#dbeafe');
      document.body.style.backgroundColor = '#f8fafc';
    }
  });
};

// 4. General UI Interaction
const initDashboard = () => {
  document.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox' && e.target.closest('.upcoming-tasks')) {
      const card = e.target.closest('.card');
      if (e.target.checked) {
        card.style.opacity = '0.6';
        card.style.textDecoration = 'line-through';
      } else {
        card.style.opacity = '1';
        card.style.textDecoration = 'none';
      }
    }
  });
};

// CSS Animation for Chat & Tasks
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .chat-history {
    display: flex;
    flex-direction: column;
  }
`;
document.head.appendChild(style);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AIChat();
  new UploadManager();
  initPanicMode();
  initDashboard();
});
