
import React, { useState } from 'react';

// Sample data for demonstration (replace with full 100+ problems per section as needed)
const serviceBased = [
  {
    level: 'Easy',
    questions: [
      { name: 'Two Sum', link: 'https://leetcode.com/problems/two-sum/', resource: 'https://www.youtube.com/watch?v=KLlXCFG5TnA' },
      { name: 'Reverse String', link: 'https://leetcode.com/problems/reverse-string/', resource: '' },
      { name: 'Valid Parentheses', link: 'https://leetcode.com/problems/valid-parentheses/', resource: 'https://www.youtube.com/watch?v=WTzjTskDFMg' },
      { name: 'Maximum Subarray', link: 'https://leetcode.com/problems/maximum-subarray/', resource: 'https://www.youtube.com/watch?v=5WZl3MMT0Eg' },
      { name: 'Merge Two Sorted Lists', link: 'https://leetcode.com/problems/merge-two-sorted-lists/', resource: 'https://www.youtube.com/watch?v=XIdigk956u0' },
      { name: 'Remove Duplicates from Sorted Array', link: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/', resource: '' },
      { name: 'Best Time to Buy and Sell Stock', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', resource: 'https://www.youtube.com/watch?v=1pkOgXD63yU' },
      { name: 'Intersection of Two Linked Lists', link: 'https://leetcode.com/problems/intersection-of-two-linked-lists/', resource: 'https://www.youtube.com/watch?v=ipbfg7b2_6w' },
      { name: 'Valid Anagram', link: 'https://leetcode.com/problems/valid-anagram/', resource: '' },
      { name: 'Palindrome Number', link: 'https://leetcode.com/problems/palindrome-number/', resource: '' },
      { name: 'Climbing Stairs', link: 'https://leetcode.com/problems/climbing-stairs/', resource: '' },
      { name: 'Single Number', link: 'https://leetcode.com/problems/single-number/', resource: '' },
      { name: 'Majority Element', link: 'https://leetcode.com/problems/majority-element/', resource: '' },
      { name: 'Move Zeroes', link: 'https://leetcode.com/problems/move-zeroes/', resource: '' },
      { name: 'Plus One', link: 'https://leetcode.com/problems/plus-one/', resource: '' },
      { name: 'Contains Duplicate', link: 'https://leetcode.com/problems/contains-duplicate/', resource: '' },
      { name: 'Merge Sorted Array', link: 'https://leetcode.com/problems/merge-sorted-array/', resource: '' },
      { name: 'Minimum Depth of Binary Tree', link: 'https://leetcode.com/problems/minimum-depth-of-binary-tree/', resource: '' },
      { name: 'Symmetric Tree', link: 'https://leetcode.com/problems/symmetric-tree/', resource: '' },
      { name: 'Path Sum', link: 'https://leetcode.com/problems/path-sum/', resource: '' },
    ]
  },
  {
    level: 'Medium',
    questions: [
      { name: '3Sum', link: 'https://leetcode.com/problems/3sum/', resource: 'https://www.youtube.com/watch?v=onLoX6Nhvmg' },
      { name: 'Add Two Numbers', link: 'https://leetcode.com/problems/add-two-numbers/', resource: '' },
      { name: 'Longest Substring Without Repeating Characters', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', resource: 'https://www.youtube.com/watch?v=wiGpQwVHdE0' },
      { name: 'Group Anagrams', link: 'https://leetcode.com/problems/group-anagrams/', resource: 'https://www.youtube.com/watch?v=vzdNOK2oB2E' },
      { name: 'Word Search', link: 'https://leetcode.com/problems/word-search/', resource: '' },
      { name: 'Course Schedule', link: 'https://leetcode.com/problems/course-schedule/', resource: 'https://www.youtube.com/watch?v=EgI5nU9etnU' },
      { name: 'Product of Array Except Self', link: 'https://leetcode.com/problems/product-of-array-except-self/', resource: 'https://www.youtube.com/watch?v=bNvIQI2wAjk' },
      { name: 'Set Matrix Zeroes', link: 'https://leetcode.com/problems/set-matrix-zeroes/', resource: '' },
      { name: 'Spiral Matrix', link: 'https://leetcode.com/problems/spiral-matrix/', resource: '' },
      { name: 'Rotate Image', link: 'https://leetcode.com/problems/rotate-image/', resource: 'https://www.youtube.com/watch?v=SA867FvqHrM' },
      { name: 'Number of Islands', link: 'https://leetcode.com/problems/number-of-islands/', resource: '' },
      { name: 'Minimum Path Sum', link: 'https://leetcode.com/problems/minimum-path-sum/', resource: '' },
      { name: 'Unique Paths', link: 'https://leetcode.com/problems/unique-paths/', resource: '' },
      { name: 'Search in Rotated Sorted Array', link: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', resource: '' },
      { name: 'Combination Sum', link: 'https://leetcode.com/problems/combination-sum/', resource: '' },
      { name: 'Permutations', link: 'https://leetcode.com/problems/permutations/', resource: '' },
      { name: 'Subsets', link: 'https://leetcode.com/problems/subsets/', resource: '' },
      { name: 'Word Break', link: 'https://leetcode.com/problems/word-break/', resource: '' },
      { name: 'Linked List Cycle II', link: 'https://leetcode.com/problems/linked-list-cycle-ii/', resource: '' },
      { name: 'LRU Cache', link: 'https://leetcode.com/problems/lru-cache/', resource: '' },
    ]
  },
  {
    level: 'Hard',
    questions: [
      { name: 'Merge k Sorted Lists', link: 'https://leetcode.com/problems/merge-k-sorted-lists/', resource: 'https://www.youtube.com/watch?v=q5a5OiGbT6Q' },
      { name: 'Trapping Rain Water', link: 'https://leetcode.com/problems/trapping-rain-water/', resource: '' },
      { name: 'Regular Expression Matching', link: 'https://leetcode.com/problems/regular-expression-matching/', resource: '' },
      { name: 'Median of Two Sorted Arrays', link: 'https://leetcode.com/problems/median-of-two-sorted-arrays/', resource: 'https://www.youtube.com/watch?v=LPFhl65R7ww' },
      { name: 'Edit Distance', link: 'https://leetcode.com/problems/edit-distance/', resource: '' },
      { name: 'Word Ladder II', link: 'https://leetcode.com/problems/word-ladder-ii/', resource: '' },
      { name: 'Longest Valid Parentheses', link: 'https://leetcode.com/problems/longest-valid-parentheses/', resource: '' },
      { name: 'First Missing Positive', link: 'https://leetcode.com/problems/first-missing-positive/', resource: '' },
      { name: 'LFU Cache', link: 'https://leetcode.com/problems/lfu-cache/', resource: '' },
      { name: 'N-Queens', link: 'https://leetcode.com/problems/n-queens/', resource: '' },
      { name: 'Max Points on a Line', link: 'https://leetcode.com/problems/max-points-on-a-line/', resource: '' },
      { name: 'Palindrome Partitioning II', link: 'https://leetcode.com/problems/palindrome-partitioning-ii/', resource: '' },
      { name: 'Minimum Window Substring', link: 'https://leetcode.com/problems/minimum-window-substring/', resource: '' },
      { name: 'Word Search II', link: 'https://leetcode.com/problems/word-search-ii/', resource: '' },
      { name: 'Binary Tree Maximum Path Sum', link: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', resource: '' },
      { name: 'Dungeon Game', link: 'https://leetcode.com/problems/dungeon-game/', resource: '' },
      { name: 'Burst Balloons', link: 'https://leetcode.com/problems/burst-balloons/', resource: '' },
      { name: 'Sliding Window Maximum', link: 'https://leetcode.com/problems/sliding-window-maximum/', resource: '' },
      { name: 'Reverse Nodes in k-Group', link: 'https://leetcode.com/problems/reverse-nodes-in-k-group/', resource: '' },
      { name: 'Candy', link: 'https://leetcode.com/problems/candy/', resource: '' },
    ]
  }
];

const faangMang = [
  {
    level: 'Easy',
    questions: [
      { name: 'Best Time to Buy and Sell Stock', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', resource: 'https://www.youtube.com/watch?v=1pkOgXD63yU' },
      { name: 'Valid Anagram', link: 'https://leetcode.com/problems/valid-anagram/', resource: '' },
      { name: 'Intersection of Two Linked Lists', link: 'https://leetcode.com/problems/intersection-of-two-linked-lists/', resource: 'https://www.youtube.com/watch?v=ipbfg7b2_6w' },
      { name: 'Palindrome Number', link: 'https://leetcode.com/problems/palindrome-number/', resource: '' },
      { name: 'Remove Duplicates from Sorted Array', link: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/', resource: '' },
      { name: 'Maximum Subarray', link: 'https://leetcode.com/problems/maximum-subarray/', resource: 'https://www.youtube.com/watch?v=5WZl3MMT0Eg' },
      { name: 'Merge Two Sorted Lists', link: 'https://leetcode.com/problems/merge-two-sorted-lists/', resource: 'https://www.youtube.com/watch?v=XIdigk956u0' },
      { name: 'Valid Parentheses', link: 'https://leetcode.com/problems/valid-parentheses/', resource: 'https://www.youtube.com/watch?v=WTzjTskDFMg' },
      { name: 'Reverse String', link: 'https://leetcode.com/problems/reverse-string/', resource: '' },
      { name: 'Climbing Stairs', link: 'https://leetcode.com/problems/climbing-stairs/', resource: '' },
      { name: 'Single Number', link: 'https://leetcode.com/problems/single-number/', resource: '' },
      { name: 'Majority Element', link: 'https://leetcode.com/problems/majority-element/', resource: '' },
      { name: 'Move Zeroes', link: 'https://leetcode.com/problems/move-zeroes/', resource: '' },
      { name: 'Plus One', link: 'https://leetcode.com/problems/plus-one/', resource: '' },
      { name: 'Contains Duplicate', link: 'https://leetcode.com/problems/contains-duplicate/', resource: '' },
      { name: 'Merge Sorted Array', link: 'https://leetcode.com/problems/merge-sorted-array/', resource: '' },
      { name: 'Minimum Depth of Binary Tree', link: 'https://leetcode.com/problems/minimum-depth-of-binary-tree/', resource: '' },
      { name: 'Symmetric Tree', link: 'https://leetcode.com/problems/symmetric-tree/', resource: '' },
      { name: 'Path Sum', link: 'https://leetcode.com/problems/path-sum/', resource: '' },
    ]
  },
  {
    level: 'Medium',
    questions: [
      { name: 'Group Anagrams', link: 'https://leetcode.com/problems/group-anagrams/', resource: 'https://www.youtube.com/watch?v=vzdNOK2oB2E' },
      { name: 'Word Search', link: 'https://leetcode.com/problems/word-search/', resource: '' },
      { name: 'Course Schedule', link: 'https://leetcode.com/problems/course-schedule/', resource: 'https://www.youtube.com/watch?v=EgI5nU9etnU' },
      { name: 'Product of Array Except Self', link: 'https://leetcode.com/problems/product-of-array-except-self/', resource: 'https://www.youtube.com/watch?v=bNvIQI2wAjk' },
      { name: 'Set Matrix Zeroes', link: 'https://leetcode.com/problems/set-matrix-zeroes/', resource: '' },
      { name: 'Spiral Matrix', link: 'https://leetcode.com/problems/spiral-matrix/', resource: '' },
      { name: 'Rotate Image', link: 'https://leetcode.com/problems/rotate-image/', resource: 'https://www.youtube.com/watch?v=SA867FvqHrM' },
      { name: 'Longest Substring Without Repeating Characters', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', resource: 'https://www.youtube.com/watch?v=wiGpQwVHdE0' },
      { name: 'Add Two Numbers', link: 'https://leetcode.com/problems/add-two-numbers/', resource: '' },
      { name: '3Sum', link: 'https://leetcode.com/problems/3sum/', resource: 'https://www.youtube.com/watch?v=onLoX6Nhvmg' },
      { name: 'Number of Islands', link: 'https://leetcode.com/problems/number-of-islands/', resource: '' },
      { name: 'Minimum Path Sum', link: 'https://leetcode.com/problems/minimum-path-sum/', resource: '' },
      { name: 'Unique Paths', link: 'https://leetcode.com/problems/unique-paths/', resource: '' },
      { name: 'Search in Rotated Sorted Array', link: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', resource: '' },
      { name: 'Combination Sum', link: 'https://leetcode.com/problems/combination-sum/', resource: '' },
      { name: 'Permutations', link: 'https://leetcode.com/problems/permutations/', resource: '' },
      { name: 'Subsets', link: 'https://leetcode.com/problems/subsets/', resource: '' },
      { name: 'Word Break', link: 'https://leetcode.com/problems/word-break/', resource: '' },
      { name: 'Linked List Cycle II', link: 'https://leetcode.com/problems/linked-list-cycle-ii/', resource: '' },
      { name: 'LRU Cache', link: 'https://leetcode.com/problems/lru-cache/', resource: '' },
    ]
  },
  {
    level: 'Hard',
    questions: [
      { name: 'Median of Two Sorted Arrays', link: 'https://leetcode.com/problems/median-of-two-sorted-arrays/', resource: 'https://www.youtube.com/watch?v=LPFhl65R7ww' },
      { name: 'Edit Distance', link: 'https://leetcode.com/problems/edit-distance/', resource: '' },
      { name: 'Word Ladder II', link: 'https://leetcode.com/problems/word-ladder-ii/', resource: '' },
      { name: 'Merge k Sorted Lists', link: 'https://leetcode.com/problems/merge-k-sorted-lists/', resource: 'https://www.youtube.com/watch?v=q5a5OiGbT6Q' },
      { name: 'Trapping Rain Water', link: 'https://leetcode.com/problems/trapping-rain-water/', resource: '' },
      { name: 'Regular Expression Matching', link: 'https://leetcode.com/problems/regular-expression-matching/', resource: '' },
      { name: 'Longest Valid Parentheses', link: 'https://leetcode.com/problems/longest-valid-parentheses/', resource: '' },
      { name: 'First Missing Positive', link: 'https://leetcode.com/problems/first-missing-positive/', resource: '' },
      { name: 'LFU Cache', link: 'https://leetcode.com/problems/lfu-cache/', resource: '' },
      { name: 'N-Queens', link: 'https://leetcode.com/problems/n-queens/', resource: '' },
      { name: 'Max Points on a Line', link: 'https://leetcode.com/problems/max-points-on-a-line/', resource: '' },
      { name: 'Palindrome Partitioning II', link: 'https://leetcode.com/problems/palindrome-partitioning-ii/', resource: '' },
      { name: 'Minimum Window Substring', link: 'https://leetcode.com/problems/minimum-window-substring/', resource: '' },
      { name: 'Word Search II', link: 'https://leetcode.com/problems/word-search-ii/', resource: '' },
      { name: 'Binary Tree Maximum Path Sum', link: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', resource: '' },
      { name: 'Dungeon Game', link: 'https://leetcode.com/problems/dungeon-game/', resource: '' },
      { name: 'Burst Balloons', link: 'https://leetcode.com/problems/burst-balloons/', resource: '' },
      { name: 'Sliding Window Maximum', link: 'https://leetcode.com/problems/sliding-window-maximum/', resource: '' },
      { name: 'Reverse Nodes in k-Group', link: 'https://leetcode.com/problems/reverse-nodes-in-k-group/', resource: '' },
      { name: 'Candy', link: 'https://leetcode.com/problems/candy/', resource: '' },
    ]
  }
];

function renderSection(title, data) {
  const levelColors = {
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Hard: 'bg-red-100 text-red-800',
  };
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-6 border-b-2 border-blue-200 pb-2">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map((section) => (
          <div key={section.level} className="rounded-lg shadow-md bg-white p-4 border-t-4 mb-4 flex flex-col">
            <div className={`mb-3 px-2 py-1 rounded font-bold text-center text-sm ${levelColors[section.level] || 'bg-gray-100 text-gray-800'}`}>{section.level}</div>
            <ul className="flex-1 space-y-2">
              {section.questions.map((q) => (
                <li key={q.name} className="flex flex-col">
                  <a href={q.link} target="_blank" rel="noopener noreferrer" className="text-blue-700 font-medium hover:underline">{q.name}</a>
                  {q.resource
                    ? <a href={q.resource} target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline">Resource</a>
                    : <span className="text-xs text-gray-400">Resource not available</span>
                  }
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

const tabList = [
  { label: 'DSA', value: 'dsa' },
  { label: 'Full Stack', value: 'fullstack' },
  { label: 'DevOps', value: 'devops' },
];

export default function Roadmap() {
  const [tab, setTab] = useState('dsa');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold mb-2 text-center text-blue-800 drop-shadow">Roadmap & Sheets</h1>
      <div className="text-center mb-8">
        <span className="inline-block text-xs text-gray-500 bg-gray-100 rounded px-2 py-1 mt-1">Version 1.1</span>
      </div>
      <div className="flex space-x-4 mb-10 justify-center">
        {tabList.map((t) => (
          <button
            key={t.value}
            className={`px-6 py-2 rounded-t-lg font-semibold border-b-4 transition-colors duration-200 text-lg shadow-sm ${tab === t.value ? 'border-blue-600 text-blue-800 bg-blue-100' : 'border-transparent text-gray-600 bg-gray-100 hover:bg-blue-50'}`}
            onClick={() => setTab(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'dsa' && (
        <>
          {renderSection('Service-Based Companies', serviceBased)}
          {renderSection('FAANG / MANG', faangMang)}
          <p className="mt-8 text-sm text-gray-500 text-center">* Only a sample of questions is shown. Expand with more problems as needed.</p>
        </>
      )}

      {tab === 'fullstack' && (
        <div className="p-6 bg-gray-50 rounded-lg shadow text-gray-800 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Full Stack Developer Roadmap</h2>
          <ol className="list-decimal ml-6 mb-6 text-base">
            <li>Learn HTML, CSS, JavaScript (ES6+)</li>
            <li>Master a Frontend Framework (React, Angular, Vue)</li>
            <li>Understand Version Control (Git & GitHub)</li>
            <li>Learn Backend (Node.js/Express, Django, etc.)</li>
            <li>Work with Databases (MongoDB, MySQL, PostgreSQL)</li>
            <li>Build and Deploy Full Stack Projects</li>
            <li>Explore DevOps basics (CI/CD, Docker, Cloud)</li>
          </ol>

          <h3 className="text-lg font-semibold mb-2 mt-6 text-green-700">Curated YouTube Playlists</h3>
          <ul className="list-disc ml-6 mb-6">
            <li><a href="https://youtube.com/playlist?list=PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w&si=UpLcg_B98JEDNtio" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">CodeWithHarry - MERN Stack</a></li>
            <li><a href="https://www.youtube.com/playlist?list=PLZyvi_9gamL-EE3zQJbU5N5o6bCe0b2rM" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">freeCodeCamp - Full Stack</a></li>
            <li><a href="https://www.youtube.com/playlist?list=PLillGF-RfqbbiTGgA77tGO426V3hRF9iE" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Traversy Media - Node.js/Express</a></li>
            <li><a href="https://www.youtube.com/playlist?list=PLWKjhJtqVAbkFiqHnNaxpOPhh9tSWMXIF" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Academind - React.js</a></li>
            <li><a href="https://www.youtube.com/playlist?list=PL4cUxeGkcC9jLYyp2Aoh6hcWuxFDX6PBJ" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">The Net Ninja - MongoDB</a></li>
          </ul>

          <h3 className="text-lg font-semibold mb-2 mt-6 text-purple-700">Project Ideas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded shadow p-4">
              <div className="font-bold text-blue-800 mb-1">1. Personal Portfolio Website</div>
              <div className="text-sm mb-1">Showcase your skills, projects, and resume.</div>
              <a href="https://www.youtube.com/watch?v=gYzHS-n2gqU" target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline">Resource</a>
            </div>
            <div className="bg-white rounded shadow p-4">
              <div className="font-bold text-blue-800 mb-1">2. Blog Platform (MERN)</div>
              <div className="text-sm mb-1">Users can register, write, edit, and comment on posts.</div>
              <a href="https://www.youtube.com/watch?v=7CqJlxBYj-M" target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline">Resource</a>
            </div>
            <div className="bg-white rounded shadow p-4">
              <div className="font-bold text-blue-800 mb-1">3. E-commerce Store</div>
              <div className="text-sm mb-1">Product listings, cart, checkout, and admin dashboard.</div>
              <a href="https://www.youtube.com/watch?v=4mOkFXyxfsU" target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline">Resource</a>
            </div>
            <div className="bg-white rounded shadow p-4">
              <div className="font-bold text-blue-800 mb-1">4. Chat Application (Socket.io)</div>
              <div className="text-sm mb-1">Real-time messaging with rooms and authentication.</div>
              <a href="https://www.youtube.com/watch?v=ZKEqqIO7n-k" target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline">Resource</a>
            </div>
            <div className="bg-white rounded shadow p-4">
              <div className="font-bold text-blue-800 mb-1">5. Task Manager (Trello Clone)</div>
              <div className="text-sm mb-1">Boards, lists, cards, and drag-and-drop functionality.</div>
              <a href="https://www.youtube.com/watch?v=4w3XtwF6Y5s" target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline">Resource</a>
            </div>
            <div className="bg-white rounded shadow p-4">
              <div className="font-bold text-blue-800 mb-1">6. Social Media App</div>
              <div className="text-sm mb-1">User profiles, posts, likes, and follows.</div>
              <a href="https://www.youtube.com/watch?v=ldGl6L4Vktk" target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline">Resource</a>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-2 mt-8 text-orange-700">Company/Industry-Expected Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded shadow p-4">
              <div className="font-bold text-orange-800 mb-1">1. HR Management System</div>
              <div className="text-sm mb-1">Employee onboarding, leave management, payroll, and performance tracking.</div>
              <a href="https://www.youtube.com/watch?v=Qf66Z3C1t7E" target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline">Resource</a>
            </div>
            <div className="bg-white rounded shadow p-4">
              <div className="font-bold text-orange-800 mb-1">2. Inventory & Order Management</div>
              <div className="text-sm mb-1">Track inventory, manage suppliers, and process orders.</div>
              <a href="https://www.youtube.com/watch?v=1K5hPBqTn74" target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline">Resource</a>
            </div>
            <div className="bg-white rounded shadow p-4">
              <div className="font-bold text-orange-800 mb-1">3. Learning Management System (LMS)</div>
              <div className="text-sm mb-1">Course creation, student enrollment, quizzes, and progress tracking.</div>
              <a href="https://www.youtube.com/watch?v=7CqJlxBYj-M" target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline">Resource</a>
            </div>
            <div className="bg-white rounded shadow p-4">
              <div className="font-bold text-orange-800 mb-1">4. CRM Platform</div>
              <div className="text-sm mb-1">Customer management, sales pipeline, and analytics dashboard.</div>
              <a href="https://www.youtube.com/watch?v=4mOkFXyxfsU" target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline">Resource</a>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-2 mt-8 text-pink-700">Interview Questions for Full Stack Projects</h3>
          <ul className="list-disc ml-6 mb-2">
            <li className="mb-2">How would you design a scalable authentication system? <a href="https://www.youtube.com/watch?v=2jqok-WgelI" target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline ml-2">Resource</a></li>
            <li className="mb-2">Explain the MVC architecture in web development. <a href="https://www.geeksforgeeks.org/mvc-design-pattern/" target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline ml-2">Resource</a></li>
            <li className="mb-2">How do you secure REST APIs? <a href="https://www.youtube.com/watch?v=TNQsmPf24go" target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline ml-2">Resource</a></li>
            <li className="mb-2">What is server-side rendering and why is it important? <a href="https://www.youtube.com/watch?v=BsDoLVMnmZs" target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline ml-2">Resource</a></li>
            <li className="mb-2">How would you implement real-time features in a web app? <a href="https://www.youtube.com/watch?v=ZKEqqIO7n-k" target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline ml-2">Resource</a></li>
            <li className="mb-2">Describe a project where you used both frontend and backend technologies. <span className="text-xs text-gray-500 ml-2">Resource not available</span></li>
          </ul>
        </div>
      )}

      {tab === 'devops' && (
        <div className="p-6 bg-gray-50 rounded-lg shadow text-gray-800 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">DevOps Roadmap</h2>
          <ol className="list-decimal ml-6 mb-6 text-base">
            <li>Understand Linux fundamentals & basic scripting</li>
            <li>Learn Version Control (Git & GitHub)</li>
            <li>Master CI/CD concepts and tools (Jenkins, GitHub Actions)</li>
            <li>Get hands-on with Containers (Docker)</li>
            <li>Orchestration with Kubernetes</li>
            <li>Cloud Platforms (AWS, Azure, GCP)</li>
            <li>Infrastructure as Code (Terraform, Ansible)</li>
            <li>Monitoring & Logging (Prometheus, Grafana, ELK)</li>
            <li>Security & Best Practices</li>
          </ol>

          <h3 className="text-lg font-semibold mb-2 mt-6 text-green-700">Curated YouTube Playlists</h3>
          <ul className="list-disc ml-6 mb-6">
            <li><a href="https://www.youtube.com/playlist?list=PL9ooVrP1hQOHUKuqGuiWLQoJ-LD25KxI5" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">TechWorld with Nana - DevOps Bootcamp</a></li>
            <li><a href="https://www.youtube.com/playlist?list=PLy7NrYWoggjziYQIDorlXjTvvwweTYoNC" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">freeCodeCamp - DevOps</a></li>
            <li><a href="https://www.youtube.com/playlist?list=PLy7NrYWoggjzA7i5dYdOa1g0b0lq5Q8lK" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">freeCodeCamp - Docker</a></li>
            <li><a href="https://www.youtube.com/playlist?list=PLy7NrYWoggjzA7i5dYdOa1g0b0lq5Q8lK" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">freeCodeCamp - Kubernetes</a></li>
            <li><a href="https://www.youtube.com/playlist?list=PLy7NrYWoggjzA7i5dYdOa1g0b0lq5Q8lK" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">freeCodeCamp - AWS</a></li>
          </ul>

          <h3 className="text-lg font-semibold mb-2 mt-6 text-purple-700">Company/Industry-Expected Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded shadow p-4">
              <div className="font-bold text-blue-800 mb-1">1. CI/CD Pipeline for Microservices</div>
              <div className="text-sm mb-1">Automate build, test, and deployment for a microservices app using Jenkins or GitHub Actions.</div>
              <a href="https://www.youtube.com/watch?v=1hHMwLxN6EM" target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline">Resource</a>
            </div>
            <div className="bg-white rounded shadow p-4">
              <div className="font-bold text-blue-800 mb-1">2. Dockerized Application Deployment</div>
              <div className="text-sm mb-1">Containerize and deploy a web app using Docker and Docker Compose.</div>
              <a href="https://www.youtube.com/watch?v=9zUHg7xjIqQ" target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline">Resource</a>
            </div>
            <div className="bg-white rounded shadow p-4">
              <div className="font-bold text-blue-800 mb-1">3. Kubernetes Cluster Setup</div>
              <div className="text-sm mb-1">Deploy and manage a scalable app on Kubernetes (minikube or cloud).</div>
              <a href="https://www.youtube.com/watch?v=X48VuDVv0do" target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline">Resource</a>
            </div>
            <div className="bg-white rounded shadow p-4">
              <div className="font-bold text-blue-800 mb-1">4. Infrastructure as Code (IaC) Project</div>
              <div className="text-sm mb-1">Provision cloud resources using Terraform or Ansible.</div>
              <a href="https://www.youtube.com/watch?v=SLB_c_ayRMo" target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline">Resource</a>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-2 mt-8 text-pink-700">Interview Questions for DevOps Projects</h3>
          <ul className="list-disc ml-6 mb-2">
            <li className="mb-2">What is Infrastructure as Code and why is it important? <a href="https://www.youtube.com/watch?v=Ia-UEYYR44s" target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline ml-2">Resource</a></li>
            <li className="mb-2">How do you set up a CI/CD pipeline? <a href="https://www.youtube.com/watch?v=1hHMwLxN6EM" target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline ml-2">Resource</a></li>
            <li className="mb-2">Explain the difference between Docker and Kubernetes. <a href="https://www.youtube.com/watch?v=X48VuDVv0do" target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline ml-2">Resource</a></li>
            <li className="mb-2">How do you monitor and log applications in production? <a href="https://www.youtube.com/watch?v=2Zf1myb6jT4" target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline ml-2">Resource</a></li>
            <li className="mb-2">What are some best practices for securing cloud infrastructure? <a href="https://www.youtube.com/watch?v=2z0WgxlZVqM" target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline ml-2">Resource</a></li>
            <li className="mb-2">Describe a DevOps project you worked on. <span className="text-xs text-gray-500 ml-2">Resource not available</span></li>
          </ul>
        </div>
      )}
    </div>
  );
}
