export function sampleQuestions() {
  // 6 questions: 2 easy, 2 medium, 2 hard
  return [
    { level: 'Easy', text: 'What is JSX and why do we use it in React?', time:20, keywords:['jsx','react'] },
    { level: 'Easy', text: 'Explain the difference between let, const and var in JavaScript.', time:20, keywords:['let','const','var','scope'] },
    { level: 'Medium', text: 'Describe how you would lift state up in React. Give an example.', time:60, keywords:['props','state','lifting','parent'] },
    { level: 'Medium', text: 'Explain event delegation in JavaScript and why it is useful.', time:60, keywords:['event','delegation','bubbling'] },
    { level: 'Hard', text: 'How does the event loop work in Node.js? Explain with phases.', time:120, keywords:['event loop','libuv','callback','microtask'] },
    { level: 'Hard', text: 'Design a simple REST API for a todo app and explain authentication choices.', time:120, keywords:['rest','api','authentication','jwt','tokens'] },
  ]
}
