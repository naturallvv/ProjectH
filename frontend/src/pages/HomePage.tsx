import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div>
      <section className="card">
        <h1>WheelTrip Jeju</h1>
        <p>
          WheelTrip Jeju는 휠체어 이용자의 제주 여행을 위해 무장애 관광정보, 기상청 예보·특보,
          저상버스 정보, 한국공항공사 제주국제공항 도면 이미지 정보, 한국공항공사 제주공항 층별
          입점업체 현황, JDC 제주공항 면세점 매장정보를 결합하여 <strong>오늘 실제로 이동 가능한 일정과
          출도 전 공항 동선</strong>을 추천하는 AI 서비스입니다.
        </p>
        <p className="notice">
          ※ 추천 결과는 참고 정보이며, 휠체어 접근 가능성이나 안전을 보장하지 않습니다. 이동 전 최신
          기상정보와 현장 상황을 확인하세요.
        </p>
        <Link to="/recommendation">
          <button className="primary">이동가능성 추천 받기 →</button>
        </Link>
      </section>

      <section className="card">
        <h2>이렇게 동작합니다</h2>
        <ol>
          <li>사용자 조건(출발지, 휠체어 종류, 출도 시간, 날씨 민감도)을 입력합니다.</li>
          <li>접근성·날씨 위험도·교통·공항 부담을 점수화하여 관광지를 추천/조건부/비추천으로 분류합니다.</li>
          <li>기상 악화 시 실외 일정을 실내로 대체하고 공항 조기 이동을 권장합니다.</li>
          <li>출도 전 공항 층별 도면·입점업체와 JDC 면세점 매장정보를 안내합니다.</li>
        </ol>
      </section>
    </div>
  );
}
