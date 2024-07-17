import './style.css';

window.addEventListener('load', init);

function init() {
  window.addEventListener('scroll', onScroll, false);
}

function onScroll() {
  const list = getStickies();
  for (const [index, item] of list.entries()) {
    const bound = getBoundary(item);
    let edge = bound.getBoundingClientRect().bottom;
    const nextItem = findNextInBoundary(list, index, bound);
    if (nextItem) {
      if (nextItem.parentNode.hasAttribute('x-sticky-placeholder')) {
        edge = nextItem.parentNode.getBoundingClientRect().top;
      } else {
        edge = nextItem.getBoundingClientRect().top;
      }
    }
    const hasHolder = item.parentNode.hasAttribute('x-sticky-placeholder');
    const rect = item.getBoundingClientRect();
    const height = rect.bottom - rect.top;
    const width = rect.right - rect.left;
    const top = hasHolder
      ? item.parentNode.getBoundingClientRect().top
      : rect.top;

    if (top < 0) {
      if (edge > height) {
        if (!item.hasAttribute('x-sticky-active')) {
          item.setAttribute('x-sticky-active', '');
        }
        item.style.top = '0px';
      } else {
        if (item.hasAttribute('x-sticky-active')) {
          item.removeAttribute('x-sticky-active');
        }
        item.style.top = -(top - edge + height) + 'px';
      }
      if (!hasHolder) {
        const d = document.createElement('div');
        d.setAttribute('x-sticky-placeholder', '');
        d.style.height = height + 'px';
        d.style.width = width + 'px';
        copyLayoutStyles(d, item);
        item.parentNode.insertBefore(d, item);
        d.appendChild(item);
      }
    } else {
      if (item.hasAttribute('x-sticky-active')) {
        item.removeAttribute('x-sticky-active');
      }
      item.style.top = 'auto';
      if (hasHolder) {
        const placeholder = item.parentNode;
        placeholder.parentNode.insertBefore(item, placeholder);
        placeholder.parentNode.removeChild(placeholder);
      }
    }
  }
}

function getStickies() {
  return document.querySelectorAll('[x-sticky]');
}

function findNextInBoundary(arr, i, boundary) {
  i++;

  for (var item; (item = arr[i]); i++) {
    if (getBoundary(item) == boundary) {
      return item;
    }
  }
}

function getBoundary(n) {
  while ((n = n.parentNode)) {
    if (n.hasAttribute('x-sticky-boundary')) {
      return n;
    }
  }

  return document.body || document.documentElement;
}

function copyLayoutStyles(to, from) {
  const props = {marginTop:1, marginRight:1, marginBottom:1, marginLeft:1};
  if (from.currentStyle) {
    props.styleFloat = 1;
    for (const s in props) to.style[s] = from.currentStyle[s];
  } else {
    props.cssFloat = 1;
    for (const s in props) to.style[s] = getComputedStyle(from, null)[s];
  }
}
