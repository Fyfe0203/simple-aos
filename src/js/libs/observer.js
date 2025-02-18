let callback = () => {};

const containsAOSNode = nodes => {
  let i, currentNode, result;

  for (i = 0; i < nodes.length; i += 1) {
    currentNode = nodes[i];

    if (currentNode.dataset && currentNode.dataset.aos) {
      return true;
    }

    result = currentNode.children && containsAOSNode(currentNode.children);

    if (result) {
      return true;
    }
  }

  return false;
};

const check = mutations => {
  if (!mutations) return;

  mutations.forEach(mutation => {
    const addedNodes = Array.prototype.slice.call(mutation.addedNodes);
    const removedNodes = Array.prototype.slice.call(mutation.removedNodes);
    const allNodes = addedNodes.concat(removedNodes);

    if (containsAOSNode(allNodes)) {
      return callback();
    }
  });
};

const getMutationObserver = () => {
  return (
    window.MutationObserver ||
    window.WebKitMutationObserver ||
    window.MozMutationObserver
  );
};

const isSupported = () => {
  return !!getMutationObserver();
};

const ready = (selector, fn) => {
  const doc = window.document;
  const MutationObserver = getMutationObserver();

  const observer = new MutationObserver(check);
  callback = fn;

  observer.observe(doc.documentElement, {
    childList: true,
    subtree: true,
    removedNodes: true
  });
};

export default { isSupported, ready };
