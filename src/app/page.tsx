import { Link } from "react-router-dom";
import { EditorShowcaseTabs } from "@/components/editor/editor-showcase-tabs";

const capabilities = [
  "基础富文本能力全量展示：标题、列表、任务、引用、代码、对齐",
  "输入链路全量展示：键入、Word 粘贴、网页粘贴、截图粘贴、图片上传",
  "主功能分区展示：链接、媒体模板、表格高级能力、业务示例插入",
  "基础能力与主功能分区并行展示，便于讲解、验证和后续扩展",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#dceeff_0%,#f5f9fc_38%,#eef3f8_100%)] px-5 py-10 text-slate-950 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
              Feishu-like Editor Starter
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              把基础富文本能力和主功能能力都完整展开，并按分区做成可直接演示的产品实验台。
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              当前页面不再只展示局部能力，而是把基础编辑、输入链路和定制化主功能一起展开，既能看见全貌，也能按模块逐项演示。
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/left-image-right-text"
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                查看左图右文页面
              </Link>
              <a
                href="#editor"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
              >
                继续查看编辑器
              </a>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/70 bg-white/70 p-6 shadow-[0_20px_70px_-35px_rgba(15,23,42,0.45)] backdrop-blur-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Foundation
            </p>
            <ul className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
              {capabilities.map((capability) => (
                <li
                  key={capability}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
                >
                  {capability}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div id="editor">
          <EditorShowcaseTabs />
        </div>
      </div>
    </main>
  );
}
