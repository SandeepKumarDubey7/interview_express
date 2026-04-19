export interface DSACheatSheetTopic {
  title: string;
  description: string;
  iconName: string;
  concepts: DSAConcept[];
}

export interface DSAConcept {
  name: string;
  description: string;
  complexity?: {
    time: string;
    space: string;
  };
  code?: {
    cpp?: string;
    java?: string;
    python?: string;
    javascript?: string;
  };
  keyPoints?: string[];
}

export const dsaCheatSheetData: DSACheatSheetTopic[] = [
  {
    title: "Time & Space Complexity",
    description: "Big O, Omega, Theta analysis",
    iconName: "Clock",
    concepts: [
      {
        name: "Big O Notation",
        description: "Upper bound of algorithm's running time",
        keyPoints: [
          "O(1) - Constant time",
          "O(log n) - Logarithmic time",
          "O(n) - Linear time",
          "O(n log n) - Linearithmic time",
          "O(n²) - Quadratic time",
          "O(2ⁿ) - Exponential time"
        ]
      },
      {
        name: "Common Complexities",
        description: "Most frequently encountered time complexities",
        keyPoints: [
          "Array access: O(1)",
          "Binary search: O(log n)",
          "Linear search: O(n)",
          "Merge sort: O(n log n)",
          "Bubble sort: O(n²)",
          "Fibonacci (naive): O(2ⁿ)"
        ]
      }
    ]
  },
  {
    title: "Arrays",
    description: "Linear data structure fundamentals",
    iconName: "List",
    concepts: [
      {
        name: "Two Pointers",
        description: "Technique using two pointers to solve array problems",
        complexity: {
          time: "O(n)",
          space: "O(1)"
        },
        code: {
          cpp: `// Two Sum - Sorted Array
vector<int> twoSum(vector<int>& nums, int target) {
    int left = 0, right = nums.size() - 1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == target) return {left, right};
        else if (sum < target) left++;
        else right--;
    }
    return {};
}`,
          java: `// Two Sum - Sorted Array
public int[] twoSum(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == target) return new int[]{left, right};
        else if (sum < target) left++;
        else right--;
    }
    return new int[]{};
}`,
          python: `# Two Sum - Sorted Array
def two_sum(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        current_sum = nums[left] + nums[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return []`,
          javascript: `// Two Sum - Sorted Array
function twoSum(nums, target) {
    let left = 0, right = nums.length - 1;
    while (left < right) {
        const sum = nums[left] + nums[right];
        if (sum === target) return [left, right];
        else if (sum < target) left++;
        else right--;
    }
    return [];
}`
        },
        keyPoints: [
          "Use when array is sorted",
          "Reduces O(n²) to O(n)",
          "Common in pair/triplet problems"
        ]
      },
      {
        name: "Sliding Window",
        description: "Technique for subarray problems",
        complexity: {
          time: "O(n)",
          space: "O(1)"
        },
        code: {
          cpp: `// Maximum sum subarray of size k
int maxSumSubarray(vector<int>& arr, int k) {
    int maxSum = 0, windowSum = 0;
    
    // Calculate sum of first window
    for (int i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    maxSum = windowSum;
    
    // Slide the window
    for (int i = k; i < arr.size(); i++) {
        windowSum += arr[i] - arr[i - k];
        maxSum = max(maxSum, windowSum);
    }
    return maxSum;
}`,
          python: `# Maximum sum subarray of size k
def max_sum_subarray(arr, k):
    max_sum = window_sum = sum(arr[:k])
    
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum`
        },
        keyPoints: [
          "Fixed or variable window size",
          "Maintains window invariant",
          "Efficient for subarray problems"
        ]
      },
      {
        name: "Kadane's Algorithm",
        description: "Maximum subarray sum problem",
        complexity: {
          time: "O(n)",
          space: "O(1)"
        },
        code: {
          cpp: `// Maximum subarray sum
int maxSubarraySum(vector<int>& nums) {
    int maxSum = nums[0];
    int currentSum = nums[0];
    
    for (int i = 1; i < nums.size(); i++) {
        currentSum = max(nums[i], currentSum + nums[i]);
        maxSum = max(maxSum, currentSum);
    }
    return maxSum;
}`,
          python: `# Maximum subarray sum
def max_subarray_sum(nums):
    max_sum = current_sum = nums[0]
    
    for i in range(1, len(nums)):
        current_sum = max(nums[i], current_sum + nums[i])
        max_sum = max(max_sum, current_sum)
    
    return max_sum`
        },
        keyPoints: [
          "Dynamic programming approach",
          "Handles negative numbers",
          "Classic interview problem"
        ]
      }
    ]
  },
  {
    title: "Strings",
    description: "String manipulation and pattern matching",
    iconName: "Search",
    concepts: [
      {
        name: "Two Pointers (Palindrome)",
        description: "Check if string is palindrome",
        complexity: {
          time: "O(n)",
          space: "O(1)"
        },
        code: {
          cpp: `bool isPalindrome(string s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        if (s[left] != s[right]) return false;
        left++;
        right--;
    }
    return true;
}`,
          python: `def is_palindrome(s):
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True`
        }
      },
      {
        name: "KMP Algorithm",
        description: "Efficient pattern matching",
        complexity: {
          time: "O(n + m)",
          space: "O(m)"
        },
        keyPoints: [
          "Builds failure function",
          "Avoids redundant comparisons",
          "Linear time complexity"
        ]
      }
    ]
  },
  {
    title: "Linked Lists",
    description: "Dynamic linear data structure",
    iconName: "GitBranch",
    concepts: [
      {
        name: "Reverse Linked List",
        description: "Reverse a singly linked list",
        complexity: {
          time: "O(n)",
          space: "O(1)"
        },
        code: {
          cpp: `ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* current = head;
    
    while (current != nullptr) {
        ListNode* next = current->next;
        current->next = prev;
        prev = current;
        current = next;
    }
    return prev;
}`,
          python: `def reverse_list(head):
    prev = None
    current = head
    
    while current:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node
    
    return prev`
        }
      },
      {
        name: "Floyd's Cycle Detection",
        description: "Detect cycle in linked list",
        complexity: {
          time: "O(n)",
          space: "O(1)"
        },
        code: {
          cpp: `bool hasCycle(ListNode* head) {
    if (!head || !head->next) return false;
    
    ListNode* slow = head;
    ListNode* fast = head->next;
    
    while (slow != fast) {
        if (!fast || !fast->next) return false;
        slow = slow->next;
        fast = fast->next->next;
    }
    return true;
}`,
          python: `def has_cycle(head):
    if not head or not head.next:
        return False
    
    slow = head
    fast = head.next
    
    while slow != fast:
        if not fast or not fast.next:
            return False
        slow = slow.next
        fast = fast.next.next
    
    return True`
        },
        keyPoints: [
          "Two pointers: slow and fast",
          "Fast moves 2 steps, slow moves 1",
          "If cycle exists, they will meet"
        ]
      }
    ]
  },
  {
    title: "Stack & Queue",
    description: "LIFO and FIFO data structures",
    iconName: "Layers",
    concepts: [
      {
        name: "Valid Parentheses",
        description: "Check if parentheses are balanced",
        complexity: {
          time: "O(n)",
          space: "O(n)"
        },
        code: {
          cpp: `bool isValid(string s) {
    stack<char> st;
    unordered_map<char, char> mapping = {
        {')', '('}, {'}', '{'}, {']', '['}
    };
    
    for (char c : s) {
        if (mapping.count(c)) {
            if (st.empty() || st.top() != mapping[c]) {
                return false;
            }
            st.pop();
        } else {
            st.push(c);
        }
    }
    return st.empty();
}`,
          python: `def is_valid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
        else:
            stack.append(char)
    
    return not stack`
        }
      },
      {
        name: "Monotonic Stack",
        description: "Stack maintaining monotonic property",
        complexity: {
          time: "O(n)",
          space: "O(n)"
        },
        keyPoints: [
          "Maintains increasing/decreasing order",
          "Useful for next greater/smaller element",
          "Each element pushed and popped once"
        ]
      }
    ]
  },
  {
    title: "Trees",
    description: "Hierarchical data structure",
    iconName: "TreePine",
    concepts: [
      {
        name: "Tree Traversals",
        description: "Different ways to visit tree nodes",
        complexity: {
          time: "O(n)",
          space: "O(h)"
        },
        code: {
          cpp: `// Inorder Traversal (Recursive)
void inorder(TreeNode* root, vector<int>& result) {
    if (!root) return;
    inorder(root->left, result);
    result.push_back(root->val);
    inorder(root->right, result);
}

// Preorder Traversal (Iterative)
vector<int> preorderTraversal(TreeNode* root) {
    vector<int> result;
    stack<TreeNode*> st;
    if (root) st.push(root);
    
    while (!st.empty()) {
        TreeNode* node = st.top();
        st.pop();
        result.push_back(node->val);
        
        if (node->right) st.push(node->right);
        if (node->left) st.push(node->left);
    }
    return result;
}`,
          python: `# Inorder Traversal (Recursive)
def inorder(root, result):
    if not root:
        return
    inorder(root.left, result)
    result.append(root.val)
    inorder(root.right, result)

# Level Order Traversal (BFS)
def level_order(root):
    if not root:
        return []
    
    result = []
    queue = [root]
    
    while queue:
        level_size = len(queue)
        level = []
        
        for _ in range(level_size):
            node = queue.pop(0)
            level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level)
    
    return result`
        },
        keyPoints: [
          "Inorder: Left → Root → Right",
          "Preorder: Root → Left → Right",
          "Postorder: Left → Right → Root",
          "Level order: BFS traversal"
        ]
      },
      {
        name: "Binary Search Tree",
        description: "Ordered binary tree",
        complexity: {
          time: "O(log n) average, O(n) worst",
          space: "O(log n)"
        },
        code: {
          cpp: `// Search in BST
TreeNode* searchBST(TreeNode* root, int val) {
    if (!root || root->val == val) return root;
    return val < root->val ? 
           searchBST(root->left, val) : 
           searchBST(root->right, val);
}

// Insert into BST
TreeNode* insertIntoBST(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    
    if (val < root->val) {
        root->left = insertIntoBST(root->left, val);
    } else {
        root->right = insertIntoBST(root->right, val);
    }
    return root;
}`
        },
        keyPoints: [
          "Left subtree < root < right subtree",
          "Inorder gives sorted sequence",
          "Average O(log n) operations"
        ]
      }
    ]
  },
  {
    title: "Binary Search",
    description: "Divide and conquer search algorithm",
    iconName: "Target",
    concepts: [
      {
        name: "Binary Search Template",
        description: "Standard binary search implementation",
        complexity: {
          time: "O(log n)",
          space: "O(1)"
        },
        code: {
          cpp: `int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}`,
          python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1`
        }
      },
      {
        name: "Lower Bound",
        description: "Find first position where element can be inserted",
        complexity: {
          time: "O(log n)",
          space: "O(1)"
        },
        code: {
          cpp: `int lowerBound(vector<int>& arr, int target) {
    int left = 0, right = arr.size();
    
    while (left < right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    return left;
}`
        }
      }
    ]
  },
  {
    title: "Graphs",
    description: "Network of connected nodes",
    iconName: "Network",
    concepts: [
      {
        name: "Depth-First Search (DFS)",
        description: "Explore as far as possible before backtracking",
        complexity: {
          time: "O(V + E)",
          space: "O(V)"
        },
        code: {
          cpp: `void dfs(vector<vector<int>>& graph, int node, vector<bool>& visited) {
    visited[node] = true;
    
    for (int neighbor : graph[node]) {
        if (!visited[neighbor]) {
            dfs(graph, neighbor, visited);
        }
    }
}`,
          python: `def dfs(graph, node, visited):
    visited[node] = True
    
    for neighbor in graph[node]:
        if not visited[neighbor]:
            dfs(graph, neighbor, visited)`
        }
      },
      {
        name: "Breadth-First Search (BFS)",
        description: "Explore level by level",
        complexity: {
          time: "O(V + E)",
          space: "O(V)"
        },
        code: {
          cpp: `void bfs(vector<vector<int>>& graph, int start) {
    vector<bool> visited(graph.size(), false);
    queue<int> q;
    
    visited[start] = true;
    q.push(start);
    
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        
        for (int neighbor : graph[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
}`,
          python: `from collections import deque

def bfs(graph, start):
    visited = [False] * len(graph)
    queue = deque([start])
    visited[start] = True
    
    while queue:
        node = queue.popleft()
        
        for neighbor in graph[node]:
            if not visited[neighbor]:
                visited[neighbor] = True
                queue.append(neighbor)`
        }
      }
    ]
  },
  {
    title: "Dynamic Programming",
    description: "Optimization technique using memoization",
    iconName: "Database",
    concepts: [
      {
        name: "Fibonacci (Memoization)",
        description: "Top-down DP approach",
        complexity: {
          time: "O(n)",
          space: "O(n)"
        },
        code: {
          cpp: `unordered_map<int, int> memo;

int fibonacci(int n) {
    if (n <= 1) return n;
    
    if (memo.count(n)) return memo[n];
    
    memo[n] = fibonacci(n-1) + fibonacci(n-2);
    return memo[n];
}`,
          python: `def fibonacci(n, memo={}):
    if n <= 1:
        return n
    
    if n in memo:
        return memo[n]
    
    memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)
    return memo[n]`
        }
      },
      {
        name: "0/1 Knapsack",
        description: "Classic DP problem",
        complexity: {
          time: "O(n * W)",
          space: "O(n * W)"
        },
        code: {
          cpp: `int knapsack(vector<int>& weights, vector<int>& values, int W) {
    int n = weights.size();
    vector<vector<int>> dp(n+1, vector<int>(W+1, 0));
    
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= W; w++) {
            if (weights[i-1] <= w) {
                dp[i][w] = max(
                    values[i-1] + dp[i-1][w-weights[i-1]],
                    dp[i-1][w]
                );
            } else {
                dp[i][w] = dp[i-1][w];
            }
        }
    }
    return dp[n][W];
}`
        },
        keyPoints: [
          "Either include or exclude item",
          "Build solution bottom-up",
          "Optimal substructure property"
        ]
      }
    ]
  }
];