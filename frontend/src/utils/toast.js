export function showToast(message) {
  window.dispatchEvent(
    new CustomEvent("love2bazzar:toast", {
      detail: { message },
    })
  );
}
