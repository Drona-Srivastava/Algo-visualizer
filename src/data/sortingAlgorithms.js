export const sortingAlgorithms = [
  {
    id: "bubble",
    name: "Bubble Sort",
    category: "Sorting",
    hasSimulation: true,
    detail:
      "Repeatedly compares adjacent values and swaps them; simple to learn but inefficient for large arrays.",
  },
  {
    id: "selection",
    name: "Selection Sort",
    category: "Sorting",
    hasSimulation: true,
    detail:
      "Finds the smallest element in the unsorted section and places it at the front on each pass.",
  },
  {
    id: "insertion",
    name: "Insertion Sort",
    category: "Sorting",
    hasSimulation: true,
    detail:
      "Builds a sorted section one element at a time by inserting each value into its correct position.",
  },
  {
    id: "merge",
    name: "Merge Sort",
    category: "Sorting",
    hasSimulation: true,
    detail:
      "Uses divide-and-conquer: splits the array, sorts each half, then merges them in order.",
  },
  {
    id: "quick",
    name: "Quick Sort",
    category: "Sorting",
    hasSimulation: true,
    detail:
      "Picks a pivot and partitions values around it, then recursively sorts the two partitions.",
  },
  {
    id: "heap",
    name: "Heap Sort",
    category: "Sorting",
    hasSimulation: true,
    detail:
      "Converts the array into a heap and repeatedly extracts the maximum (or minimum) element.",
  },
  {
    id: "binary",
    name: "Binary Search",
    category: "Searching",
    hasSimulation: false,
    detail:
      "Searches a sorted array by repeatedly halving the search space until the target is found.",
  },
  {
    id: "ternary",
    name: "Ternary Search",
    category: "Searching",
    hasSimulation: false,
    detail:
      "For sorted data, splits the range into three parts and narrows the interval by comparisons.",
  },
];
