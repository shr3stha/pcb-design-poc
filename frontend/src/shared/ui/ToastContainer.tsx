import { create } from 'zustand'
import Toast, { ToastType } from './Toast'
import './ToastContainer.css'

interface ToastState {
  toasts: Array<{ id: string; message: string; type: ToastType }>
  showToast: (message: string, type?: ToastType) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  showToast: (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9)
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }))
  },
  removeToast: (id: string) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
  },
}))

/**
 * Toast container that renders all active toasts.
 * Add to root App component.
 */
export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

