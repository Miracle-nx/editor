"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Color from "@tiptap/extension-color";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  ChevronRight,
  Code2,
  Copy,
  Heading2,
  Heading1,
  Heading3,
  GripVertical,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  ListTodo,
  Link2,
  Palette,
  Pilcrow,
  Plus,
  Quote,
  Scissors,
  Strikethrough,
  Table2,
  Trash2,
  Underline as UnderlineIcon,
  Unlink,
} from "lucide-react";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

const initialContent = `
  <h1>飞书式编辑器原型</h1>
  <p>这一版先把 <strong>块结构</strong>、<strong>基础格式</strong>、<strong>任务列表</strong> 和 <strong>表格</strong> 打通，后续再继续加 slash menu、协同光标、评论和版本历史。</p>
  <ul>
    <li>支持段落、标题、列表</li>
    <li>支持高亮、下划线、链接</li>
    <li>支持任务列表和基础表格</li>
  </ul>
  <p>你可以直接在这里输入内容，验证交互和视觉风格。</p>
`;

type ToolbarButtonProps = {
  label: string;
  isActive?: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
};

function ToolbarButton({ label, isActive, onClick, className, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={clsx(
        "inline-flex h-10 w-10 items-center justify-center rounded-2xl border transition",
        isActive
          ? "border-sky-400 bg-sky-50 text-sky-700"
          : "border-black/10 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900",
        className
      )}
    >
      {children}
    </button>
  );
}

type EditorInstance = NonNullable<ReturnType<typeof useEditor>>;

type BlockNodeInfo = {
  from: number;
  to: number;
  textFrom: number;
  textTo: number;
  nodeType: string;
  textContent: string;
};

type HoveredBlock = {
  element: HTMLElement;
  top: number;
  info: BlockNodeInfo;
};

type ActiveBlockMenu = HoveredBlock & {
  isOpen: boolean;
};

type MenuAction = {
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  isActive?: boolean;
  onSelect: () => void;
};

const blockSelector = "p, h1, h2, h3, blockquote, pre, ul, ol, table";

const colorOptions = [
  { label: "默认", value: null, preview: "#cbd5e1" },
  { label: "石墨灰", value: "#334155", preview: "#334155" },
  { label: "飞书蓝", value: "#2563eb", preview: "#2563eb" },
  { label: "森林绿", value: "#15803d", preview: "#15803d" },
  { label: "夕阳橙", value: "#ea580c", preview: "#ea580c" },
  { label: "莓果红", value: "#dc2626", preview: "#dc2626" },
];

function getBlockInfo(editor: EditorInstance, element: HTMLElement): BlockNodeInfo | null {
  try {
    const pos = editor.view.posAtDOM(element, 0);
    const resolvedPos = editor.state.doc.resolve(pos);

    for (let depth = resolvedPos.depth; depth > 0; depth -= 1) {
      const node = resolvedPos.node(depth);

      if (!node.isBlock || node.type.name === "doc" || node.type.name === "listItem") {
        continue;
      }

      return {
        from: resolvedPos.before(depth),
        to: resolvedPos.after(depth),
        textFrom: node.isTextblock ? resolvedPos.start(depth) : resolvedPos.before(depth) + 1,
        textTo: node.isTextblock ? resolvedPos.end(depth) : resolvedPos.after(depth) - 1,
        nodeType: node.type.name,
        textContent: editor.state.doc.textBetween(
          resolvedPos.before(depth),
          resolvedPos.after(depth),
          "\n",
          "\n"
        ).trim(),
      };
    }
  } catch {
    return null;
  }

  return null;
}

function focusBlock(editor: EditorInstance, block: BlockNodeInfo) {
  if (block.nodeType === "table") {
    editor.chain().focus().setNodeSelection(block.from).run();
    return;
  }

  editor.chain().focus().setTextSelection(block.textFrom).run();
}

function selectBlockText(editor: EditorInstance, block: BlockNodeInfo) {
  if (block.textTo > block.textFrom) {
    editor
      .chain()
      .focus()
      .setTextSelection({ from: block.textFrom, to: block.textTo })
      .run();
    return;
  }

  focusBlock(editor, block);
}

