import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: "📊",
    title: "이동가능성 점수",
    desc: "접근성·교통·날씨를 종합해 오늘 실제로 갈 수 있는 곳만 골라드려요.",
  },
  {
    icon: "🌦️",
    title: "날씨 기반 일정 재구성",
    desc: "기상 특보가 뜨면 실외 일정을 실내로 자동 대체해 드려요.",
  },
  {
    icon: "✈️",
    title: "공항 출도 동선",
    desc: "도착 권장 시간부터 층별 시설, 면세점까지 출도 전 동선을 안내해요.",
  },
];

const STEPS = [
  { no: 1, title: "질문·조건 입력", desc: "\"바다 보이는 산책로\" 처럼 편하게" },
  { no: 2, title: "지도에서 추천", desc: "무장애 정보 × 접근성 × 날씨" },
  { no: 3, title: "코스 담기·일정", desc: "가고 싶은 곳을 담으면 하루 일정으로" },
  { no: 4, title: "공항 동선", desc: "층별 도면·도착 시간·면세점" },
];

export default function HomePage() {
  return (
    <div className="-mt-8 -mx-4 sm:-mx-6">
      {/* 히어로 */}
      <section className="bg-gradient-to-br from-brand-50 via-orange-50 to-sea-50 px-4 sm:px-6 pt-16 pb-14">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-white/70 text-brand-600 text-xs font-bold tracking-wide mb-5 shadow-sm">
            휠체어 이용자를 위한 제주 여행 도우미
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-stone-900 leading-tight m-0">
            오늘, 휠체어로
            <br />
            갈 수 있는 <span className="text-brand-500">제주</span>
          </h1>
          <p className="mt-5 text-lg text-stone-500 leading-relaxed">
            무장애 관광정보와 실시간 기상, 교통, 공항 데이터를 결합해
            <br className="hidden sm:block" />
            <strong className="text-stone-700">당일 이동 가능한 일정</strong>과{" "}
            <strong className="text-stone-700">출도 전 공항 동선</strong>을 추천해
            드려요.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/planner"
              className="no-underline px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold shadow-[var(--shadow-lift)] transition-colors"
            >
              여행 플래너 시작하기 →
            </Link>
          </div>
          <p className="mt-6 text-xs text-stone-400">
            ※ 추천 결과는 참고 정보이며 접근 가능성과 안전을 보장하지 않습니다.
          </p>
        </div>
      </section>

      {/* 특징 3칸 */}
      <section className="px-4 sm:px-6 py-12">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl border border-brand-100 p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)] transition-shadow"
            >
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-3 mb-1 font-bold text-stone-800">{f.title}</h3>
              <p className="m-0 text-sm text-stone-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 이용 흐름 */}
      <section className="px-4 sm:px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-2xl font-extrabold text-stone-900 mb-8">
            이렇게 이용해요
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STEPS.map((s) => (
              <div key={s.no} className="text-center">
                <div className="mx-auto grid place-items-center w-10 h-10 rounded-full bg-brand-500 text-white font-extrabold shadow-sm">
                  {s.no}
                </div>
                <div className="mt-3 font-bold text-stone-800">{s.title}</div>
                <div className="mt-1 text-xs text-stone-400">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 하단 CTA 밴드 */}
      <section className="px-4 sm:px-6 pb-4">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-brand-500 to-brand-400 px-8 py-10 text-center shadow-[var(--shadow-lift)]">
          <h2 className="m-0 text-2xl font-extrabold text-white">
            지금 조건을 입력하고 오늘의 일정을 받아보세요
          </h2>
          <p className="mt-2 mb-6 text-white/80 text-sm">
            입력부터 추천까지 30초면 충분해요.
          </p>
          <Link
            to="/planner"
            className="no-underline inline-block px-6 py-3 rounded-2xl bg-white text-brand-600 font-bold hover:bg-brand-50 transition-colors"
          >
            무료로 시작하기
          </Link>
        </div>
      </section>
    </div>
  );
}
