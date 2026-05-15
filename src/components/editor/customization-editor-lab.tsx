"use client";

import { mergeAttributes, Node } from "@tiptap/core";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import clsx from "clsx";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  ListTodo,
  Pilcrow,
  Quote,
  Redo2,
  Table2,
  Trash2,
  Unlink,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";
import { common, createLowlight } from "lowlight";
import { useRef } from "react";

const lowlight = createLowlight(common);

const productImage =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#dbeafe"/>
          <stop offset="100%" stop-color="#bfdbfe"/>
        </linearGradient>
      </defs>
      <rect width="800" height="520" rx="36" fill="url(#bg)"/>
      <rect x="64" y="70" width="672" height="380" rx="28" fill="#ffffff" opacity="0.94"/>
      <rect x="104" y="114" width="180" height="20" rx="10" fill="#1d4ed8" opacity="0.9"/>
      <rect x="104" y="160" width="300" height="14" rx="7" fill="#cbd5e1"/>
      <rect x="104" y="192" width="250" height="14" rx="7" fill="#cbd5e1"/>
      <rect x="104" y="248" width="210" height="120" rx="22" fill="#dbeafe"/>
      <rect x="342" y="248" width="130" height="120" rx="22" fill="#e0f2fe"/>
      <rect x="500" y="248" width="194" height="120" rx="22" fill="#eff6ff"/>
    </svg>
  `);

const chartImage =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#fef3c7"/>
          <stop offset="100%" stop-color="#fde68a"/>
        </linearGradient>
      </defs>
      <rect width="800" height="520" rx="36" fill="url(#bg)"/>
      <rect x="76" y="72" width="648" height="376" rx="28" fill="#fffbeb"/>
      <path d="M150 360 L260 280 L360 308 L490 212 L620 180" fill="none" stroke="#d97706" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="150" cy="360" r="18" fill="#b45309"/>
      <circle cx="260" cy="280" r="18" fill="#b45309"/>
      <circle cx="360" cy="308" r="18" fill="#b45309"/>
      <circle cx="490" cy="212" r="18" fill="#b45309"/>
      <circle cx="620" cy="180" r="18" fill="#b45309"/>
    </svg>
  `);

const workspaceImage =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#d1fae5"/>
          <stop offset="100%" stop-color="#a7f3d0"/>
        </linearGradient>
      </defs>
      <rect width="800" height="520" rx="36" fill="url(#bg)"/>
      <rect x="88" y="112" width="624" height="260" rx="28" fill="#ecfdf5" opacity="0.96"/>
      <rect x="120" y="146" width="120" height="156" rx="18" fill="#bbf7d0"/>
      <rect x="266" y="146" width="180" height="156" rx="18" fill="#d1fae5"/>
      <rect x="474" y="146" width="206" height="156" rx="18" fill="#f0fdf4"/>
      <rect x="160" y="392" width="480" height="24" rx="12" fill="#059669" opacity="0.25"/>
    </svg>
  `);

const mediaCardExamples = [
  {
    kicker: "产品发布",
    heading: "左图右文适合做功能说明块",
    description:
      "左侧放产品图、流程图或封面图，右侧承接说明文字、关键收益和 CTA，适合公告、方案页、知识库首页。",
    imageSrc: productImage,
    imageAlt: "产品说明图",
    tone: "sky",
  },
  {
    kicker: "运营复盘",
    heading: "也可以当作图文摘要卡片",
    description:
      "当文档需要大量视觉摘要时，用这种块比单纯图片加段落更稳定，拖拽和复用时更容易保持版式一致。",
    imageSrc: chartImage,
    imageAlt: "图表摘要图",
    tone: "amber",
  },
  {
    kicker: "知识库模板",
    heading: "还能做 SOP 或案例模板入口",
    description:
      "把图片当封面，右侧放场景、流程和注意事项，能快速形成统一的富文本模板区块。",
    imageSrc: workspaceImage,
    imageAlt: "模板入口图",
    tone: "emerald",
  },
] as const;

const sampleWordHtml = `
  <h2>Word 粘贴保真样例</h2>
  <p><strong>重点</strong>：标题、加粗、斜体、下划线、列表、表格和链接都应尽量保留。</p>
  <p>这段内容模拟从办公文档复制进来的结果，适合验证“保留结构但剥离 Word 噪音样式”的策略。</p>
  <ul>
    <li>保留层级结构</li>
    <li>保留链接与重点标记</li>
    <li>遇到图片时优先读取剪贴板里的图片文件</li>
  </ul>
  <table>
    <tbody>
      <tr><th>模块</th><th>预期保留</th></tr>
      <tr><td>标题</td><td>Heading 结构</td></tr>
      <tr><td>列表</td><td>项目符号与编号</td></tr>
      <tr><td>表格</td><td>基础单元格结构</td></tr>
    </tbody>
  </table>
