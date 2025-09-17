
import React, { useState } from "react";
import { runCodeWithJudge0 } from "../services/judge0Service";

export default function Coding() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const outputRef = React.useRef(null);
  const [isRunning, setIsRunning] = useState(false);

  // Map UI language to Judge0 language_id
  const languageMap = {
    python: 71, // Python 3
    cpp: 54,    // C++ (GCC 9.2.0)
    java: 62,   // Java (OpenJDK 13.0.1)
    javascript: 63 // JavaScript (Node.js 12.14.0)
  };

  // Run code using Judge0 API
  const runCode = async () => {
    setIsRunning(true);
    setOutput("");
    try {
      const res = await runCodeWithJudge0({
        source_code: code,
        language_id: languageMap[language],
        stdin: ""
      });
      if (res.stderr) {
        setOutput(res.stderr);
      } else if (res.compile_output) {
        setOutput(res.compile_output);
      } else {
        setOutput(res.stdout || "[No output]");
      }
    } catch (err) {
      setOutput("Error: " + err.message);
    }
    setIsRunning(false);
  };

  // Auto-scroll output to bottom when it changes
  React.useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // Copy output to clipboard
  const copyOutput = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Online Compiler</h1>
          <div className="mb-4 flex items-center gap-4">
            <label className="font-medium">Language:</label>
            <select
              className="border rounded px-2 py-1"
              value={language}
              onChange={e => setLanguage(e.target.value)}
            >
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
            </select>
          </div>
          <textarea
            className="w-full h-64 font-mono border rounded p-3 mb-4 bg-gray-50 shadow"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Write your code here..."
          />
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition mb-6 disabled:opacity-50 w-full"
            onClick={runCode}
            disabled={isRunning}
          >
            {isRunning ? "Running..." : "Run Code"}
          </button>
          <div className="relative mt-2">
            <div
              ref={outputRef}
              className="bg-black text-green-400 font-mono rounded p-4 min-h-[120px] max-h-64 overflow-y-auto border border-gray-800 shadow-inner transition-all"
              style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
            >
              {output ? output : <span className="text-gray-500">Output will appear here after you run your code.</span>}
            </div>
            <button
              className="absolute top-2 right-2 bg-gray-700 text-xs text-white px-2 py-1 rounded hover:bg-gray-600 focus:outline-none"
              onClick={copyOutput}
              title="Copy output"
              disabled={!output}
              style={{ opacity: output ? 1 : 0.5 }}
            >
              Copy
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