function insertParagraphBelow(editor: EditorInstance, block: BlockNodeInfo) {
  const paragraph = editor.state.schema.nodes.paragraph;

  if (!paragraph) {
    return;
  }

  const transaction = editor.state.tr.insert(block.to, paragraph.create());
  editor.view.dispatch(transaction);
  editor.chain().focus().setTextSelection(block.to + 1).run();
}

async function copyBlockText(editor: EditorInstance, block: BlockNodeInfo) {
  const text = block.textContent || editor.state.doc.textBetween(block.from, block.to, "\n", "\n").trim();

  if (!text || typeof navigator === "undefined" || !navigator.clipboard) {
    return;
  }

  await navigator.clipboard.writeText(text);
}

async function cutBlock(editor: EditorInstance, block: BlockNodeInfo) {
  await copyBlockText(editor, block);
  const transaction = editor.state.tr.delete(block.from, block.to);
  editor.view.dispatch(transaction);
  editor.chain().focus().run();
}

function duplicateBlock(editor: EditorInstance, block: BlockNodeInfo) {
  const slice = editor.state.doc.slice(block.from, block.to);
  const transaction = editor.state.tr.insert(block.to, slice.content);
  editor.view.dispatch(transaction);
  editor.chain().focus().run();
}

function deleteBlock(editor: EditorInstance, block: BlockNodeInfo) {
  const transaction = editor.state.tr.delete(block.from, block.to);
  editor.view.dispatch(transaction);
  editor.chain().focus().run();
}

function applyTextColor(editor: EditorInstance, block: BlockNodeInfo, color: string | null) {
  selectBlockText(editor, block);

  if (color) {
    editor.chain().focus().setColor(color).run();
    return;
  }

  editor.chain().focus().unsetColor().run();
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

  editor
    .chain()
    .focus()
    .extendMarkRange("link")
    .setLink({ href })
    .run();
}

function removeLink(editor: EditorInstance) {
  editor.chain().focus().extendMarkRange("link").unsetLink().run();
}

function clearEditorContent(editor: EditorInstance) {
  if (typeof window !== "undefined") {
    const shouldClear = window.confirm("确认清空当前编辑器中的全部内容吗？");

    if (!shouldClear) {
      return;
    }
  }

  editor.chain().focus().clearContent().run();
}

