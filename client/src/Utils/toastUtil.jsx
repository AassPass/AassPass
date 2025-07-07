export function showToast(message, type = 'info', duration = 3000) {
  const existing = document.getElementById('simple-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'simple-toast';
  toast.innerText = message;

  const colorMap = {
    success: 'green',
    error: 'red',
    info: 'blue',
    warning: 'orange',
  };

  Object.assign(toast.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 9999,
    padding: '10px 16px',
    backgroundColor: colorMap[type] || 'gray',
    color: 'white',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'sans-serif',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    transition: 'opacity 0.3s ease',
    opacity: '1',
  });

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 150);
  }, duration);
}
