import { Problem, Battle, Note, CodeFile, TimetableSlot, ChatMessage, ActivityNotification } from "@/types";

export const INITIAL_PROBLEMS: Problem[] = [
  {
    "id": "p-1",
    "title": "Two Sum",
    "slug": "two-sum",
    "leetcode_url": "https://leetcode.com/problems/two-sum/",
    "difficulty": "Easy",
    "topic": "Arrays",
    "sheet_name": "Curated Top DSA 75",
    "order_index": 1
  },
  {
    "id": "p-2",
    "title": "Best Time to Buy and Sell Stock",
    "slug": "best-time-to-buy-and-sell-stock",
    "leetcode_url": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    "difficulty": "Easy",
    "topic": "Arrays",
    "sheet_name": "Prefix and suffix problem",
    "order_index": 1
  },
  {
    "id": "p-3",
    "title": "Contains Duplicate",
    "slug": "contains-duplicate",
    "leetcode_url": "https://leetcode.com/problems/contains-duplicate/",
    "difficulty": "Easy",
    "topic": "Arrays",
    "sheet_name": "Curated Top DSA 75",
    "order_index": 2
  },
  {
    "id": "p-4",
    "title": "Product of Array Except Self",
    "slug": "product-of-array-except-self",
    "leetcode_url": "https://leetcode.com/problems/product-of-array-except-self/",
    "difficulty": "Medium",
    "topic": "Arrays",
    "sheet_name": "Prefix and suffix problem",
    "order_index": 2
  },
  {
    "id": "p-5",
    "title": "Maximum Subarray",
    "slug": "maximum-subarray",
    "leetcode_url": "https://leetcode.com/problems/maximum-subarray/",
    "difficulty": "Medium",
    "topic": "Arrays",
    "sheet_name": "Curated Top DSA 75",
    "order_index": 3
  },
  {
    "id": "p-6",
    "title": "3Sum",
    "slug": "3sum",
    "leetcode_url": "https://leetcode.com/problems/3sum/",
    "difficulty": "Medium",
    "topic": "Two Pointers",
    "sheet_name": "Curated Top DSA 75",
    "order_index": 4
  },
  {
    "id": "p-7",
    "title": "Container With Most Water",
    "slug": "container-with-most-water",
    "leetcode_url": "https://leetcode.com/problems/container-with-most-water/",
    "difficulty": "Medium",
    "topic": "Two Pointers",
    "sheet_name": "Curated Top DSA 75",
    "order_index": 5
  },
  {
    "id": "p-8",
    "title": "Trapping Rain Water",
    "slug": "trapping-rain-water",
    "leetcode_url": "https://leetcode.com/problems/trapping-rain-water/",
    "difficulty": "Hard",
    "topic": "Two Pointers",
    "sheet_name": "Prefix and suffix problem",
    "order_index": 3
  },
  {
    "id": "p-9",
    "title": "Valid Parentheses",
    "slug": "valid-parentheses",
    "leetcode_url": "https://leetcode.com/problems/valid-parentheses/",
    "difficulty": "Easy",
    "topic": "Stack",
    "sheet_name": "Curated Top DSA 75",
    "order_index": 6
  },
  {
    "id": "p-10",
    "title": "Min Stack",
    "slug": "min-stack",
    "leetcode_url": "https://leetcode.com/problems/min-stack/",
    "difficulty": "Medium",
    "topic": "Stack",
    "sheet_name": "Curated Top DSA 75",
    "order_index": 7
  },
  {
    "id": "p-11",
    "title": "Reverse Linked List",
    "slug": "reverse-linked-list",
    "leetcode_url": "https://leetcode.com/problems/reverse-linked-list/",
    "difficulty": "Easy",
    "topic": "Linked List",
    "sheet_name": "Curated Top DSA 75",
    "order_index": 8
  },
  {
    "id": "p-12",
    "title": "Merge Two Sorted Lists",
    "slug": "merge-two-sorted-lists",
    "leetcode_url": "https://leetcode.com/problems/merge-two-sorted-lists/",
    "difficulty": "Easy",
    "topic": "Linked List",
    "sheet_name": "Curated Top DSA 75",
    "order_index": 9
  },
  {
    "id": "p-13",
    "title": "Linked List Cycle",
    "slug": "linked-list-cycle",
    "leetcode_url": "https://leetcode.com/problems/linked-list-cycle/",
    "difficulty": "Easy",
    "topic": "Linked List",
    "sheet_name": "Curated Top DSA 75",
    "order_index": 10
  },
  {
    "id": "p-14",
    "title": "Invert Binary Tree",
    "slug": "invert-binary-tree",
    "leetcode_url": "https://leetcode.com/problems/invert-binary-tree/",
    "difficulty": "Easy",
    "topic": "Binary Tree",
    "sheet_name": "Curated Top DSA 75",
    "order_index": 11
  },
  {
    "id": "p-15",
    "title": "Maximum Depth of Binary Tree",
    "slug": "maximum-depth-of-binary-tree",
    "leetcode_url": "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    "difficulty": "Easy",
    "topic": "Binary Tree",
    "sheet_name": "Curated Top DSA 75",
    "order_index": 12
  },
  {
    "id": "p-16",
    "title": "Validate Binary Search Tree",
    "slug": "validate-binary-search-tree",
    "leetcode_url": "https://leetcode.com/problems/validate-binary-search-tree/",
    "difficulty": "Medium",
    "topic": "Binary Search Tree",
    "sheet_name": "Curated Top DSA 75",
    "order_index": 13
  },
  {
    "id": "p-17",
    "title": "Climbing Stairs",
    "slug": "climbing-stairs",
    "leetcode_url": "https://leetcode.com/problems/climbing-stairs/",
    "difficulty": "Easy",
    "topic": "Dynamic Programming",
    "sheet_name": "Curated Top DSA 75",
    "order_index": 14
  },
  {
    "id": "p-18",
    "title": "Coin Change",
    "slug": "coin-change",
    "leetcode_url": "https://leetcode.com/problems/coin-change/",
    "difficulty": "Medium",
    "topic": "Dynamic Programming",
    "sheet_name": "Curated Top DSA 75",
    "order_index": 15
  },
  {
    "id": "p-19",
    "title": "Longest Increasing Subsequence",
    "slug": "longest-increasing-subsequence",
    "leetcode_url": "https://leetcode.com/problems/longest-increasing-subsequence/",
    "difficulty": "Medium",
    "topic": "Dynamic Programming",
    "sheet_name": "Curated Top DSA 75",
    "order_index": 16
  },
  {
    "id": "p-20",
    "title": "Number of Islands",
    "slug": "number-of-islands",
    "leetcode_url": "https://leetcode.com/problems/number-of-islands/",
    "difficulty": "Medium",
    "topic": "Graphs",
    "sheet_name": "Curated Top DSA 75",
    "order_index": 17
  },
  {
    "id": "p-1793873126369-410",
    "title": "Subarray Sum Equals K",
    "slug": "subarray-sum-equals-k",
    "leetcode_url": "https://leetcode.com/problems/subarray-sum-equals-k/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 4
  },
  {
    "id": "p-1793873268216-47",
    "title": "Running Sum of 1d Array",
    "slug": "running-sum-of-1d-array",
    "leetcode_url": "https://leetcode.com/problems/running-sum-of-1d-array/",
    "difficulty": "Easy",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 5
  },
  {
    "id": "p-1793873268216-832",
    "title": "Find the Highest Altitude",
    "slug": "find-the-highest-altitude",
    "leetcode_url": "https://leetcode.com/problems/find-the-highest-altitude/",
    "difficulty": "Easy",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 6
  },
  {
    "id": "p-1793873268216-198",
    "title": "Minimum Value to Get Positive Step by Step Sum",
    "slug": "minimum-value-to-get-positive-step-by-step-sum",
    "leetcode_url": "https://leetcode.com/problems/minimum-value-to-get-positive-step-by-step-sum/",
    "difficulty": "Easy",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 7
  },
  {
    "id": "p-1793873268216-99",
    "title": "Range Sum Query - Immutable",
    "slug": "range-sum-query-immutable",
    "leetcode_url": "https://leetcode.com/problems/range-sum-query-immutable/",
    "difficulty": "Easy",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 8
  },
  {
    "id": "p-1793873268216-926",
    "title": "Find Pivot Index",
    "slug": "find-pivot-index",
    "leetcode_url": "https://leetcode.com/problems/find-pivot-index/",
    "difficulty": "Easy",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 9
  },
  {
    "id": "p-1793873268216-50",
    "title": "Find the Middle Index in Array",
    "slug": "find-the-middle-index-in-array",
    "leetcode_url": "https://leetcode.com/problems/find-the-middle-index-in-array/",
    "difficulty": "Easy",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 10
  },
  {
    "id": "p-1793873268216-471",
    "title": "Find the Pivot Integer",
    "slug": "find-the-pivot-integer",
    "leetcode_url": "https://leetcode.com/problems/find-the-pivot-integer/",
    "difficulty": "Easy",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 11
  },
  {
    "id": "p-1793873268216-435",
    "title": "Left and Right Sum Differences",
    "slug": "left-and-right-sum-differences",
    "leetcode_url": "https://leetcode.com/problems/left-and-right-sum-differences/",
    "difficulty": "Easy",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 12
  },
  {
    "id": "p-1793873268216-236",
    "title": "Maximum Score After Splitting a String",
    "slug": "maximum-score-after-splitting-a-string",
    "leetcode_url": "https://leetcode.com/problems/maximum-score-after-splitting-a-string/",
    "difficulty": "Easy",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 13
  },
  {
    "id": "p-1793873268216-493",
    "title": "Make Array Elements Equal to Zero",
    "slug": "make-array-elements-equal-to-zero",
    "leetcode_url": "https://leetcode.com/problems/make-array-elements-equal-to-zero/",
    "difficulty": "Easy",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 14
  },
  {
    "id": "p-1793873268216-166",
    "title": "Maximum Population Year",
    "slug": "maximum-population-year",
    "leetcode_url": "https://leetcode.com/problems/maximum-population-year/",
    "difficulty": "Easy",
    "topic": "Difference Array",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 15
  },
  {
    "id": "p-1793873268216-741",
    "title": "Points That Intersect With Cars",
    "slug": "points-that-intersect-with-cars",
    "leetcode_url": "https://leetcode.com/problems/points-that-intersect-with-cars/",
    "difficulty": "Easy",
    "topic": "Difference Array",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 16
  },
  {
    "id": "p-1793873268216-413",
    "title": "Check if All the Integers in a Range Are Covered",
    "slug": "check-if-all-the-integers-in-a-range-are-covered",
    "leetcode_url": "https://leetcode.com/problems/check-if-all-the-integers-in-a-range-are-covered/",
    "difficulty": "Easy",
    "topic": "Difference Array",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 17
  },
  {
    "id": "p-1793873268216-668",
    "title": "Number of Ways to Split Array",
    "slug": "number-of-ways-to-split-array",
    "leetcode_url": "https://leetcode.com/problems/number-of-ways-to-split-array/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 18
  },
  {
    "id": "p-1793873268216-620",
    "title": "Minimum Average Difference",
    "slug": "minimum-average-difference",
    "leetcode_url": "https://leetcode.com/problems/minimum-average-difference/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 19
  },
  {
    "id": "p-1793873268216-338",
    "title": "All Divisions With the Highest Score of a Binary Array",
    "slug": "all-divisions-with-the-highest-score-of-a-binary-array",
    "leetcode_url": "https://leetcode.com/problems/all-divisions-with-the-highest-score-of-a-binary-array/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 20
  },
  {
    "id": "p-1793873268216-900",
    "title": "Find the Score of All Prefixes of an Array",
    "slug": "find-the-score-of-all-prefixes-of-an-array",
    "leetcode_url": "https://leetcode.com/problems/find-the-score-of-all-prefixes-of-an-array/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 21
  },
  {
    "id": "p-1793873268216-613",
    "title": "Count Vowel Strings in Ranges",
    "slug": "count-vowel-strings-in-ranges",
    "leetcode_url": "https://leetcode.com/problems/count-vowel-strings-in-ranges/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 22
  },
  {
    "id": "p-1793873268216-116",
    "title": "Minimum Number of Operations to Move All Balls to Each Box",
    "slug": "minimum-number-of-operations-to-move-all-balls-to-each-box",
    "leetcode_url": "https://leetcode.com/problems/minimum-number-of-operations-to-move-all-balls-to-each-box/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 23
  },
  {
    "id": "p-1793873268216-218",
    "title": "Maximum Points You Can Obtain from Cards",
    "slug": "maximum-points-you-can-obtain-from-cards",
    "leetcode_url": "https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 24
  },
  {
    "id": "p-1793873268216-6",
    "title": "Ways to Make a Fair Array",
    "slug": "ways-to-make-a-fair-array",
    "leetcode_url": "https://leetcode.com/problems/ways-to-make-a-fair-array/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 25
  },
  {
    "id": "p-1793873268216-434",
    "title": "Minimum Deletions to Make String Balanced",
    "slug": "minimum-deletions-to-make-string-balanced",
    "leetcode_url": "https://leetcode.com/problems/minimum-deletions-to-make-string-balanced/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 26
  },
  {
    "id": "p-1793894967276-43-16hjg",
    "title": "Flip String to Monotone Increasing",
    "slug": "flip-string-to-monotone-increasing",
    "leetcode_url": "https://leetcode.com/problems/flip-string-to-monotone-increasing/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 27
  },
  {
    "id": "p-1793873268216-628",
    "title": "Minimum Penalty for a Shop",
    "slug": "minimum-penalty-for-a-shop",
    "leetcode_url": "https://leetcode.com/problems/minimum-penalty-for-a-shop/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 28
  },
  {
    "id": "p-1793873268216-952",
    "title": "Find Good Days to Rob the Bank",
    "slug": "find-good-days-to-rob-the-bank",
    "leetcode_url": "https://leetcode.com/problems/find-good-days-to-rob-the-bank/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 29
  },
  {
    "id": "p-1793873268216-483",
    "title": "Find All Good Indices",
    "slug": "find-all-good-indices",
    "leetcode_url": "https://leetcode.com/problems/find-all-good-indices/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 30
  },
  {
    "id": "p-1793873268216-813",
    "title": "Sum of Beauty in the Array",
    "slug": "sum-of-beauty-in-the-array",
    "leetcode_url": "https://leetcode.com/problems/sum-of-beauty-in-the-array/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 31
  },
  {
    "id": "p-1793894967276-48-cj9ir",
    "title": "Grid Game",
    "slug": "grid-game",
    "leetcode_url": "https://leetcode.com/problems/grid-game/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 32
  },
  {
    "id": "p-1793873268216-415",
    "title": "Plates Between Candles",
    "slug": "plates-between-candles",
    "leetcode_url": "https://leetcode.com/problems/plates-between-candles/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 33
  },
  {
    "id": "p-1793894967276-50-nr5ad",
    "title": "Sum of Absolute Differences in Sorted Array",
    "slug": "sum-of-absolute-differences-in-sorted-array",
    "leetcode_url": "https://leetcode.com/problems/sum-of-absolute-differences-in-sorted-array/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 34
  },
  {
    "id": "p-1793873268216-600",
    "title": "Minimum Operations to Make All Array Elements Equal",
    "slug": "minimum-operations-to-make-all-array-elements-equal",
    "leetcode_url": "https://leetcode.com/problems/minimum-operations-to-make-all-array-elements-equal/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 35
  },
  {
    "id": "p-1793873268216-226",
    "title": "Sum of Distances",
    "slug": "sum-of-distances",
    "leetcode_url": "https://leetcode.com/problems/sum-of-distances/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 36
  },
  {
    "id": "p-1793873268216-392",
    "title": "Intervals Between Identical Elements",
    "slug": "intervals-between-identical-elements",
    "leetcode_url": "https://leetcode.com/problems/intervals-between-identical-elements/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 37
  },
  {
    "id": "p-1793873268216-785",
    "title": "Minimum Amount of Time to Collect Garbage",
    "slug": "minimum-amount-of-time-to-collect-garbage",
    "leetcode_url": "https://leetcode.com/problems/minimum-amount-of-time-to-collect-garbage/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 38
  },
  {
    "id": "p-1793873268216-437",
    "title": "Count the Hidden Sequences",
    "slug": "count-the-hidden-sequences",
    "leetcode_url": "https://leetcode.com/problems/count-the-hidden-sequences/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 39
  },
  {
    "id": "p-1793873268216-297",
    "title": "Can You Eat Your Favorite Candy on Your Favorite Day?",
    "slug": "can-you-eat-your-favorite-candy-on-your-favorite-day",
    "leetcode_url": "https://leetcode.com/problems/can-you-eat-your-favorite-candy-on-your-favorite-day/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 40
  },
  {
    "id": "p-1793873268216-588",
    "title": "Product of the Last K Numbers",
    "slug": "product-of-the-last-k-numbers",
    "leetcode_url": "https://leetcode.com/problems/product-of-the-last-k-numbers/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 41
  },
  {
    "id": "p-1793873268216-545",
    "title": "Maximum Value of an Ordered Triplet II",
    "slug": "maximum-value-of-an-ordered-triplet-ii",
    "leetcode_url": "https://leetcode.com/problems/maximum-value-of-an-ordered-triplet-ii/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 42
  },
  {
    "id": "p-1793873268216-146",
    "title": "Minimum Sum of Mountain Triplets II",
    "slug": "minimum-sum-of-mountain-triplets-ii",
    "leetcode_url": "https://leetcode.com/problems/minimum-sum-of-mountain-triplets-ii/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 43
  },
  {
    "id": "p-1793873268216-992",
    "title": "Beautiful Towers I",
    "slug": "beautiful-towers-i",
    "leetcode_url": "https://leetcode.com/problems/beautiful-towers-i/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 44
  },
  {
    "id": "p-1793873268216-778",
    "title": "Beautiful Towers II",
    "slug": "beautiful-towers-ii",
    "leetcode_url": "https://leetcode.com/problems/beautiful-towers-ii/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 45
  },
  {
    "id": "p-1793873268216-986",
    "title": "Range Sum Query 2D - Immutable",
    "slug": "range-sum-query-2d-immutable",
    "leetcode_url": "https://leetcode.com/problems/range-sum-query-2d-immutable/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 46
  },
  {
    "id": "p-1793873268216-876",
    "title": "Matrix Block Sum",
    "slug": "matrix-block-sum",
    "leetcode_url": "https://leetcode.com/problems/matrix-block-sum/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 47
  },
  {
    "id": "p-1793873268216-724",
    "title": "Maximum Side Length of a Square with Sum Less than or Equal to Threshold",
    "slug": "maximum-side-length-of-a-square-with-sum-less-than-or-equal-to-threshold",
    "leetcode_url": "https://leetcode.com/problems/maximum-side-length-of-a-square-with-sum-less-than-or-equal-to-threshold/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 48
  },
  {
    "id": "p-1793873268216-494",
    "title": "Find Kth Largest XOR Coordinate Value",
    "slug": "find-kth-largest-xor-coordinate-value",
    "leetcode_url": "https://leetcode.com/problems/find-kth-largest-xor-coordinate-value/",
    "difficulty": "Medium",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 49
  },
  {
    "id": "p-1793873268216-549",
    "title": "Increment Submatrices by One",
    "slug": "increment-submatrices-by-one",
    "leetcode_url": "https://leetcode.com/problems/increment-submatrices-by-one/",
    "difficulty": "Medium",
    "topic": "Difference Array",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 50
  },
  {
    "id": "p-1793873268216-489",
    "title": "Car Pooling",
    "slug": "car-pooling",
    "leetcode_url": "https://leetcode.com/problems/car-pooling/",
    "difficulty": "Medium",
    "topic": "Difference Array",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 51
  },
  {
    "id": "p-1793873268216-371",
    "title": "Corporate Flight Bookings",
    "slug": "corporate-flight-bookings",
    "leetcode_url": "https://leetcode.com/problems/corporate-flight-bookings/",
    "difficulty": "Medium",
    "topic": "Difference Array",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 52
  },
  {
    "id": "p-1793873268216-901",
    "title": "Shifting Letters II",
    "slug": "shifting-letters-ii",
    "leetcode_url": "https://leetcode.com/problems/shifting-letters-ii/",
    "difficulty": "Medium",
    "topic": "Difference Array",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 53
  },
  {
    "id": "p-1793873268216-120",
    "title": "Candy",
    "slug": "candy",
    "leetcode_url": "https://leetcode.com/problems/candy/",
    "difficulty": "Hard",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 54
  },
  {
    "id": "p-1793873268216-973",
    "title": "Best Time to Buy and Sell Stock III",
    "slug": "best-time-to-buy-and-sell-stock-iii",
    "leetcode_url": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/",
    "difficulty": "Hard",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 55
  },
  {
    "id": "p-1793873268216-132",
    "title": "Max Chunks To Make Sorted II",
    "slug": "max-chunks-to-make-sorted-ii",
    "leetcode_url": "https://leetcode.com/problems/max-chunks-to-make-sorted-ii/",
    "difficulty": "Hard",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 56
  },
  {
    "id": "p-1793873268216-347",
    "title": "Minimum Difference in Sums After Removal of Elements",
    "slug": "minimum-difference-in-sums-after-removal-of-elements",
    "leetcode_url": "https://leetcode.com/problems/minimum-difference-in-sums-after-removal-of-elements/",
    "difficulty": "Hard",
    "topic": "Prefix Sum",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 57
  },
  {
    "id": "p-1793873268216-478",
    "title": "Stamping the Grid",
    "slug": "stamping-the-grid",
    "leetcode_url": "https://leetcode.com/problems/stamping-the-grid/",
    "difficulty": "Hard",
    "topic": "Difference Array",
    "sheet_name": "Prefix and suffix problem",
    "source": "PDF Upload",
    "order_index": 58
  }
];

