import type { RagResponse } from "../types/rag";

function Row({ label, text }: { label: string; text: string }) {
  return (
    <div style={{ marginBottom: "0.6rem" }}>
      <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--primary)" }}>{label}</div>
      <div style={{ fontSize: "0.95rem" }}>{text}</div>
    </div>
  );
}

export default function RagExplanationBox({ rag }: { rag: RagResponse }) {
  return (
    <div className="card" style={{ background: "#f5f3ff", borderColor: "#ddd6fe" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>🤖 AI 추천 설명</h2>
        <span className="notice">
          {rag.source === "mock" ? "template(mock)" : "RAG 서버"}
        </span>
      </div>
      <p style={{ fontWeight: 600 }}>{rag.summary}</p>
      <Row label="추천 이유" text={rag.recommended_itinerary_reason} />
      <Row label="위험 설명" text={rag.risk_explanation} />
      <Row label="공항 동선" text={rag.airport_guidance} />
      <ul className="notice" style={{ margin: 0, paddingLeft: "1.1rem" }}>
        {rag.cautions.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
    </div>
  );
}
