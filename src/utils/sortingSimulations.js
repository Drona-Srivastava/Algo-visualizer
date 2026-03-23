const cloneStep = (array, highlights = [], note = "") => ({
  array: [...array],
  highlights,
  note,
});

const bubbleSortSteps = (input) => {
  const arr = [...input];
  const steps = [cloneStep(arr, [], "Initial array")];

  for (let i = 0; i < arr.length - 1; i += 1) {
    for (let j = 0; j < arr.length - i - 1; j += 1) {
      steps.push(cloneStep(arr, [j, j + 1], `Compare index ${j} and ${j + 1}`));
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push(cloneStep(arr, [j, j + 1], "Swap"));
      }
    }
  }

  steps.push(cloneStep(arr, [], "Sorted"));
  return steps;
};

const selectionSortSteps = (input) => {
  const arr = [...input];
  const steps = [cloneStep(arr, [], "Initial array")];

  for (let i = 0; i < arr.length - 1; i += 1) {
    let min = i;
    for (let j = i + 1; j < arr.length; j += 1) {
      steps.push(cloneStep(arr, [min, j], `Find minimum from index ${i}`));
      if (arr[j] < arr[min]) {
        min = j;
        steps.push(cloneStep(arr, [i, min], "New minimum found"));
      }
    }
    if (min !== i) {
      [arr[i], arr[min]] = [arr[min], arr[i]];
      steps.push(cloneStep(arr, [i, min], "Swap minimum into position"));
    }
  }

  steps.push(cloneStep(arr, [], "Sorted"));
  return steps;
};

const insertionSortSteps = (input) => {
  const arr = [...input];
  const steps = [cloneStep(arr, [], "Initial array")];

  for (let i = 1; i < arr.length; i += 1) {
    const key = arr[i];
    let j = i - 1;
    steps.push(cloneStep(arr, [i], `Insert value ${key}`));

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      steps.push(cloneStep(arr, [j, j + 1], "Shift right"));
      j -= 1;
    }

    arr[j + 1] = key;
    steps.push(cloneStep(arr, [j + 1], "Placed in correct position"));
  }

  steps.push(cloneStep(arr, [], "Sorted"));
  return steps;
};

const mergeSortSteps = (input) => {
  const arr = [...input];
  const steps = [cloneStep(arr, [], "Initial array")];

  const merge = (left, mid, right) => {
    const leftPart = arr.slice(left, mid + 1);
    const rightPart = arr.slice(mid + 1, right + 1);
    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftPart.length && j < rightPart.length) {
      if (leftPart[i] <= rightPart[j]) {
        arr[k] = leftPart[i];
        i += 1;
      } else {
        arr[k] = rightPart[j];
        j += 1;
      }
      steps.push(cloneStep(arr, [k], `Merge range ${left}-${right}`));
      k += 1;
    }

    while (i < leftPart.length) {
      arr[k] = leftPart[i];
      i += 1;
      steps.push(
        cloneStep(arr, [k], `Copy leftover from left range ${left}-${mid}`),
      );
      k += 1;
    }

    while (j < rightPart.length) {
      arr[k] = rightPart[j];
      j += 1;
      steps.push(
        cloneStep(
          arr,
          [k],
          `Copy leftover from right range ${mid + 1}-${right}`,
        ),
      );
      k += 1;
    }
  };

  const sort = (left, right) => {
    if (left >= right) {
      return;
    }

    const mid = Math.floor((left + right) / 2);
    sort(left, mid);
    sort(mid + 1, right);
    merge(left, mid, right);
  };

  sort(0, arr.length - 1);
  steps.push(cloneStep(arr, [], "Sorted"));
  return steps;
};

const quickSortSteps = (input) => {
  const arr = [...input];
  const steps = [cloneStep(arr, [], "Initial array")];

  const partition = (low, high) => {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j += 1) {
      steps.push(cloneStep(arr, [j, high], `Compare with pivot ${pivot}`));
      if (arr[j] <= pivot) {
        i += 1;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        steps.push(cloneStep(arr, [i, j], "Move element before pivot"));
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    steps.push(cloneStep(arr, [i + 1, high], "Place pivot"));
    return i + 1;
  };

  const sort = (low, high) => {
    if (low < high) {
      const pivotIndex = partition(low, high);
      sort(low, pivotIndex - 1);
      sort(pivotIndex + 1, high);
    }
  };

  sort(0, arr.length - 1);
  steps.push(cloneStep(arr, [], "Sorted"));
  return steps;
};

const heapSortSteps = (input) => {
  const arr = [...input];
  const steps = [cloneStep(arr, [], "Initial array")];

  const heapify = (n, i) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }

    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      steps.push(cloneStep(arr, [i, largest], "Heapify swap"));
      heapify(n, largest);
    }
  };

  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i -= 1) {
    heapify(n, i);
  }

  for (let i = n - 1; i > 0; i -= 1) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    steps.push(cloneStep(arr, [0, i], "Move max to end"));
    heapify(i, 0);
  }

  steps.push(cloneStep(arr, [], "Sorted"));
  return steps;
};

export const simulatableSortingAlgorithms = {
  bubble: bubbleSortSteps,
  selection: selectionSortSteps,
  insertion: insertionSortSteps,
  merge: mergeSortSteps,
  quick: quickSortSteps,
  heap: heapSortSteps,
};

export const buildSortingSteps = (algorithmId, input) => {
  const generator = simulatableSortingAlgorithms[algorithmId];

  if (!generator) {
    return [];
  }

  return generator(input);
};
