export function useScrollToElement(offset = 78) {
  return (element) => {
    if (!element) return;

    const top = element.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  };
}
