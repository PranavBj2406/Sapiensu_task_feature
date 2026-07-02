"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Globe,
  BellRing,
  Zap,
  CloudUpload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/* ─────────────── PDF Flow Animation ─────────────── */
function PdfFlowAnimation() {
  const GREEN       = "#2d6a4f";
  const GREEN_MID   = "#40916c";
  const GREEN_LIGHT = "#74c69d";
  const CREAM       = "#f5f5dc";
  const CREAM_DARK  = "#e8e8c8";
  const INK         = "#1b3a2d";

  const leftPaths = [
    "M 72,78  C 175,78  240,178 302,178",
    "M 72,178 C 185,178 240,178 302,178",
    "M 72,278 C 175,278 240,178 302,178",
  ];
  const rightPaths = [
    "M 342,178 C 404,178 468,78  572,78",
    "M 342,178 C 445,178 468,178 572,178",
    "M 342,178 C 404,178 468,278 572,278",
  ];

  const pdfDelays  = ["0s", "0.9s", "1.8s"];
  const dataDelays = ["2.6s", "3.3s", "4.0s"];
  const dur        = "2.3s";

  return (
    <svg
      viewBox="0 0 644 356"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-2xl mx-auto"
      style={{ overflow: "visible" }}
    >
      <defs>
        {leftPaths.map((d, i)  => <path key={`lp${i}`}  id={`lpath${i}`}  d={d} />)}
        {rightPaths.map((d, i) => <path key={`rp${i}`}  id={`rpath${i}`}  d={d} />)}

        <radialGradient id="centerGlowLight" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={GREEN_MID}   stopOpacity="0.18" />
          <stop offset="100%" stopColor={GREEN_MID}   stopOpacity="0"    />
        </radialGradient>

        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={GREEN} floodOpacity="0.18" />
        </filter>

        <filter id="dotGlow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Subtle radial glow behind center */}
      <circle cx="322" cy="178" r="100" fill="url(#centerGlowLight)" />

      {/* Curved dashed path lines */}
      {leftPaths.map((d, i) => (
        <path key={`ll${i}`} d={d} fill="none"
          stroke={GREEN_MID} strokeWidth="1.4"
          strokeDasharray="5 5" opacity="0.45" />
      ))}
      {rightPaths.map((d, i) => (
        <path key={`rl${i}`} d={d} fill="none"
          stroke={GREEN_MID} strokeWidth="1.4"
          strokeDasharray="5 5" opacity="0.45" />
      ))}

      {/* Pulsing rings from center */}
      {[1, 2, 3].map((n) => (
        <circle key={`ring${n}`} cx="322" cy="178" r={38 + n * 14}
          fill="none" stroke={GREEN_MID} strokeWidth="1" opacity="0">
          <animate attributeName="r"
            values={`${38 + n * 10};${62 + n * 18}`}
            dur="2.6s" begin={`${(n - 1) * 0.87}s`} repeatCount="indefinite" />
          <animate attributeName="opacity"
            values="0.45;0"
            dur="2.6s" begin={`${(n - 1) * 0.87}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* ── LEFT: PDF document cards ── */}
      {[78, 178, 278].map((cy, i) => (
        <g key={`pdf${i}`}>
          <rect x="20" y={cy - 30} width="52" height="60" rx="6"
            fill={CREAM} stroke={GREEN_MID} strokeWidth="1.4"
            filter="url(#softShadow)" />
          {/* Folded corner */}
          <path d={`M ${20 + 37},${cy - 30} L ${72},${cy - 30 + 15} L ${20 + 37},${cy - 30 + 15} Z`}
            fill={CREAM_DARK} opacity="0.7" />
          <line x1="38" y1={cy - 30} x2="72" y2={cy - 30 + 15} stroke={GREEN_MID} strokeWidth="0.8" opacity="0.4" />
          {/* Text rows */}
          <rect x="28" y={cy - 10} width="34" height="2.5" rx="1.2" fill={GREEN} opacity="0.55" />
          <rect x="28" y={cy - 4}  width="28" height="2.5" rx="1.2" fill={GREEN} opacity="0.38" />
          <rect x="28" y={cy + 2}  width="30" height="2.5" rx="1.2" fill={GREEN} opacity="0.38" />
          <rect x="28" y={cy + 8}  width="20" height="2.5" rx="1.2" fill={GREEN} opacity="0.25" />
          {/* PDF label */}
          <text x="46" y={cy + 23} textAnchor="middle" fontSize="7.5"
            fill={GREEN} fontWeight="700" fontFamily="DM Sans, sans-serif"
            opacity="0.85">PDF</text>

          {/* Traveling dot + trail */}
          <circle r="5.5" fill={GREEN} filter="url(#dotGlow)">
            <animateMotion dur={dur} begin={pdfDelays[i]} repeatCount="indefinite">
              <mpath href={`#lpath${i}`} />
            </animateMotion>
            <animate attributeName="opacity" values="0;1;1;0.2;0"
              dur={dur} begin={pdfDelays[i]} repeatCount="indefinite" />
          </circle>
          <circle r="3" fill={GREEN_LIGHT} opacity="0.7">
            <animateMotion dur={dur} begin={`calc(${pdfDelays[i]} + 0.18s)`} repeatCount="indefinite">
              <mpath href={`#lpath${i}`} />
            </animateMotion>
            <animate attributeName="opacity" values="0;0.7;0.7;0;0"
              dur={dur} begin={`calc(${pdfDelays[i]} + 0.18s)`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      {/* ── CENTER: Processing box ── */}
      <rect x="302" y="146" width="80" height="64" rx="10"
        fill={CREAM} stroke={GREEN} strokeWidth="1.8"
        filter="url(#softShadow)" />
      {/* Spinner */}
      <circle cx="322" cy="167" r="9" fill="none"
        stroke={GREEN_MID} strokeWidth="2.2"
        strokeDasharray="34 22" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate"
          values="0 322 167;360 322 167" dur="1.4s" repeatCount="indefinite" />
      </circle>
      {/* Label rows */}
      <rect x="312" y="182" width="42" height="2.5" rx="1.2" fill={GREEN} opacity="0.55" />
      <rect x="317" y="189" width="32" height="2.5" rx="1.2" fill={GREEN} opacity="0.38" />
      <text x="342" y="142" textAnchor="middle" fontSize="8" fill={GREEN}
        fontWeight="700" fontFamily="DM Sans, sans-serif" letterSpacing="0.06em">AI ENGINE</text>

      {/* ── RIGHT: Traveling dots outward ── */}
      {[0, 1, 2].map((i) => (
        <g key={`rdot${i}`}>
          <circle r="5.5" fill={GREEN} filter="url(#dotGlow)">
            <animateMotion dur={dur} begin={dataDelays[i]} repeatCount="indefinite">
              <mpath href={`#rpath${i}`} />
            </animateMotion>
            <animate attributeName="opacity" values="0;1;1;0.2;0"
              dur={dur} begin={dataDelays[i]} repeatCount="indefinite" />
          </circle>
          <circle r="3" fill={GREEN_LIGHT} opacity="0.7">
            <animateMotion dur={dur} begin={`calc(${dataDelays[i]} + 0.18s)`} repeatCount="indefinite">
              <mpath href={`#rpath${i}`} />
            </animateMotion>
            <animate attributeName="opacity" values="0;0.7;0.7;0;0"
              dur={dur} begin={`calc(${dataDelays[i]} + 0.18s)`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      {/* ── RIGHT: Structured output cards ── */}
      {[
        { cy: 78,  label: "SEC Rule 10b-5", tag: "HIGH",  tagColor: "#1b4332" },
        { cy: 178, label: "GDPR Art. 17",   tag: "MED",   tagColor: "#2d6a4f" },
        { cy: 278, label: "Basel III §422", tag: "LOW",   tagColor: "#40916c" },
      ].map((item, i) => (
        <g key={`out${i}`}>
          <rect x="572" y={item.cy - 30} width="62" height="60" rx="6"
            fill={CREAM} stroke={GREEN_MID} strokeWidth="1.4"
            filter="url(#softShadow)" />
          {/* Tag pill */}
          <rect x="578" y={item.cy - 24} width="26" height="11" rx="4"
            fill={item.tagColor} />
          <text x="591" y={item.cy - 15} textAnchor="middle" fontSize="6.5"
            fill={CREAM} fontWeight="700" fontFamily="DM Sans, sans-serif">{item.tag}</text>
          {/* Data rows */}
          <rect x="578" y={item.cy - 8}  width="46" height="2.5" rx="1.2" fill={GREEN} opacity="0.6" />
          <rect x="578" y={item.cy - 1}  width="38" height="2.5" rx="1.2" fill={GREEN} opacity="0.42" />
          <rect x="578" y={item.cy + 6}  width="42" height="2.5" rx="1.2" fill={GREEN} opacity="0.42" />
          <rect x="578" y={item.cy + 13} width="30" height="2.5" rx="1.2" fill={GREEN} opacity="0.28" />
        </g>
      ))}

      {/* ── Bottom labels ── */}
      <text x="46"  y="328" textAnchor="middle" fontSize="9.5" fill={INK}
        opacity="0.45" fontFamily="DM Sans, sans-serif" fontWeight="500">RAW PDFs</text>
      <text x="322" y="328" textAnchor="middle" fontSize="9.5" fill={GREEN}
        opacity="0.75" fontFamily="DM Sans, sans-serif" fontWeight="600">PROCESSING</text>
      <text x="603" y="328" textAnchor="middle" fontSize="9.5" fill={INK}
        opacity="0.45" fontFamily="DM Sans, sans-serif" fontWeight="500">STRUCTURED</text>
    </svg>
  );
}

/* ─────────────── Main Page ─────────────── */
export default function Home() {
  const [isDragging, setIsDragging]   = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError]  = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver  = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true);  };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };

  const validateAndSetFile = (file: File) => {
    if (!file.name.endsWith(".zip")) {
      setUploadError("Only .zip archives are supported.");
      setUploadedFile(null);
      return;
    }
    if (file.size > 500 * 1024 * 1024) {
      setUploadError("File exceeds the 500MB limit.");
      setUploadedFile(null);
      return;
    }
    setUploadError(null);
    setUploadedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
  };

  return (
    <div
      className="min-h-dvh flex flex-col text-foreground selection:bg-primary/20"
      style={{ backgroundColor: "#f5f5dc", fontFamily: "'DM Sans', sans-serif" }}
    >
      <main className="flex-1 flex flex-col">

        {/* ── SECTION 1: HERO ── */}
        <section
          className="relative px-8 lg:px-16 flex flex-col items-center justify-center overflow-hidden"
          style={{
            minHeight: "100dvh",
            paddingTop: "6rem",
            paddingBottom: "6rem",
            borderBottom: "1px solid rgba(45,106,79,0.15)",
          }}
        >
          {/* Semi-circular green background — canopy arcing down from top */}
          <div
            className="pointer-events-none absolute"
            style={{
              width: "140%",
              paddingBottom: "70%",
              borderRadius: "50%",
              top: "-38%",
              left: "50%",
              transform: "translateX(-50%)",
              background:
                "radial-gradient(ellipse at center bottom, #2d6a4f 0%, #1b4332 45%, transparent 80%)",
              opacity: 0.14,
            }}
          />
          {/* Soft inner glow — bottom of canopy */}
          <div
            className="pointer-events-none absolute"
            style={{
              width: "80%",
              paddingBottom: "40%",
              borderRadius: "50%",
              top: "-18%",
              left: "50%",
              transform: "translateX(-50%)",
              background: "radial-gradient(ellipse at center, #40916c 0%, transparent 70%)",
              opacity: 0.1,
            }}
          />

          <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

            {/* Left column — text + KPI cards below CTA */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              className="flex flex-col items-start gap-6"
            >
              <Badge
                variant="outline"
                style={{
                  borderColor: "rgba(45,106,79,0.35)",
                  color: "#2d6a4f",
                  backgroundColor: "rgba(45,106,79,0.07)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.08em",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
                className="px-3 py-1"
              >
                AI-Powered Compliance
              </Badge>

              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 700,
                  fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)",
                  lineHeight: 1.08,
                  color: "#1b3a2d",
                  letterSpacing: "-0.01em",
                }}
              >
                Monitor Regulations.
                <br />
                <em
                  style={{
                    fontStyle: "italic",
                    backgroundImage: "linear-gradient(135deg, #2d6a4f 0%, #40916c 55%, #74c69d 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Automate Compliance.
                </em>
              </h1>

              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: "#3d5a4a",
                  fontSize: "0.975rem",
                  lineHeight: 1.7,
                  maxWidth: "28rem",
                }}
              >
                CorpMonitor tracks regulatory changes across 180+ jurisdictions
                in real time — so your legal team never misses a filing deadline.
              </p>

              <Button
                size="lg"
                className="h-11 px-6 font-semibold group transition-all"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  backgroundColor: "#2d6a4f",
                  color: "#f5f5dc",
                  boxShadow: "0 4px 20px rgba(45,106,79,0.25)",
                }}
                data-testid="button-start-monitoring"
              >
                Start Monitoring
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>

              {/* KPI cards — horizontal row below the CTA */}
              <div className="grid grid-cols-3 gap-3 w-full pt-2">
                {[
                  { title: "180+",          sub: "Jurisdictions",    icon: Globe,    delay: 0.4 },
                  { title: "Real-time",     sub: "Alerts",           icon: BellRing, delay: 0.5 },
                  { title: "AI-Powered",    sub: "Classification",   icon: Zap,      delay: 0.6 },
                ].map((stat) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: stat.delay }}
                  >
                    <div
                      className="flex flex-col items-start gap-2 p-4 rounded-xl transition-all duration-300 cursor-default"
                      style={{
                        backgroundColor: "rgba(255,255,248,0.8)",
                        border: "1px solid rgba(45,106,79,0.2)",
                        backdropFilter: "blur(8px)",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(45,106,79,0.48)")}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(45,106,79,0.2)")}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: "rgba(45,106,79,0.12)" }}
                      >
                        <stat.icon className="w-4 h-4" style={{ color: "#2d6a4f" }} />
                      </div>
                      <div>
                        <p style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 700,
                          fontSize: "0.95rem",
                          color: "#1b3a2d",
                          lineHeight: 1.2,
                        }}>{stat.title}</p>
                        <p style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.74rem",
                          color: "#5a7a69",
                          marginTop: "2px",
                        }}>{stat.sub}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right — PDF Flow Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="flex justify-center items-center py-2"
            >
              <PdfFlowAnimation />
            </motion.div>

          </div>
        </section>

        {/* ── SECTION 2: UPLOAD ── */}
        <section
          className="px-6 py-24 flex flex-col items-center"
          style={{ backgroundColor: "rgba(255,255,248,0.55)" }}
        >
          <div className="max-w-4xl w-full flex flex-col items-center">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.9rem, 3.5vw, 2.8rem)",
                  color: "#1b3a2d",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.15,
                  marginBottom: "1rem",
                }}
              >
                Upload Regulatory Documents
              </h2>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "#4a6858",
                fontSize: "0.975rem",
                maxWidth: "32rem",
                margin: "0 auto",
                lineHeight: 1.65,
              }}>
                Drop your ZIP archive containing PDF filings for instant
                AI-powered analysis and classification.
              </p>
            </motion.div>

            {/* Dropzone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="w-full"
            >
              <div
                className="w-full relative rounded-2xl border-2 border-dashed transition-all duration-300"
                style={{
                  borderColor: isDragging ? "#2d6a4f" : "rgba(45,106,79,0.3)",
                  backgroundColor: isDragging
                    ? "rgba(45,106,79,0.06)"
                    : "rgba(255,255,248,0.8)",
                  transform: isDragging ? "scale(1.008)" : "scale(1)",
                  boxShadow: isDragging ? "0 8px 40px rgba(45,106,79,0.15)" : "none",
                }}
                onDragOver={handleDragOver}
                onDragEnter={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onMouseEnter={e => {
                  if (!isDragging)
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(45,106,79,0.55)";
                }}
                onMouseLeave={e => {
                  if (!isDragging)
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(45,106,79,0.3)";
                }}
              >
                <div className="p-12 md:p-20 flex flex-col items-center justify-center min-h-90 text-center">
                  <input
                    type="file"
                    accept=".zip"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileInput}
                    data-testid="input-file-upload"
                  />

                  <AnimatePresence mode="wait">
                    {!uploadedFile ? (
                      <motion.div
                        key="upload-prompt"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        className="flex flex-col items-center"
                      >
                        <div
                          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300"
                          style={{
                            backgroundColor: isDragging ? "rgba(45,106,79,0.12)" : "rgba(45,106,79,0.07)",
                            color: "#2d6a4f",
                          }}
                        >
                          <CloudUpload className="w-10 h-10" />
                        </div>

                        <h3 style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontWeight: 600,
                          fontSize: "1.65rem",
                          color: "#1b3a2d",
                          marginBottom: "0.5rem",
                        }}>
                          Drag & drop your ZIP folder here
                        </h3>
                        <p style={{
                          fontFamily: "'DM Sans', sans-serif",
                          color: "#5a7a69",
                          fontSize: "0.875rem",
                          marginBottom: "2rem",
                        }}>
                          Supports .zip archives containing PDF documents · Max 500MB
                        </p>

                        {uploadError && (
                          <div
                            className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg"
                            style={{
                              backgroundColor: "rgba(185,28,28,0.08)",
                              color: "#b91c1c",
                              border: "1px solid rgba(185,28,28,0.2)",
                            }}
                          >
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", fontWeight: 500 }}>
                              {uploadError}
                            </span>
                          </div>
                        )}

                        <button
                          onClick={() => fileInputRef.current?.click()}
                          data-testid="button-browse-files"
                          className="px-5 py-2.5 rounded-lg font-medium transition-all duration-200"
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            backgroundColor: "transparent",
                            border: "1.5px solid rgba(45,106,79,0.45)",
                            color: "#2d6a4f",
                            fontSize: "0.9rem",
                            cursor: "pointer",
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(45,106,79,0.08)";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "#2d6a4f";
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(45,106,79,0.45)";
                          }}
                        >
                          Browse Files
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="file-selected"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center"
                      >
                        <div
                          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                          style={{ backgroundColor: "rgba(45,106,79,0.1)", color: "#2d6a4f" }}
                        >
                          <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h3 style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontWeight: 600,
                          fontSize: "1.65rem",
                          color: "#1b3a2d",
                          marginBottom: "0.35rem",
                        }}>
                          {uploadedFile.name}
                        </h3>
                        <p style={{
                          fontFamily: "'DM Sans', sans-serif",
                          color: "#5a7a69",
                          fontSize: "0.875rem",
                          marginBottom: "2rem",
                        }}>
                          {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB · ready to process
                        </p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => setUploadedFile(null)}
                            data-testid="button-clear-file"
                            className="px-5 py-2.5 rounded-lg transition-all"
                            style={{
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: "0.9rem",
                              border: "1.5px solid rgba(45,106,79,0.35)",
                              backgroundColor: "transparent",
                              color: "#2d6a4f",
                              cursor: "pointer",
                            }}
                          >
                            Clear
                          </button>
                          <button
                            data-testid="button-process-documents"
                            className="px-5 py-2.5 rounded-lg font-semibold transition-all"
                            style={{
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: "0.9rem",
                              backgroundColor: "#2d6a4f",
                              color: "#f5f5dc",
                              border: "none",
                              boxShadow: "0 4px 16px rgba(45,106,79,0.3)",
                              cursor: "pointer",
                            }}
                          >
                            Process Documents
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-14 w-full">
              {[
                {
                  title: "PDF Extraction",
                  desc: "Automatically extracts and indexes all PDF documents from the archive",
                  icon: FileText,
                  delay: 0.1,
                },
                {
                  title: "AI Classification",
                  desc: "Classifies regulations by jurisdiction, type, and urgency level",
                  icon: Zap,
                  delay: 0.2,
                },
                {
                  title: "Gap Analysis",
                  desc: "Identifies compliance gaps against your current policy framework",
                  icon: Shield,
                  delay: 0.3,
                },
              ].map((card) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: card.delay }}
                >
                  <div
                    className="p-6 rounded-xl h-full transition-all duration-300"
                    style={{
                      backgroundColor: "rgba(255,255,248,0.85)",
                      border: "1px solid rgba(45,106,79,0.18)",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(45,106,79,0.38)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(45,106,79,0.18)")}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                      style={{ backgroundColor: "rgba(45,106,79,0.1)" }}
                    >
                      <card.icon className="w-5 h-5" style={{ color: "#2d6a4f" }} />
                    </div>
                    <h4 style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontWeight: 600,
                      fontSize: "1.15rem",
                      color: "#1b3a2d",
                      marginBottom: "0.5rem",
                    }}>
                      {card.title}
                    </h4>
                    <p style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: "#5a7a69",
                      fontSize: "0.865rem",
                      lineHeight: 1.65,
                    }}>
                      {card.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}