function BlockHandleMenu({
  editor,
  block,
  onOpenChange,
}: {
  editor: EditorInstance;
  block: BlockNodeInfo;
  onOpenChange: (open: boolean) => void;
}) {
  const quickActions: MenuAction[] = [
    {
      label: "正文",
      icon: Pilcrow,
      isActive: editor.isActive("paragraph"),
      onSelect: () => {
        focusBlock(editor, block);
        editor.chain().focus().setParagraph().run();
      },
    },
    {
      label: "H1",
      icon: Heading1,
      isActive: editor.isActive("heading", { level: 1 }),
      onSelect: () => {
        focusBlock(editor, block);
        editor.chain().focus().toggleHeading({ level: 1 }).run();
      },
    },
    {
      label: "H2",
      icon: Heading2,
      isActive: editor.isActive("heading", { level: 2 }),
      onSelect: () => {
        focusBlock(editor, block);
        editor.chain().focus().toggleHeading({ level: 2 }).run();
      },
    },
    {
      label: "H3",
      icon: Heading3,
      isActive: editor.isActive("heading", { level: 3 }),
      onSelect: () => {
        focusBlock(editor, block);
        editor.chain().focus().toggleHeading({ level: 3 }).run();
      },
    },
    {
      label: "有序列表",
      icon: ListOrdered,
      isActive: editor.isActive("orderedList"),
      onSelect: () => {
        focusBlock(editor, block);
        editor.chain().focus().toggleOrderedList().run();
      },
    },
    {
      label: "无序列表",
      icon: List,
      isActive: editor.isActive("bulletList"),
      onSelect: () => {
        focusBlock(editor, block);
        editor.chain().focus().toggleBulletList().run();
      },
    },
    {
      label: "任务列表",
      icon: ListTodo,
      isActive: editor.isActive("taskList"),
      onSelect: () => {
        focusBlock(editor, block);
        editor.chain().focus().toggleTaskList().run();
      },
    },
    {
      label: "引用",
      icon: Quote,
      isActive: editor.isActive("blockquote"),
      onSelect: () => {
        focusBlock(editor, block);
        editor.chain().focus().toggleBlockquote().run();
      },
    },
    {
      label: "代码块",
      icon: Code2,
      isActive: editor.isActive("codeBlock"),
      onSelect: () => {
        focusBlock(editor, block);
        editor.chain().focus().toggleCodeBlock().run();
      },
    },
  ];

  return (
    <DropdownMenu.Root modal={false} onOpenChange={onOpenChange}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:text-slate-800"
          aria-label="打开块级菜单"
        >
          <GripVertical size={15} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          side="bottom"
          sideOffset={8}
          className="w-[272px] rounded-[20px] border border-slate-200 bg-white p-2 shadow-[0_28px_70px_-28px_rgba(15,23,42,0.5)]"
        >
          <div className="grid grid-cols-5 gap-1.5 rounded-2xl border border-slate-100 bg-slate-50/70 p-1.5">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <DropdownMenu.Item key={action.label} asChild>
                  <button
                    type="button"
                    onClick={action.onSelect}
                    className={clsx(
                      "flex h-11 flex-col items-center justify-center rounded-xl text-[11px] font-medium outline-none transition",
                      action.isActive
                        ? "bg-sky-100 text-sky-700"
                        : "text-slate-600 hover:bg-white hover:text-slate-900"
                    )}
                  >
                    <Icon size={16} />
                    <span className="mt-1">{action.label}</span>
                  </button>
                </DropdownMenu.Item>
              );
            })}
          </div>

          <div className="my-2 h-px bg-slate-200" />

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none transition hover:bg-slate-50">
              <span className="flex items-center gap-2">
                <AlignLeft size={16} />
                缩进和对齐
              </span>
              <ChevronRight size={15} />
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent className="min-w-[180px] rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_24px_60px_-26px_rgba(15,23,42,0.45)]">
                {[
                  { label: "左对齐", icon: AlignLeft, isActive: editor.isActive({ textAlign: "left" }) || (!editor.isActive({ textAlign: "center" }) && !editor.isActive({ textAlign: "right" })), action: () => editor.chain().focus().setTextAlign("left").run() },
                  { label: "居中", icon: AlignCenter, isActive: editor.isActive({ textAlign: "center" }), action: () => editor.chain().focus().setTextAlign("center").run() },
                  { label: "右对齐", icon: AlignRight, isActive: editor.isActive({ textAlign: "right" }), action: () => editor.chain().focus().setTextAlign("right").run() },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <DropdownMenu.Item
                      key={item.label}
                      onSelect={() => {
                        focusBlock(editor, block);
                        item.action();
                      }}
                      className={clsx(
                        "flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm outline-none transition",
                        item.isActive ? "bg-sky-50 text-sky-700" : "text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </DropdownMenu.Item>
                  );
                })}
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none transition hover:bg-slate-50">
              <span className="flex items-center gap-2">
                <Palette size={16} />
                颜色
              </span>
              <ChevronRight size={15} />
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent className="min-w-[186px] rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_24px_60px_-26px_rgba(15,23,42,0.45)]">
                {colorOptions.map((color) => (
                  <DropdownMenu.Item
                    key={color.label}
                    onSelect={() => applyTextColor(editor, block, color.value)}
                    className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none transition hover:bg-slate-50"
                  >
                    <span
                      className="h-4 w-4 rounded-full border border-slate-200"
                      style={{ backgroundColor: color.preview }}
                    />
                    <span>{color.label}</span>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          <div className="my-2 h-px bg-slate-200" />

          <DropdownMenu.Item
            onSelect={() => duplicateBlock(editor, block)}
            className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none transition hover:bg-slate-50"
          >
            <Copy size={16} />
            复制块
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={() => {
              void copyBlockText(editor, block);
            }}
            className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none transition hover:bg-slate-50"
          >
            <Copy size={16} />
            复制文本
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={() => {
              void cutBlock(editor, block);
            }}
            className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none transition hover:bg-slate-50"
          >
            <Scissors size={16} />
            剪切
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={() => deleteBlock(editor, block)}
            className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-red-600 outline-none transition hover:bg-red-50"
          >
            <Trash2 size={16} />
            删除
          </DropdownMenu.Item>

          <div className="my-2 h-px bg-slate-200" />

          <DropdownMenu.Item
            onSelect={() => insertParagraphBelow(editor, block)}
            className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none transition hover:bg-slate-50"
          >
            <Plus size={16} />
            在下方添加
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

type TextPreset = {
  label: string;
  isActive: boolean;
  onSelect: () => void;
};

function BubbleMenuToolbar({ editor }: { editor: EditorInstance }) {
  const textPresets: TextPreset[] = [
    {
      label: "正文",
      isActive: editor.isActive("paragraph"),
      onSelect: () => editor.chain().focus().setParagraph().run(),
    },
    {
      label: "标题 2",
      isActive: editor.isActive("heading", { level: 2 }),
      onSelect: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "标题 3",
      isActive: editor.isActive("heading", { level: 3 }),
      onSelect: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      label: "无序列表",
      isActive: editor.isActive("bulletList"),
      onSelect: () => editor.chain().focus().toggleBulletList().run(),
    },
  ];

  const alignments = [
    {
      label: "左对齐",
      icon: AlignLeft,
      isActive: editor.isActive({ textAlign: "left" }) || !editor.isActive({ textAlign: "center" }) && !editor.isActive({ textAlign: "right" }),
      onSelect: () => editor.chain().focus().setTextAlign("left").run(),
    },
    {
      label: "居中",
      icon: AlignCenter,
      isActive: editor.isActive({ textAlign: "center" }),
      onSelect: () => editor.chain().focus().setTextAlign("center").run(),
    },
    {
      label: "右对齐",
      icon: AlignRight,
      isActive: editor.isActive({ textAlign: "right" }),
      onSelect: () => editor.chain().focus().setTextAlign("right").run(),
    },
  ];

  return (
    <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white/98 p-1.5 shadow-[0_18px_50px_-22px_rgba(15,23,42,0.45)] backdrop-blur">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <span>
              {textPresets.find((preset) => preset.isActive)?.label ?? "正文"}
            </span>
            <ChevronDown size={16} />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            sideOffset={8}
            className="min-w-[144px] rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_18px_50px_-22px_rgba(15,23,42,0.45)]"
          >
            {textPresets.map((preset) => (
              <DropdownMenu.Item
                key={preset.label}
                onSelect={preset.onSelect}
                className={clsx(
                  "cursor-pointer rounded-xl px-3 py-2 text-sm outline-none transition",
                  preset.isActive ? "bg-sky-50 text-sky-700" : "text-slate-700 hover:bg-slate-50"
                )}
              >
                {preset.label}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <div className="mx-1 h-6 w-px bg-slate-200" />

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <AlignLeft size={16} />
            <ChevronDown size={16} />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            sideOffset={8}
            className="min-w-[144px] rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_18px_50px_-22px_rgba(15,23,42,0.45)]"
          >
            {alignments.map((alignment) => {
              const Icon = alignment.icon;

              return (
                <DropdownMenu.Item
                  key={alignment.label}
                  onSelect={alignment.onSelect}
                  className={clsx(
                    "flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm outline-none transition",
                    alignment.isActive ? "bg-sky-50 text-sky-700" : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <Icon size={16} />
                  <span>{alignment.label}</span>
                </DropdownMenu.Item>
              );
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <div className="mx-1 h-6 w-px bg-slate-200" />

      <ToolbarButton
        label="Bold"
        className="h-9 w-9 rounded-xl border-transparent"
        isActive={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={17} />
      </ToolbarButton>
      <ToolbarButton
        label="Strike"
        className="h-9 w-9 rounded-xl border-transparent"
        isActive={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={17} />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        className="h-9 w-9 rounded-xl border-transparent"
        isActive={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={17} />
      </ToolbarButton>
      <ToolbarButton
        label="Underline"
        className="h-9 w-9 rounded-xl border-transparent"
        isActive={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon size={17} />
      </ToolbarButton>
      <ToolbarButton
        label="Code"
        className="h-9 w-9 rounded-xl border-transparent"
        isActive={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code2 size={17} />
      </ToolbarButton>
      <ToolbarButton
        label="Highlight"
        className="h-9 w-9 rounded-xl border-transparent"
        isActive={editor.isActive("highlight")}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
      >
        <Highlighter size={17} />
      </ToolbarButton>
      <ToolbarButton
        label="Link"
        className="h-9 w-9 rounded-xl border-transparent"
        isActive={editor.isActive("link")}
        onClick={() => promptForLink(editor)}
      >
        <Link2 size={17} />
      </ToolbarButton>
      <ToolbarButton
        label="Remove Link"
        className="h-9 w-9 rounded-xl border-transparent"
        isActive={false}
        onClick={() => removeLink(editor)}
      >
        <Unlink size={17} />
      </ToolbarButton>
    </div>
  );
}

export function FeishuEditor() {
  const editorShellRef = useRef<HTMLDivElement | null>(null);
  const [hoveredBlock, setHoveredBlock] = useState<HoveredBlock | null>(null);
  const [activeBlockMenu, setActiveBlockMenu] = useState<ActiveBlockMenu | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      TextStyle,
      Color,
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: "输入 / 以后可以接入 slash command，当前先验证核心编辑体验…",
      }),
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          "feishu-prose min-h-[320px] w-full max-w-none outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor || !editorShellRef.current) {
      return;
    }

    const shell = editorShellRef.current;
    const editorElement = editor.view.dom as HTMLElement;

    const updateHoveredBlock = (element: HTMLElement | null) => {
      if (!element || !editorElement.contains(element)) {
        setHoveredBlock(null);
        return;
      }

      const info = getBlockInfo(editor, element);

      if (!info) {
        setHoveredBlock(null);
        return;
      }

      const shellRect = shell.getBoundingClientRect();
      const blockRect = element.getBoundingClientRect();

      setHoveredBlock({
        element,
        info,
        top: blockRect.top - shellRect.top + blockRect.height / 2,
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;

      if (target?.closest("[data-block-actions]")) {
        return;
      }

      const blockElement = target?.closest(blockSelector) as HTMLElement | null;

      if (blockElement) {
        updateHoveredBlock(blockElement);
        return;
      }

      if (!activeBlockMenu?.isOpen) {
        setHoveredBlock(null);
      }
    };

    const handleMouseLeave = () => {
      if (!activeBlockMenu?.isOpen) {
        setHoveredBlock(null);
      }
    };

    shell.addEventListener("mousemove", handleMouseMove);
    shell.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      shell.removeEventListener("mousemove", handleMouseMove);
      shell.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [activeBlockMenu?.isOpen, editor]);

  const displayedBlock = activeBlockMenu?.isOpen ? activeBlockMenu : hoveredBlock;

  if (!editor) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-[32px] border border-black/10 bg-white shadow-[0_25px_80px_-40px_rgba(15,23,42,0.45)]">
      <div className="border-b border-black/8 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-5 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <ToolbarButton
            label="Bold"
            isActive={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold size={18} />
          </ToolbarButton>
          <ToolbarButton
            label="Italic"
            isActive={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic size={18} />
          </ToolbarButton>
          <ToolbarButton
            label="Underline"
            isActive={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon size={18} />
          </ToolbarButton>
          <ToolbarButton
            label="Highlight"
            isActive={editor.isActive("highlight")}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
          >
            <Highlighter size={18} />
          </ToolbarButton>
          <ToolbarButton
            label="Heading"
            isActive={editor.isActive("heading", { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 size={18} />
          </ToolbarButton>
          <ToolbarButton
            label="Ordered List"
            isActive={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered size={18} />
          </ToolbarButton>
          <ToolbarButton
            label="Bullet List"
            isActive={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List size={18} />
          </ToolbarButton>
          <ToolbarButton
            label="Task List"
            isActive={editor.isActive("taskList")}
            onClick={() => editor.chain().focus().toggleTaskList().run()}
          >
            <ListTodo size={18} />
          </ToolbarButton>
          <ToolbarButton
            label="Quote"
            isActive={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote size={18} />
          </ToolbarButton>
          <ToolbarButton
            label="Code Block"
            isActive={editor.isActive("codeBlock")}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <Code2 size={18} />
          </ToolbarButton>
          <ToolbarButton
            label="Link"
            isActive={editor.isActive("link")}
            onClick={() => promptForLink(editor)}
          >
            <Link2 size={18} />
          </ToolbarButton>
          <ToolbarButton
            label="Insert Table"
            isActive={editor.isActive("table")}
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          >
            <Table2 size={18} />
          </ToolbarButton>
          <ToolbarButton
            label="Clear Content"
            className="border-red-200 bg-red-50 text-red-600 hover:border-red-300 hover:text-red-700"
            onClick={() => clearEditorContent(editor)}
          >
            <Trash2 size={18} />
          </ToolbarButton>
        </div>
      </div>

      <div className="grid gap-6 px-5 py-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div ref={editorShellRef} className="relative rounded-[28px] border border-slate-200 bg-white px-6 py-5">
          <BubbleMenu
            editor={editor}
            updateDelay={0}
            shouldShow={({ editor: currentEditor, from, to }) => {
              if (!currentEditor.isEditable) {
                return false;
              }

              if (from === to) {
                return false;
              }

              if (currentEditor.state.selection.empty) {
                return false;
              }

              return currentEditor.state.doc.textBetween(from, to).trim().length > 0;
            }}
            options={{ placement: "top", offset: 12 }}
          >
            <BubbleMenuToolbar editor={editor} />
          </BubbleMenu>

          {displayedBlock ? (
            <div
              data-block-actions
              className="absolute left-2 z-20 flex -translate-y-1/2 items-center gap-2"
              style={{ top: displayedBlock.top }}
            >
              <BlockHandleMenu
                editor={editor}
                block={displayedBlock.info}
                onOpenChange={(open) => {
                  if (open) {
                    setActiveBlockMenu({ ...displayedBlock, isOpen: true });
                    return;
                  }

                  setActiveBlockMenu(null);
                }}
              />
              <button
                type="button"
                aria-label="在下方添加段落"
                onClick={() => insertParagraphBelow(editor, displayedBlock.info)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:text-slate-800"
              >
                <Plus size={15} />
              </button>
            </div>
          ) : null}

          <div className="pl-10">
            <EditorContent editor={editor} />
          </div>
        </div>

        <aside className="rounded-[28px] border border-[#d6e5f8] bg-[linear-gradient(180deg,#f4f9ff_0%,#eef6ff_100%)] p-5 text-sm text-slate-700">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
            MVP Scope
          </p>
          <h2 className="mt-3 text-xl font-semibold text-slate-900">下一阶段能力</h2>
          <ul className="mt-4 space-y-3">
            <li>Slash command 面板与块插入菜单</li>
            <li>提及、评论、选区工具条</li>
            <li>Yjs 协同与在线光标</li>
            <li>文档目录、版本历史、导入导出</li>
          </ul>
          <div className="mt-6 rounded-2xl bg-white/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Why This Stack
            </p>
            <p className="mt-2 leading-6">
              当前组件基于 Tiptap + React，先把编辑体验和扩展位做稳，后面可以无缝挂接 Yjs、Hocuspocus、评论和 AI 能力。
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}