export const INITIAL_USER_PROBLEMS: Record<string, any> = {
  "user_shivam_p-1": {
    "id": "up-1",
    "user_id": "user_shivam",
    "problem_id": "p-1",
    "status": "done",
    "solved_at": "2026-11-05T09:40:50.955Z",
    "revision_count": 17,
    "last_revised_at": "2026-11-05T10:13:24.537Z"
  },
  "user_shreya_p-1": {
    "id": "up-2",
    "user_id": "user_shreya",
    "problem_id": "p-1",
    "status": "done",
    "solved_at": "2026-11-05T09:40:50.956Z",
    "revision_count": 2,
    "last_revised_at": "2026-11-05T09:40:50.956Z"
  },
  "user_shivam_p-2": {
    "id": "up-3",
    "user_id": "user_shivam",
    "problem_id": "p-2",
    "status": "done",
    "solved_at": "2026-11-05T09:40:50.956Z",
    "revision_count": 1,
    "last_revised_at": "2026-11-05T09:40:50.956Z"
  },
  "user_shreya_p-2": {
    "id": "up-4",
    "user_id": "user_shreya",
    "problem_id": "p-2",
    "status": "done",
    "solved_at": "2026-11-05T09:40:50.956Z",
    "revision_count": 2,
    "last_revised_at": "2026-11-05T09:40:50.956Z"
  },
  "user_shivam_p-3": {
    "id": "up-5",
    "user_id": "user_shivam",
    "problem_id": "p-3",
    "status": "done",
    "solved_at": "2026-11-05T09:40:50.956Z",
    "revision_count": 1,
    "last_revised_at": "2026-11-05T09:40:50.956Z"
  },
  "user_shreya_p-9": {
    "id": "up-6",
    "user_id": "user_shreya",
    "problem_id": "p-9",
    "status": "done",
    "solved_at": "2026-11-05T09:40:50.956Z",
    "revision_count": 1,
    "last_revised_at": "2026-11-05T09:40:50.956Z"
  },
  "user_shivam_p-4": {
    "id": "up-1793873305318",
    "user_id": "user_shivam",
    "problem_id": "p-4",
    "status": "done",
    "solved_at": "2026-11-05T10:08:25.318Z",
    "revision_count": 1,
    "last_revised_at": "2026-11-05T10:08:25.318Z"
  },
  "user_shivam_p-8": {
    "id": "up-1793873306417",
    "user_id": "user_shivam",
    "problem_id": "p-8",
    "status": "done",
    "solved_at": "2026-11-05T10:08:26.417Z",
    "revision_count": 1,
    "last_revised_at": "2026-11-05T10:08:26.417Z"
  },
  "user_shivam_p-1793873126369-410": {
    "id": "up-1793873311605",
    "user_id": "user_shivam",
    "problem_id": "p-1793873126369-410",
    "status": "done",
    "solved_at": "2026-11-05T10:08:31.605Z",
    "revision_count": 1,
    "last_revised_at": "2026-11-05T10:08:31.605Z"
  },
  "user_shivam_p-1793873268216-47": {
    "id": "up-1793873312318",
    "user_id": "user_shivam",
    "problem_id": "p-1793873268216-47",
    "status": "done",
    "solved_at": "2026-11-05T10:08:32.318Z",
    "revision_count": 1,
    "last_revised_at": "2026-11-05T10:08:32.318Z"
  },
  "user_shreya_p-4": {
    "id": "up-1793873551467",
    "user_id": "user_shreya",
    "problem_id": "p-4",
    "status": "done",
    "solved_at": "2026-11-05T10:12:31.467Z",
    "revision_count": 1,
    "last_revised_at": "2026-11-05T10:12:31.467Z"
  },
  "user_shivam_p-5": {
    "id": "up-1793887375463",
    "user_id": "user_shivam",
    "problem_id": "p-5",
    "status": "done",
    "solved_at": "2026-11-05T14:02:55.463Z",
    "revision_count": 1,
    "last_revised_at": "2026-11-05T14:02:55.463Z"
  },
  "user_shreya_p-5": {
    "id": "up-1793888848013",
    "user_id": "user_shreya",
    "problem_id": "p-5",
    "status": "done",
    "solved_at": "2026-11-05T14:27:28.013Z",
    "revision_count": 1,
    "last_revised_at": "2026-11-05T14:27:28.013Z"
  }
};