`;

const foundationRichTextHtml = `
  <h2>基础富文本能力样例</h2>
  <p>这是一段包含 <strong>加粗</strong>、<em>斜体</em>、<u>下划线</u> 和 <mark>高亮</mark> 的正文，用来验证基础编辑能力是否完整。</p>
  <blockquote>引用块适合承接备注、结论或策略摘要。</blockquote>
  <ol>
    <li>支持标题与正文层级</li>
    <li>支持有序、无序和任务型表达</li>
    <li>支持代码块、链接、表格和图片</li>
  </ol>
  <ul data-type="taskList">
    <li data-type="taskItem" data-checked="true"><label><input type="checkbox" checked="checked" /><span></span></label><div><p>需求拆解已完成</p></div></li>
    <li data-type="taskItem" data-checked="false"><label><input type="checkbox" /><span></span></label><div><p>下一步继续扩展协同与评论能力</p></div></li>
  </ul>
  <pre><code class="language-ts">const ability = "rich-text-showcase";</code></pre>
`;

const linkShowcases = [
  {
    title: "官网链接",
    html: `<p>查看 <a href="https://tiptap.dev" target="_blank" rel="noopener noreferrer">Tiptap 官方文档</a>，用于编辑器能力调研。</p>`,
  },
  {
    title: "帮助中心链接",
    html: `<p>阅读 <a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer">Next.js 文档</a> 了解当前前端架构。</p>`,
  },
  {
    title: "业务 CTA 链接",
    html: `<p>如果需要进一步评审，请点击 <a href="https://example.com/demo-request" target="_blank" rel="noopener noreferrer">申请演示</a> 进入业务流程。</p>`,
  },
] as const;

const tableShowcases = [
  {
    title: "合并拆分演示表",
    html: `
      <table>
        <tbody>
          <tr>
            <th colspan="2">Q3 发布节奏</th>
            <th>负责人</th>
          </tr>
          <tr>
            <td>需求冻结</td>
            <td>05/18</td>
            <td>产品</td>
          </tr>
          <tr>
            <td>联调</td>
            <td>05/24</td>
            <td>研发</td>
          </tr>
        </tbody>
      </table>
    `,
  },
  {
    title: "表格插图演示表",
    html: `
      <table>
        <tbody>
          <tr>
            <th>模块</th>
            <th>效果示意</th>
            <th>说明</th>
          </tr>
          <tr>
            <td>首页</td>
            <td><img src="${productImage}" alt="首页示意" /></td>
            <td>适合将结构图、界面缩略图直接放入单元格。</td>
          </tr>
        </tbody>
      </table>
    `,
  },
] as const;

const initialContent = `
  <h1>富文本主功能与输入能力实验区</h1>
  <p>这一版不再只演示局部需求，而是把 <strong>基础富文本能力</strong>、<strong>输入链路</strong>、<strong>模板块</strong> 和 <strong>表格高级能力</strong> 一起展开。</p>
  <p>你可以直接在这里尝试：</p>
  <ul>
    <li>键入正文、标题、列表、任务项和引用块</li>
    <li>从 Word / 飞书 / 浏览器复制内容后直接粘贴</li>
    <li>截图后直接粘贴图片，或点击上传图片</li>
    <li>插入链接、代码块和多种基础富文本样例</li>
    <li>插入左图右文模板块</li>
    <li>选中表格中的单元格后合并、拆分、插图</li>
  </ul>
  <p>这里已经放了一个 <a href="https://example.com/feature-lab">功能说明链接示例</a>，方便直接验证链接行为。</p>
`;

