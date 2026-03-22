import Swal from 'sweetalert2'

const baseStyles = {
  confirmButtonColor: '#000000',
  cancelButtonColor: '#6b7280',
  customClass: {
    popup: 'rounded-lg',
    title: 'text-lg font-bold',
    confirmButton: 'rounded-lg text-sm font-semibold px-6',
    cancelButton: 'rounded-lg text-sm font-semibold px-6',
  },
}

export function showSuccess(title: string, text?: string) {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    timer: 2000,
    showConfirmButton: false,
    ...baseStyles,
  })
}

export function showError(title: string, text?: string) {
  return Swal.fire({
    icon: 'error',
    title,
    text: text || 'Something went wrong. Please try again.',
    ...baseStyles,
  })
}

export function showDeleteConfirm(itemName: string): Promise<boolean> {
  return Swal.fire({
    icon: 'warning',
    title: `Delete ${itemName}?`,
    text: 'This action cannot be undone.',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    customClass: baseStyles.customClass,
  }).then((result) => result.isConfirmed)
}

export function showInfo(title: string, text?: string) {
  return Swal.fire({
    icon: 'info',
    title,
    text,
    ...baseStyles,
  })
}

export function showSaveSuccess(itemName: string) {
  return showSuccess('Saved!', `${itemName} has been saved successfully.`)
}

export function showCreateSuccess(itemName: string) {
  return showSuccess('Created!', `${itemName} has been created successfully.`)
}

export function showUpdateSuccess(itemName: string) {
  return showSuccess('Updated!', `${itemName} has been updated successfully.`)
}

export function showDeleteSuccess(itemName: string) {
  return showSuccess('Deleted!', `${itemName} has been deleted successfully.`)
}
