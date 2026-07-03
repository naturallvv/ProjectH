const SOURCES: { name: string; url: string }[] = [
  { name: "제주올레길 휠체어구간(1코스)", url: "https://www.data.go.kr/data/15097499/fileData.do" },
  { name: "제주올레길 휠체어구간(14코스)", url: "https://www.data.go.kr/data/15097502/fileData.do" },
  { name: "사회적약자 시설데이터 로드뷰", url: "https://www.data.go.kr/data/15109149/openapi.do" },
  { name: "사회적약자 시설(로드뷰) 관광지 현황", url: "https://www.data.go.kr/data/15109153/fileData.do" },
  { name: "제주 저상버스현황", url: "https://www.data.go.kr/data/15114410/fileData.do" },
  { name: "제주 저상버스운행노선현황", url: "https://www.data.go.kr/data/15155485/fileData.do" },
  { name: "기상청 단기예보 조회서비스", url: "https://www.data.go.kr/data/15084084/openapi.do" },
  { name: "기상청 기상특보 조회서비스", url: "https://www.data.go.kr/data/15000415/openapi.do" },
  { name: "한국공항공사 제주공항 도면 이미지", url: "https://www.data.go.kr/data/15151895/fileData.do" },
  { name: "한국공항공사 제주공항 층별 입점업체", url: "https://www.data.go.kr/data/15119335/fileData.do" },
  { name: "JDC 제주국제공항 면세점 매장정보", url: "https://www.data.go.kr/data/15144890/openapi.do" },
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
      <ul style={{ margin: "0.5rem 0", paddingLeft: "1.2rem", columns: 2 }}>
        {SOURCES.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noreferrer" style={{ color: "var(--muted)" }}>
              {s.name}
            </a>
          </li>
        ))}
      </ul>
      <p style={{ margin: 0 }}>
        ※ JDC 데이터는 면세점 매장정보 안내에만 사용합니다. 공항 편의시설·동선은 한국공항공사 데이터를
        사용하며, 확인되지 않은 정보는 표시하지 않습니다.
      </p>
    </footer>
  );
}