const capabilityBoards = [
  {
    title: "输入链路区",
    tone: "border-sky-100 bg-[linear-gradient(180deg,#ffffff_0%,#f4f9ff_100%)]",
    points: ["键入正文与快捷格式", "Word / 网页结构化粘贴", "截图粘贴", "图片上传"],
  },
  {
    title: "基础富文本区",
    tone: "border-slate-200 bg-white",
    points: ["标题与段落", "列表与任务列表", "引用与代码块", "链接与对齐"],
  },
  {
    title: "主功能模板区",
    tone: "border-emerald-100 bg-[linear-gradient(180deg,#ffffff_0%,#f4fff8_100%)]",
    points: ["左图右文模板块", "场景化业务示例", "可复用结构单元", "后续可做模板库"],
  },
  {
    title: "表格高级区",
    tone: "border-amber-100 bg-[linear-gradient(180deg,#ffffff_0%,#fffaf2_100%)]",
    points: ["插入表格", "合并与拆分", "增行与增列", "单元格插图"],
  },
] as const;

const MediaCard = Node.create({
  name: "mediaCard",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      kicker: { default: "图文模板" },
      heading: { default: "左图右文" },
      description: { default: "适合做封面、摘要、案例介绍。" },
      imageSrc: { default: productImage },
      imageAlt: { default: "图文模板" },
      tone: { default: "sky" },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-media-card="true"]',
        getAttrs: (element) => {
          const node = element as HTMLElement;

          return {
            kicker: node.dataset.kicker,
            heading: node.dataset.heading,
            description: node.dataset.description,
            imageSrc: node.dataset.imageSrc,
            imageAlt: node.dataset.imageAlt,
            tone: node.dataset.tone,
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const tone = typeof HTMLAttributes.tone === "string" ? HTMLAttributes.tone : "sky";

    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-media-card": "true",
        "data-kicker": HTMLAttributes.kicker,
        "data-heading": HTMLAttributes.heading,
        "data-description": HTMLAttributes.description,
        "data-image-src": HTMLAttributes.imageSrc,
        "data-image-alt": HTMLAttributes.imageAlt,
        "data-tone": tone,
        class: `media-card media-card--${tone}`,
      }),
      [
        "img",
        {
          src: HTMLAttributes.imageSrc,
          alt: HTMLAttributes.imageAlt,
          class: "media-card__image",
        },
      ],
      [
        "div",
        { class: "media-card__content" },
        ["p", { class: "media-card__kicker" }, String(HTMLAttributes.kicker ?? "")],
        ["h3", { class: "media-card__heading" }, String(HTMLAttributes.heading ?? "")],
        ["p", { class: "media-card__description" }, String(HTMLAttributes.description ?? "")],
      ],
    ];
  },
});

type EditorInstance = NonNullable<ReturnType<typeof useEditor>>;

type ToolbarIconButtonProps = {
  label: string;
  isActive?: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

function ToolbarIconButton({ label, isActive, onClick, children }: ToolbarIconButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={clsx(
        "inline-flex h-10 w-10 items-center justify-center rounded-2xl border transition",
        isActive
          ? "border-sky-300 bg-sky-50 text-sky-700"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
      )}
    >
      {children}
    </button>
  );
}

type ActionPillProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

function ActionPill({ label, onClick, disabled }: ActionPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
    >
      {label}
    </button>
  );
}

function normalizeLinkUrl(rawValue: string) {
  const value = rawValue.trim();

  if (!value) {
    return "";
  }

  if (/^(https?:|mailto:|tel:)/i.test(value)) {
    return value;
  }

  return `https://${value}`;
}

function promptForLink(editor: EditorInstance) {
  if (typeof window === "undefined") {
    return;
  }

  const currentHref = editor.getAttributes("link").href ?? "";
  const input = window.prompt("请输入链接地址，留空可取消。", currentHref);

  if (input === null) {
    return;
  }

  const href = normalizeLinkUrl(input);

  if (!href) {
    return;
  }

  editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
}

