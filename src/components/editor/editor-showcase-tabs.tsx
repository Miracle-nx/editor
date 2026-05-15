"use client";

import clsx from "clsx";
import { useState } from "react";
import { CustomizationEditorLab } from "@/components/editor/customization-editor-lab";
import { FeishuEditor } from "@/components/editor/feishu-editor";

type TabKey = "main" | "basic";

const baseCapabilities = [
  "段落、标题、引用、列表、任务列表",
  "加粗、斜体、下划线、高亮、链接",
  "块侧边菜单、选区气泡工具条、基础表格",
  "作为基础富文本能力基座长期保留",
];

const mainCapabilities = [
  "Word / 网页结构化粘贴",
  "截图粘贴、图片上传、表格内插图",
  "左图右文模板块与业务示例",
  "适合作为主功能讲解与专项汇报区",
];

const tabs: Array<{
    key: TabKey;
    label: string;
    badge: string;
    title: string;
    description: string;
}> = [
        {
            key: "main",
            label: "主功能",
        badge: "Main Zone",
        title: "主功能、输入链路与专项能力展示",
        description:
                "这一块把输入能力、富文本主功能、模板能力和表格高级能力拆开展示，并为每个模块提供直接可点击的演示入口。",
        },
        {
            key: "basic",
        label: "基础功能",
        badge: "Base Zone",
        title: "基础富文本能力完整展示",
        description:
                "这一块保留选中文本气泡工具条、块级侧边菜单，以及日常富文本编辑所需的基础交互，承担基础编辑能力展示职责。",
        },
];

export function EditorShowcaseTabs() {
    const [activeTab, setActiveTab] = useState<TabKey>("main");
    const activeTabConfig = tabs.find((tab) => tab.key === activeTab) ?? tabs[0];

  return (
    <section className="space-y-6">
          <div className="rounded-[32px] border border-white/70 bg-white/70 p-4 shadow-[0_20px_70px_-35px_rgba(15,23,42,0.45)] backdrop-blur-sm sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                          Editor Showcase
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                          主功能和基础功能用 Tab 切换展示，但每个 Tab 都把能力讲完整
                      </h2>
                      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                          这样页面更干净，演示时也更聚焦。你切到哪个 Tab，就把那一块的能力边界、用途和交互完整展开，不会互相打架。
                      </p>
                  </div>

                  <div className="inline-flex w-fit rounded-full border border-slate-200 bg-white p-1 shadow-sm">
                      {tabs.map((tab) => (
                          <button
                              key={tab.key}
                              type="button"
                              onClick={() => setActiveTab(tab.key)}
                              className={clsx(
                                  "rounded-full px-4 py-2 text-sm font-medium transition",
                                  activeTab === tab.key
                                      ? "bg-slate-950 text-white"
                                      : "text-slate-600 hover:text-slate-950"
                              )}
                          >
                              {tab.label}
                          </button>
                      ))}
                  </div>
              </div>

              <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 sm:px-5">
                  <p
                      className={clsx(
                          "text-xs font-semibold uppercase tracking-[0.18em]",
                          activeTab === "main" ? "text-sky-700" : "text-slate-500"
                      )}
                  >
                      {activeTabConfig.badge}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-950">{activeTabConfig.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">
                      {activeTabConfig.description}
                  </p>

                  <ul className="mt-4 grid gap-2 text-sm leading-6 text-slate-600 sm:grid-cols-2">
                      {(activeTab === "main" ? mainCapabilities : baseCapabilities).map((item) => (
                          <li key={item} className="rounded-2xl border border-slate-200 bg-white px-3 py-2">
                              {item}
                          </li>
                      ))}
                  </ul>
              </div>
      </div>

          <div className={activeTab === "main" ? "block" : "hidden"}>
              <CustomizationEditorLab />
          </div>

          <div className={activeTab === "basic" ? "block" : "hidden"}>
              <FeishuEditor />
          </div>
    </section>
  );
}