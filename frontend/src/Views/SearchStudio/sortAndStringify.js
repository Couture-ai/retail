function sortAndStringify(obj) {
  if (Array.isArray(obj)) {
    // Sort arrays based on native type order, then recursively sort contents
    return JSON.stringify(
      obj.map(sortAndStringify).sort((a, b) => {
        // Parse JSON strings back to compare as original types
        const typeOrder = { string: 1, number: 2, object: 3, boolean: 4 };
        const typeA = typeof JSON.parse(a);
        const typeB = typeof JSON.parse(b);

        if (typeA !== typeB) {
          return typeOrder[typeA] - typeOrder[typeB];
        }

        // Sort within the same type
        if (typeA === 'object') {
          return a.localeCompare(b); // Objects as JSON strings
        }
        return a < b ? -1 : a > b ? 1 : 0; // Strings, numbers, and booleans
      })
    );
  } else if (typeof obj === 'object' && obj !== null) {
    // Sort object keys alphabetically and process values recursively
    const sortedEntries = Object.keys(obj)
      .sort()
      .map((key) => [key, sortAndStringify(obj[key])]);

    // Create a sorted object
    const sortedObj = {};
    for (const [key, value] of sortedEntries) {
      sortedObj[key] = JSON.parse(value); // Parse JSON back to original type
    }

    return JSON.stringify(sortedObj);
  }

  // Base case for non-objects and non-arrays
  return JSON.stringify(obj);
}

export default sortAndStringify;
