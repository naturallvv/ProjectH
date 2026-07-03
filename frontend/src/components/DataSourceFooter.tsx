const SOURCES = [
  "제주특별자치도 제주올레길 휠체어구간 데이터",
  "제주특별자치도 사회적약자 시설데이터 로드뷰",
  "제주특별자치도 사회적약자 시설 데이터(로드뷰) 구축 관광지 현황",
  "제주특별자치도 저상버스현황",
  "제주특별자치도 저상버스운행노선현황",
  "기상청 단기예보 조회서비스",
  "기상청 기상특보 조회서비스",
  "한국공항공사 제주국제공항 도면 이미지 정보",
  "한국공항공사 제주공항 층별 입점업체 현황",
  "JDC 제주국제공항 면세점 매장정보",
];

export default function DataSourceFooter() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--surface)",
        padding: "1rem 1.5rem",
        fontSize: "0.8rem",
        color: "var(--muted)",
      }}
    >
      <strong>데이터 출처</strong>
      <ul style={{ margin: "0.5rem 0 0", paddingLeft: "1.2rem", columns: 2 }}>
        {SOURCES.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </footer>
  );
}