export const INITIAL_BATTLES: Battle[] = [
  {
    "id": "b-1",
    "problem_id": "p-1",
    "problem_title": "Two Sum",
    "problem_slug": "two-sum",
    "problem_difficulty": "Easy",
    "scheduled_at": "2026-11-06T09:40:50.956Z",
    "duration_minutes": 30,
    "status": "scheduled",
    "created_by": "user_shivam",
    "notes": "Speed run: O(N) Hash Map solution under 10 mins!",
    "created_at": "2026-11-05T09:40:50.956Z"
  },
  {
    "id": "b-2",
    "problem_id": "p-2",
    "problem_title": "Best Time to Buy and Sell Stock",
    "problem_slug": "best-time-to-buy-and-sell-stock",
    "problem_difficulty": "Easy",
    "scheduled_at": "2026-11-03T09:40:50.956Z",
    "duration_minutes": 30,
    "status": "completed",
    "winner_id": "user_shreya",
    "winner_name": "Shreya Gaur",
    "created_by": "user_shreya",
    "notes": "Shreya solved in 6 mins, Shivam solved in 8 mins.",
    "created_at": "2026-11-03T08:40:50.956Z"
  }
];

export const INITIAL_THEORY_NOTES: Note[] = [];

export const INITIAL_ROUGH_FILES: CodeFile[] = [];

