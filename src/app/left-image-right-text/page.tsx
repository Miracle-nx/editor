import { Link } from "react-router-dom";

const featurePoints = [
  "左侧视觉区用于封面、截图或产品插画",
  "右侧信息区承载标题、描述和动作按钮",
  "移动端自动折叠为上下布局，保证可读性",
];

export default function LeftImageRightTextPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f6f9fc_0%,#edf4f8_100%)] px-5 py-8 text-slate-950 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
              Layout Demo
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              左图右文页面
            </h1>
          </div>

          <Link
                      to="/"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950"
          >
            返回首页
          </Link>
        </div>

        <section className="grid overflow-hidden rounded-[36px] border border-white/80 bg-white/80 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[360px] overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(125,211,252,0.9),transparent_35%),linear-gradient(160deg,#0f172a_0%,#1d4ed8_52%,#e0f2fe_100%)] p-6 sm:p-8 lg:min-h-[620px] lg:p-10">
            <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0.32),transparent)]" />

            <div className="relative flex h-full flex-col justify-between">
              <div className="max-w-sm rounded-[28px] border border-white/20 bg-white/12 p-5 text-white backdrop-blur-md">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-100/90">
                  Visual Panel
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  让页面第一眼就说明场景。
                </h2>
                <p className="mt-3 text-sm leading-7 text-sky-50/85">
                  这里适合放截图、产品插画或者活动海报，让右侧文案区只负责说明重点和转化动作。
                </p>
              </div>

              <div className="relative mx-auto mt-8 w-full max-w-xl">
                <div className="absolute -left-6 top-6 h-24 w-24 rounded-full bg-white/18 blur-2xl" />
                <div className="absolute -right-2 bottom-6 h-28 w-28 rounded-full bg-sky-100/30 blur-3xl" />

                <div className="relative overflow-hidden rounded-[28px] border border-white/30 bg-white/15 p-3 shadow-[0_25px_80px_-45px_rgba(15,23,42,0.9)] backdrop-blur-md">
                                  <img
                    src="/left-image-right-text-visual.svg"
                                      alt="左图右文布局示意图"
                    className="h-auto w-full rounded-[20px]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
            <span className="inline-flex w-fit rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-sky-700 uppercase">
              Split Hero
            </span>
            <h2 className="mt-5 max-w-xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              左边给氛围，右边给信息，页面结构会更稳。
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              这个版本把页面拆成清晰的两栏。左侧承担视觉吸引，右侧承载标题、副标题、说明和操作入口，适合产品介绍、模板页、活动页或者功能宣传页。
            </p>

            <ul className="mt-8 grid gap-3 text-sm text-slate-700 sm:text-base">
              {featurePoints.map((point) => (
                <li key={point} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                              to="/"
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                查看编辑器主页
              </Link>
              <a
                href="#layout-notes"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
              >
                查看布局说明
              </a>
            </div>

            <div
              id="layout-notes"
              className="mt-10 rounded-[28px] border border-slate-200 bg-slate-50 p-6"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Layout Notes
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                当前实现优先保证结构清晰、响应式稳定和视觉层次分明。后续如果你要做成飞书文档模板页，可以继续接入动态数据、按钮配置、面包屑和区块化内容编排。
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}