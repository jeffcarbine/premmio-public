// https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely

editDistance = (s1, s2) => {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0) costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
};

export const compareStrings = (s1, s2) => {
  // first to check if either string is a substring of the other
  if (s1.includes(s2) || s2.includes(s1)) {
    return 1.0;
  }

  let longer = s1,
    shorter = s2;

  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }

  // return a 1.0 if the longer of the two strings is zero,
  // meaning that we have two blank strings
  const longerLength = longer.length;

  if (longerLength == 0) {
    return 1.0;
  }

  // otherwise, get an actual number value
  return (
    (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
  );
};
