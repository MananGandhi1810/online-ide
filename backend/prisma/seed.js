import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "admin@example.com"
const ADMIN_PASSWORD = "adminpassword"

const problemStatements = [
  {
    title: "Two Sum",
    description: `## Two Sum

Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

### Examples

**Example 1**
- **Input:** nums = [2,7,11,15], target = 9
- **Output:** [0,1]
- **Explanation:** Because nums[0] + nums[1] == 9, we return [0, 1].

**Example 2**
- **Input:** nums = [3,2,4], target = 6
- **Output:** [1,2]

**Example 3**
- **Input:** nums = [3,3], target = 6
- **Output:** [0,1]

### Constraints

- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Only one valid answer exists.`,
    difficulty: "Easy",
    testCases: [
      { input: "[2,7,11,15]\n9", output: "[0,1]", hidden: false },
      { input: "[3,2,4]\n6", output: "[1,2]", hidden: false },
      { input: "[3,3]\n6", output: "[0,1]", hidden: false },
    ],
    starterCode: [
      {
        language: "javascript",
        code: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Write your code here
};`,
      },
      {
        language: "python",
        code: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Write your code here
        pass`,
      },
      {
        language: "java",
        code: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }
}`,
      },
    ],
  },
  {
    title: "Reverse String",
    description: `## Reverse String

Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.

### Examples

**Example 1**
- **Input:** s = ["h","e","l","l","o"]
- **Output:** ["o","l","l","e","h"]

**Example 2**
- **Input:** s = ["H","a","n","n","a","h"]
- **Output:** ["h","a","n","n","a","H"]

### Constraints

- 1 <= s.length <= 10^5
- s[i] is a printable ascii character.`,
    difficulty: "Easy",
    testCases: [
      { input: '["h","e","l","l","o"]', output: '["o","l","l","e","h"]', hidden: false },
      { input: '["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]', hidden: false },
      { input: '["a"]', output: '["a"]', hidden: false },
    ],
    starterCode: [
      {
        language: "javascript",
        code: `/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
var reverseString = function(s) {
    // Write your code here
};`,
      },
      {
        language: "python",
        code: `class Solution:
    def reverseString(self, s: list[str]) -> None:
        # Write your code here
        pass`,
      },
      {
        language: "java",
        code: `class Solution {
    public void reverseString(char[] s) {
        // Write your code here
    }
}`,
      },
    ],
  },
  {
    title: "Longest Substring Without Repeating Characters",
    description: `## Longest Substring Without Repeating Characters

Given a string s, find the length of the longest substring without repeating characters.

### Examples

**Example 1**
- **Input:** s = "abcabcbb"
- **Output:** 3
- **Explanation:** The answer is "abc", with the length of 3.

**Example 2**
- **Input:** s = "bbbbb"
- **Output:** 1
- **Explanation:** The answer is "b", with the length of 1.

**Example 3**
- **Input:** s = "pwwkew"
- **Output:** 3
- **Explanation:** The answer is "wke", with the length of 3.

### Constraints

- 0 <= s.length <= 5 * 10^4
- s consists of English letters, digits, symbols and spaces.`,
    difficulty: "Medium",
    testCases: [
      { input: '"abcabcbb"', output: "3", hidden: false },
      { input: '"bbbbb"', output: "1", hidden: false },
      { input: '"pwwkew"', output: "3", hidden: false },
    ],
    starterCode: [
      {
        language: "javascript",
        code: `/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    // Write your code here
};`,
      },
      {
        language: "python",
        code: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # Write your code here
        return 0`,
      },
      {
        language: "java",
        code: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write your code here
        return 0;
    }
}`,
      },
    ],
  },
  {
    title: "Median of Two Sorted Arrays",
    description: `## Median of Two Sorted Arrays

Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)).

### Examples

**Example 1**
- **Input:** nums1 = [1,3], nums2 = [2]
- **Output:** 2.00000
- **Explanation:** merged array = [1,2,3] and median is 2.

**Example 2**
- **Input:** nums1 = [1,2], nums2 = [3,4]
- **Output:** 2.50000
- **Explanation:** merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.

### Constraints

- nums1.length == m
- nums2.length == n
- 0 <= m <= 1000
- 0 <= n <= 1000
- 1 <= m + n <= 2000
- -10^6 <= nums1[i], nums2[i] <= 10^6`,
    difficulty: "Hard",
    testCases: [
      { input: "[1,3]\n[2]", output: "2.0", hidden: false },
      { input: "[1,2]\n[3,4]", output: "2.5", hidden: false },
      { input: "[0,0]\n[0,0]", output: "0.0", hidden: false },
    ],
    starterCode: [
      {
        language: "javascript",
        code: `/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function(nums1, nums2) {
    // Write your code here
};`,
      },
      {
        language: "python",
        code: `class Solution:
    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:
        # Write your code here
        return 0.0`,
      },
      {
        language: "java",
        code: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        // Write your code here
        return 0.0;
    }
}`,
      },
    ],
  },
  {
    title: "Valid Parentheses",
    description: `## Valid Parentheses

Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:

1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

### Examples

**Example 1**
- **Input:** s = "()"
- **Output:** true

**Example 2**
- **Input:** s = "()[]{}"
- **Output:** true

**Example 3**
- **Input:** s = "(]"
- **Output:** false

### Constraints

- 1 <= s.length <= 10^4
- s consists of parentheses only '()[]{}' `,
    difficulty: "Easy",
    testCases: [
      { input: '"()"', output: "true", hidden: false },
      { input: '"()[]{}"', output: "true", hidden: false },
      { input: '"(]"', output: "false", hidden: false },
    ],
    starterCode: [
      {
        language: "javascript",
        code: `/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    // Write your code here
};`,
      },
      {
        language: "python",
        code: `class Solution:
    def isValid(self, s: str) -> bool:
        # Write your code here
        return False`,
      },
      {
        language: "java",
        code: `class Solution {
    public boolean isValid(String s) {
        // Write your code here
        return false;
    }
}`,
      },
    ],
  },
];

async function addProblemStatements() {
  try {
    let adminUser = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL },
    });

    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          name: "Admin User",
          isVerified: true,
          admin: true,
          authProvider: "EMAIL",
        },
      });
      console.log("✓ Created admin user");
    }

    for (const problem of problemStatements) {
      const existingProblem = await prisma.problemStatement.findFirst({
        where: { title: problem.title },
      });

      if (existingProblem) {
        console.log(`⊘ Problem "${problem.title}" already exists, skipping...`);
        continue;
      }

      const createdProblem = await prisma.problemStatement.create({
        data: {
          title: problem.title,
          description: problem.description,
          difficulty: problem.difficulty,
          createdById: adminUser.id,
          testCase: {
            createMany: {
              data: problem.testCases.map((tc) => ({
                input: tc.input,
                output: tc.output,
                hidden: tc.hidden,
              })),
            },
          },
          starterCode: {
            createMany: {
              data: problem.starterCode.map((sc) => ({
                language: sc.language,
                code: sc.code,
              })),
            },
          },
        },
        include: {
          testCase: true,
          starterCode: true,
        },
      });

      console.log(
        `✓ Added problem: "${createdProblem.title}" (${createdProblem.difficulty})`
      );
      console.log(
        `  - Test cases: ${createdProblem.testCase.length}, Languages: ${createdProblem.starterCode.length}`
      );
    }

    console.log("\n✓ Seed completed successfully!");
  } catch (error) {
    console.error("Error seeding problem statements:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

addProblemStatements().catch((error) => {
  console.error(error);
  process.exit(1);
});