export const INITIAL_TIMETABLE: TimetableSlot[] = [];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    "id": "m-1",
    "sender_id": "user_shivam",
    "receiver_id": "user_shreya",
    "content": "Hey Shreya! Two Sum revise kar liya kya?",
    "is_read": true,
    "created_at": "2026-11-05T09:10:50.956Z"
  },
  {
    "id": "m-2",
    "sender_id": "user_shreya",
    "receiver_id": "user_shivam",
    "content": "Haan, kar liya! Aaj shaam ko 8 baje Two Sum ka 1v1 battle karte hain!",
    "is_read": true,
    "created_at": "2026-11-05T09:20:50.956Z"
  },
  {
    "id": "m-1793873369938",
    "sender_id": "user_shivam",
    "receiver_id": "user_shreya",
    "content": "baby",
    "is_read": false,
    "created_at": "2026-11-05T10:09:29.938Z"
  }
];

export const INITIAL_ACTIVITIES: ActivityNotification[] = [
  {
    "id": "act-1793888848013-491",
    "user_id": "user_shreya",
    "user_name": "Shreya Gaur",
    "problem_id": "p-5",
    "problem_title": "Maximum Subarray",
    "action": "solved",
    "both_done": true,
    "created_at": "2026-11-05T14:27:28.013Z"
  }
];

export const INITIAL_COINS = {
  "shivam": 27,
  "shreya": 27
};
