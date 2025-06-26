import React, { useState } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [latency, setLatency] = useState(null);
  const [isLoadingLatency, setIsLoadingLatency] = useState(false);

  // Function to call API and get results
  const classifyText = async () => {
    setResult(null);

    try {
      const response = await fetch("http://localhost:8000/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      setResult(data.results);
    } catch (err) {
      console.error("Error:", err);
      setResult([["Error", 1]]);
    }
  };

  // Function to test latency
  const testLatency = async (n = 100) => {
    setIsLoadingLatency(true);
    const timings = [];

    for (let i = 0; i < n; i++) {
      const start = performance.now();

      try {
        await fetch("http://localhost:8000/moderate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: "Test message" }),
        });
      } catch {
        console.warn("Request failed");
      }

      timings.push(performance.now() - start);
    }

    const avg = timings.reduce((a, b) => a + b, 0) / timings.length;
    const max = Math.max(...timings);
    const min = Math.min(...timings);

    setLatency({
      avg: avg.toFixed(2),
      max: max.toFixed(2),
      min: min.toFixed(2),
    });
    setIsLoadingLatency(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Content Moderation
          </h1>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Input</h2>
            <textarea
              className="w-full h-40 border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter text to classify..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex gap-3 mt-4">
              <button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                onClick={classifyText}
                disabled={!text.trim()}
              >
                Submit
              </button>

              <button
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => testLatency(100)}
                disabled={isLoadingLatency}
              >
                {isLoadingLatency ? "Testing..." : "Test Latency"}
              </button>
            </div>

            {/* Latency Metrics */}
            {latency && (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4">
                  Latency Metrics
                </h2>
                <div className="grid gap-4">
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {latency.avg}ms
                    </div>
                    <div className="text-gray-600 text-sm">Average</div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {latency.max}ms
                    </div>
                    <div className="text-gray-600 text-sm">Maximum</div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {latency.min}ms
                    </div>
                    <div className="text-gray-600 text-sm">Minimum</div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Output</h2>

            {result ? (
              <div className="space-y-1">
                {result.map((item, idx) => {
                  const [label, probability] = item;
                  const percentage = (probability * 100).toFixed(2);

                  return (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">
                          {label}
                        </span>
                        <span className="text-gray-600">{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">No results yet</div>
                <p className="text-gray-500 text-sm">
                  Enter text and click "Submit" to see results
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
