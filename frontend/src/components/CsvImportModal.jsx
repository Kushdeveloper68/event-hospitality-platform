import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

/**
 * Lightweight, dependency-free CSV parser.
 * Handles quoted fields (with commas/newlines inside quotes) and \r\n line endings.
 */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        row.push(field);
        field = "";
      } else if (char === "\n" || char === "\r") {
        if (char === "\r" && next === "\n") i++;
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else {
        field += char;
      }
    }
  }
  // last field/row (file may not end with a newline)
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

/**
 * Reusable CSV bulk-import modal.
 *
 * @param {string} title - e.g. "Import Guests"
 * @param {Array<{key:string,label:string,required?:boolean}>} columns - expected CSV columns
 * @param {Array<Object>} sampleRows - example rows used to build the downloadable template
 * @param {(eventId:string, rows:Array<Object>) => Promise<Object>} importFn - API call to run
 * @param {string} eventId
 * @param {() => void} onClose
 * @param {() => void} onSuccess - called after a successful import (use it to refetch the list)
 */
function CsvImportModal({ title, columns, sampleRows, importFn, eventId, onClose, onSuccess }) {
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState([]);
  const [parseError, setParseError] = useState("");
  const [step, setStep] = useState("select"); // select | preview | importing | result
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const requiredKeys = columns.filter((c) => c.required).map((c) => c.key);

  const handleFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    setParseError("");

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const table = parseCsv(text);
        if (table.length < 2) {
          setParseError("This file has no data rows (only a header, or it's empty).");
          return;
        }
        const header = table[0].map((h) => h.trim());
        const missing = requiredKeys.filter(
          (key) => !header.some((h) => h.toLowerCase() === key.toLowerCase())
        );
        if (missing.length > 0) {
          setParseError(
            `Missing required column${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}. Check the format guide below.`
          );
          return;
        }

        const dataRows = table.slice(1).map((r) => {
          const obj = {};
          header.forEach((h, idx) => {
            const matchedCol = columns.find((c) => c.key.toLowerCase() === h.toLowerCase());
            if (matchedCol) obj[matchedCol.key] = (r[idx] || "").trim();
          });
          return obj;
        });

        setRows(dataRows);
        setStep("preview");
      } catch (err) {
        setParseError("Couldn't read this file. Make sure it's a plain .csv file.");
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadTemplate = () => {
    const header = columns.map((c) => c.key).join(",");
    const sample = sampleRows
      .map((row) => columns.map((c) => `"${String(row[c.key] ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const csvContent = `${header}\n${sample}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eventcure-${title.toLowerCase().replace(/\s+/g, "-")}-template.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    setStep("importing");
    try {
      const res = await importFn(eventId, rows);
      setResult(res);
      setStep("result");
      if (res.success && res.createdCount > 0) {
        onSuccess?.();
      }
    } catch (err) {
      setResult({ success: false, message: err.message || "Import failed" });
      setStep("result");
    }
  };

  const reset = () => {
    setFileName("");
    setRows([]);
    setParseError("");
    setResult(null);
    setStep("select");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-slate-900 dark:text-white text-xl font-bold">{title}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Upload a CSV file to add many at once.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === "select" && (
            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFile(e.dataTransfer.files?.[0]);
                }}
              >
                <span className="material-symbols-outlined text-4xl text-slate-400">upload_file</span>
                <p className="text-slate-600 dark:text-slate-300 font-semibold mt-2">
                  Click to choose a CSV file, or drag it here
                </p>
                <p className="text-slate-400 text-xs mt-1">.csv only</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </div>

              {parseError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg text-red-700 dark:text-red-300 text-sm">
                  <span className="material-symbols-outlined text-lg">error</span>
                  <span>{parseError}</span>
                </div>
              )}

              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  Not sure about the format?{" "}
                  <Link to="/import-guide" target="_blank" className="text-primary font-semibold hover:underline">
                    View the import guide
                  </Link>
                </div>
                <button
                  onClick={handleDownloadTemplate}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  Sample CSV
                </button>
              </div>
            </div>
          )}

          {step === "preview" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <span className="material-symbols-outlined text-primary">description</span>
                <span className="font-semibold">{fileName}</span>
                <span className="text-slate-400">· {rows.length} row{rows.length !== 1 ? "s" : ""} found</span>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-64">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0">
                      <tr>
                        {columns.map((c) => (
                          <th key={c.key} className="px-3 py-2 font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                            {c.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {rows.slice(0, 5).map((r, i) => (
                        <tr key={i}>
                          {columns.map((c) => (
                            <td key={c.key} className="px-3 py-2 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                              {r[c.key] || <span className="text-slate-300">—</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {rows.length > 5 && (
                  <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
                    + {rows.length - 5} more row{rows.length - 5 !== 1 ? "s" : ""}
                  </div>
                )}
              </div>

              <button onClick={reset} className="text-primary text-sm font-semibold hover:underline">
                ← Choose a different file
              </button>
            </div>
          )}

          {step === "importing" && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Importing {rows.length} rows…</p>
            </div>
          )}

          {step === "result" && result && (
            <div className="space-y-4">
              {result.success ? (
                <>
                  <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 rounded-lg">
                    <span className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
                    <div>
                      <p className="text-green-800 dark:text-green-300 font-bold">
                        {result.createdCount} of {rows.length} imported successfully
                      </p>
                      {result.failedCount > 0 && (
                        <p className="text-green-700 dark:text-green-400 text-sm mt-0.5">
                          {result.failedCount} row{result.failedCount !== 1 ? "s" : ""} couldn't be imported — see below.
                        </p>
                      )}
                    </div>
                  </div>

                  {result.failed?.length > 0 && (
                    <div className="border border-amber-200 dark:border-amber-900/50 rounded-lg overflow-hidden">
                      <div className="bg-amber-50 dark:bg-amber-900/20 px-3 py-2 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide">
                        Rows that failed
                      </div>
                      <div className="max-h-40 overflow-y-auto divide-y divide-amber-100 dark:divide-amber-900/30">
                        {result.failed.map((f, i) => (
                          <div key={i} className="px-3 py-2 text-xs text-slate-600 dark:text-slate-300 flex gap-2">
                            <span className="font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                              Row {f.row}
                            </span>
                            <span>{f.reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg">
                  <span className="material-symbols-outlined text-red-600 dark:text-red-400">error</span>
                  <p className="text-red-700 dark:text-red-300 text-sm">{result.message || "Import failed"}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/30 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
          {step === "preview" && (
            <>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
              >
                Import {rows.length} row{rows.length !== 1 ? "s" : ""}
              </button>
            </>
          )}
          {step === "result" && (
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
            >
              Done
            </button>
          )}
          {step === "select" && (
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CsvImportModal;