function normalizeWordHtml(html: string) {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\/?o:[^>]*>/gi, "")
    .replace(/\s*mso-[^:]+:[^;"']+;?/gi, "")
    .replace(/\s*class=("|')(Mso|msocomtxt)[^"']*\1/gi, "")
    .replace(/<span[^>]*>\s*<\/span>/gi, "")
    .replace(/<p[^>]*>\s*&nbsp;\s*<\/p>/gi, "");
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function insertImagesFromFiles(editor: EditorInstance, files: File[]) {
  const images = files.filter((file) => file.type.startsWith("image/"));

  for (const file of images) {
    const src = await readFileAsDataUrl(file);
    editor.chain().focus().setImage({ src, alt: file.name }).run();
    editor.chain().focus().createParagraphNear().run();
  }
}

function insertMediaCard(editor: EditorInstance, example: (typeof mediaCardExamples)[number]) {
  editor
    .chain()
    .focus()
    .insertContent([
      {
        type: "mediaCard",
        attrs: example,
      },
      {
        type: "paragraph",
      },
    ])
    .run();
}

function clearEditorContent(editor: EditorInstance) {
  if (typeof window !== "undefined") {
    const shouldClear = window.confirm("确认清空当前主功能实验台中的全部内容吗？");

    if (!shouldClear) {
      return;
    }
  }

  editor.chain().focus().clearContent().run();
}

export function CustomizationEditorLab() {
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({ lowlight }),
      Placeholder.configure({
        placeholder: "从 Word 或浏览器复制内容直接粘贴，或插入链接、图片、左图右文和表格示例…",
      }),
      Underline,
      Highlight.configure({ multicolor: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Link.configure({
        autolink: true,
        openOnClick: false,
        defaultProtocol: "https",
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: "editor-image",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      MediaCard,
    ],
    content: initialContent,
    parseOptions: {
      preserveWhitespace: "full",
    },
    editorProps: {
      attributes: {
        class: "feishu-prose min-h-[420px] max-w-none outline-none",
      },
      transformPastedHTML(html) {
        if (/mso-|urn:schemas-microsoft-com:office:office|class=(["'])Mso/i.test(html)) {
          return normalizeWordHtml(html);
        }

        return html;
      },
      handlePaste(_view, event) {
        const files = Array.from(event.clipboardData?.files ?? []);
        const currentEditor = editor;

        if (!currentEditor || !files.some((file) => file.type.startsWith("image/"))) {
          return false;
        }

        void insertImagesFromFiles(currentEditor, files);
        return true;
      },
    },
  });

  if (!editor) {
    return null;
  }

  const insertSelectedFiles = async (fileList: FileList | null) => {
    if (!fileList?.length) {
      return;
    }

    await insertImagesFromFiles(editor, Array.from(fileList));
  };

  return (
    <section className="space-y-8">
      <div className="grid gap-4 lg:grid-cols-4">
        {capabilityBoards.map((board) => (
          <article
            key={board.title}
            className={clsx(
              "rounded-[26px] border p-5 shadow-[0_18px_55px_-36px_rgba(15,23,42,0.35)]",
              board.tone
            )}
          >
            <h2 className="text-lg font-semibold text-slate-950">{board.title}</h2>
            <ul className="mt-4 grid gap-2 text-sm leading-6 text-slate-600">
              {board.points.map((point) => (
                <li key={point} className="rounded-2xl bg-white/80 px-3 py-2">
                  {point}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="overflow-hidden rounded-[32px] border border-black/10 bg-white shadow-[0_25px_80px_-40px_rgba(15,23,42,0.45)]">
        <div className="border-b border-black/8 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-5 py-4">
          <div className="mb-4 flex flex-wrap items-center gap-2 rounded-[24px] border border-sky-100 bg-sky-50/70 px-4 py-3 text-sm text-slate-700">
            <span className="rounded-full bg-white px-3 py-1 font-medium text-sky-700">输入链路</span>
            <span className="rounded-full bg-white px-3 py-1 font-medium text-slate-700">基础富文本</span>
            <span className="rounded-full bg-white px-3 py-1 font-medium text-emerald-700">模板块</span>
            <span className="rounded-full bg-white px-3 py-1 font-medium text-amber-700">表格高级能力</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ToolbarIconButton
              label="Paragraph"
              isActive={editor.isActive("paragraph")}
              onClick={() => editor.chain().focus().setParagraph().run()}
            >
              <Pilcrow size={18} />
            </ToolbarIconButton>
            <ToolbarIconButton
              label="Heading 1"
              isActive={editor.isActive("heading", { level: 1 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
              <Heading1 size={18} />
            </ToolbarIconButton>
            <ToolbarIconButton
              label="Heading 2"
              isActive={editor.isActive("heading", { level: 2 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              <Heading2 size={18} />
            </ToolbarIconButton>
            <ToolbarIconButton
              label="Heading 3"
              isActive={editor.isActive("heading", { level: 3 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              <Heading3 size={18} />
            </ToolbarIconButton>
            <ToolbarIconButton
              label="Bold"
              isActive={editor.isActive("bold")}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold size={18} />
            </ToolbarIconButton>
            <ToolbarIconButton
              label="Italic"
              isActive={editor.isActive("italic")}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic size={18} />
            </ToolbarIconButton>
            <ToolbarIconButton
              label="Underline"
              isActive={editor.isActive("underline")}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <UnderlineIcon size={18} />
            </ToolbarIconButton>
            <ToolbarIconButton
              label="Highlight"
              isActive={editor.isActive("highlight")}
              onClick={() => editor.chain().focus().toggleHighlight().run()}
            >
              <Highlighter size={18} />
            </ToolbarIconButton>
            <ToolbarIconButton
              label="Bullet List"
              isActive={editor.isActive("bulletList")}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List size={18} />
            </ToolbarIconButton>
            <ToolbarIconButton
              label="Ordered List"
              isActive={editor.isActive("orderedList")}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered size={18} />
            </ToolbarIconButton>
            <ToolbarIconButton
              label="Clear Content"
              onClick={() => clearEditorContent(editor)}
            >
              <Trash2 size={18} />
            </ToolbarIconButton>
            <ToolbarIconButton
              label="Task List"
              isActive={editor.isActive("taskList")}
              onClick={() => editor.chain().focus().toggleTaskList().run()}
            >
              <ListTodo size={18} />
            </ToolbarIconButton>
            <ToolbarIconButton
              label="Quote"
              isActive={editor.isActive("blockquote")}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <Quote size={18} />
            </ToolbarIconButton>
            <ToolbarIconButton
              label="Code Block"
              isActive={editor.isActive("codeBlock")}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
              <Code2 size={18} />
            </ToolbarIconButton>
            <ToolbarIconButton
              label="Insert Link"
              isActive={editor.isActive("link")}
              onClick={() => promptForLink(editor)}
            >
              <Link2 size={18} />
            </ToolbarIconButton>
            <ToolbarIconButton label="Remove Link" onClick={() => editor.chain().focus().unsetLink().run()}>
              <Unlink size={18} />
            </ToolbarIconButton>
            <ToolbarIconButton
              label="Upload Image"
              onClick={() => imageInputRef.current?.click()}
            >
              <ImagePlus size={18} />
            </ToolbarIconButton>
            <ToolbarIconButton
              label="Insert Table"
              isActive={editor.isActive("table")}
              onClick={() =>
                editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
              }
            >
              <Table2 size={18} />
            </ToolbarIconButton>
            <ToolbarIconButton
              label="Align Left"
              isActive={editor.isActive({ textAlign: "left" })}
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
            >
              <AlignLeft size={18} />
            </ToolbarIconButton>
            <ToolbarIconButton
              label="Align Center"
              isActive={editor.isActive({ textAlign: "center" })}
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
            >
              <AlignCenter size={18} />
            </ToolbarIconButton>
            <ToolbarIconButton
              label="Align Right"
              isActive={editor.isActive({ textAlign: "right" })}
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
            >
              <AlignRight size={18} />
            </ToolbarIconButton>
            <ToolbarIconButton label="Undo" onClick={() => editor.chain().focus().undo().run()}>
              <Undo2 size={18} />
            </ToolbarIconButton>
            <ToolbarIconButton label="Redo" onClick={() => editor.chain().focus().redo().run()}>
              <Redo2 size={18} />
            </ToolbarIconButton>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <ActionPill
              label="插入基础富文本文档"
              onClick={() => editor.chain().focus().insertContent(foundationRichTextHtml).run()}
            />
            <ActionPill
              label="插入 Word 粘贴样例"
              onClick={() => editor.chain().focus().insertContent(sampleWordHtml).run()}
            />
            <ActionPill
              label="合并单元格"
              disabled={!editor.can().mergeCells()}
              onClick={() => editor.chain().focus().mergeCells().run()}
            />
            <ActionPill
              label="拆分单元格"
              disabled={!editor.can().splitCell()}
              onClick={() => editor.chain().focus().splitCell().run()}
            />
            <ActionPill
              label="后插列"
              disabled={!editor.can().addColumnAfter()}
              onClick={() => editor.chain().focus().addColumnAfter().run()}
            />
            <ActionPill
              label="后插行"
              disabled={!editor.can().addRowAfter()}
              onClick={() => editor.chain().focus().addRowAfter().run()}
            />
            <ActionPill
              label="删除列"
              disabled={!editor.can().deleteColumn()}
              onClick={() => editor.chain().focus().deleteColumn().run()}
            />
            <ActionPill
              label="删除行"
              disabled={!editor.can().deleteRow()}
              onClick={() => editor.chain().focus().deleteRow().run()}
            />
            <ActionPill
              label="删除表格"
              disabled={!editor.can().deleteTable()}
              onClick={() => editor.chain().focus().deleteTable().run()}
            />
          </div>
        </div>

        <div className="grid gap-6 px-5 py-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-5">
            <EditorContent editor={editor} />
            <label htmlFor="customization-editor-image-upload" className="sr-only">
              上传插入到富文本编辑器中的图片
            </label>
            <input
              id="customization-editor-image-upload"
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              title="上传插入到富文本编辑器中的图片"
              onChange={(event) => {
                void insertSelectedFiles(event.target.files);
                event.target.value = "";
              }}
            />
          </div>

          <aside className="space-y-4 rounded-[28px] border border-[#d6e5f8] bg-[linear-gradient(180deg,#f4f9ff_0%,#eef6ff_100%)] p-5 text-sm text-slate-700">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                Capability Console
              </p>
              <h2 className="mt-3 text-xl font-semibold text-slate-900">分区能力实验台</h2>
              <p className="mt-2 leading-6 text-slate-600">
                这一版把“能输入什么、能编辑什么、能定制什么”拆成清晰模块，方便汇报时逐项点击演示，不遗漏任何可展示能力。
              </p>
            </div>

            <div className="rounded-2xl bg-white/80 p-4">
              <p className="text-sm font-semibold text-slate-900">1. 输入链路区</p>
              <p className="mt-2 leading-6 text-slate-600">
                这里集中展示用户如何把内容带进来，包括键盘录入、Word / 网页粘贴、截图粘贴和图片上传。输入链路做清楚，后续所有主功能才真正可用。
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <ActionPill
                  label="插入 Word 样例"
                  onClick={() => editor.chain().focus().insertContent(sampleWordHtml).run()}
                />
                <ActionPill label="触发图片上传" onClick={() => imageInputRef.current?.click()} />
              </div>
            </div>

            <div className="rounded-2xl bg-white/80 p-4">
              <p className="text-sm font-semibold text-slate-900">2. 基础富文本区</p>
              <p className="mt-2 leading-6 text-slate-600">
                这里专门承接基础富文本能力，确保标题、正文、列表、任务列表、引用、代码块、对齐和链接等能力可以单独说明、单独演示。
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <ActionPill
                  label="插入基础富文本文档"
                  onClick={() => editor.chain().focus().insertContent(foundationRichTextHtml).run()}
                />
                {linkShowcases.map((item) => (
                  <ActionPill
                    key={item.title}
                    label={item.title}
                    onClick={() => editor.chain().focus().insertContent(item.html).run()}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white/80 p-4">
              <p className="text-sm font-semibold text-slate-900">3. 主功能模板区</p>
              <p className="mt-2 leading-6 text-slate-600">
                这里展示更偏产品化的主功能能力。左图右文不是简单排版，而是稳定的模板块，适合后续往模板中心、内容组件库方向扩展。
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {mediaCardExamples.map((item) => (
                  <ActionPill
                    key={item.heading}
                    label={item.kicker}
                    onClick={() => insertMediaCard(editor, item)}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white/80 p-4">
              <p className="text-sm font-semibold text-slate-900">4. 表格高级能力区</p>
              <p className="mt-2 leading-6 text-slate-600">
                表格能力单独成区，便于强调这是复杂业务文档的基础设施。当前已支持合并、拆分、增删行列，以及单元格中的图片内容插入。
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {tableShowcases.map((item) => (
                  <ActionPill
                    key={item.title}
                    label={item.title}
                    onClick={() => editor.chain().focus().insertContent(item.html).run()}
                  />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {capabilityBoards.map((item) => (
          <article
            key={item.title}
            className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]"
          >
            <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
            <ul className="mt-4 grid gap-2 text-sm leading-6 text-slate-600">
              {item.points.map((point) => (
                <li key={point} className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2">
                  {point}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}