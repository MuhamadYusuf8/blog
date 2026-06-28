
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { createPost, updatePost } from "@/app/admin/posts/actions";
import { compressImage } from "@/lib/utils/compressImage";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Youtube from "@tiptap/extension-youtube";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import type { Post, PostFormData, PostStatus } from "@/lib/supabase/types";
import { slugify } from "@/lib/utils/slugify";

import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Image as ImageIcon,
  Type,
  Layers,
  UploadCloud,
  Save,
  X,
  Plus,
  GripVertical,
  Tag,
  Globe,
  Lock,
  ChevronDown,
  Sparkles,
  ArrowLeft,
  Eye,
} from "lucide-react";

type PostType = "karya-visual" | "foto-esai" | "jurnal";

interface ImageItem {
  id: string;
  name: string;
  preview: string | null;
  caption: string;
  file?: File;
}

export interface FotoEsaiData {
  headline: string;
  intro: string;
  images: ImageItem[];
  body: string;
}

const POST_TYPES: { id: PostType; label: string; sublabel: string; icon: React.ReactNode }[] = [
  {
    id: "karya-visual",
    label: "Karya Visual",
    sublabel: "Webtoon & Ilustrasi",
    icon: <Layers size={16} />,
  },
  {
    id: "foto-esai",
    label: "Foto Esai",
    sublabel: "Photo Essay",
    icon: <ImageIcon size={16} />,
  },
  {
    id: "jurnal",
    label: "Jurnal",
    sublabel: "Artikel & Teks",
    icon: <Type size={16} />,
  },
];

const CATEGORIES = ["Ilustrasi", "Webtoon", "Fotografi", "Behind the Scenes", "Tutorial", "Opini"];

const generateId = () => Math.random().toString(36).slice(2, 9);

function FloatingLabelInput({
  label,
  value,
  onChange,
  type = "text",
  prefix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  prefix?: string;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className="relative group">
      <div
        className={`
          flex items-center rounded-xl border transition-all duration-300
          ${focused
            ? "border-violet-500/60 bg-violet-500/[0.04] shadow-[0_0_20px_rgba(124,58,237,0.12)]"
            : "border-white/8 bg-white/[0.02] hover:border-white/15"
          }
        `}
      >
        {prefix && (
          <span className="pl-4 text-white/25 text-sm font-mono select-none">{prefix}</span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent px-4 pt-6 pb-2 text-sm text-white/90 outline-none placeholder-transparent peer"
          placeholder={label}
        />
      </div>
      <label
        className={`
          absolute left-4 transition-all duration-200 pointer-events-none select-none
          ${prefix ? "left-[calc(1rem+var(--prefix-w,0px))]" : "left-4"}
          ${active
            ? "top-2 text-[10px] font-semibold tracking-widest uppercase text-violet-400/80"
            : "top-1/2 -translate-y-1/2 text-sm text-white/30"
          }
        `}
      >
        {label}
      </label>
    </div>
  );
}

function ImageThumbnail({
  item,
  onRemove,
  onCaptionChange,
}: {
  item: ImageItem;
  onRemove: () => void;
  onCaptionChange: (v: string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.85, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -8 }}
      transition={{ type: "spring", stiffness: 340, damping: 26 }}
      className="relative group rounded-2xl overflow-hidden border border-white/8 bg-white/[0.02] hover:border-violet-500/30 transition-colors duration-300"
      style={{ aspectRatio: "9/16" }}
    >
      <div className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
        <div className="glass-pill p-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10">
          <GripVertical size={12} className="text-white/60" />
        </div>
      </div>

      <button
        onClick={onRemove}
        className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-full bg-red-500/80 backdrop-blur-md flex items-center justify-center hover:bg-red-500 transition-colors"
      >
        <X size={10} className="text-white" />
      </button>

      {item.preview ? (
        <img src={item.preview} alt={item.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-violet-950/30 to-slate-950/60">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <ImageIcon size={18} className="text-violet-400/60" />
          </div>
          <p className="text-[10px] text-white/30 text-center px-2 leading-tight">{item.name}</p>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <input
          type="text"
          value={item.caption}
          onChange={(e) => onCaptionChange(e.target.value)}
          placeholder="Tambah keterangan…"
          className="w-full bg-transparent text-[11px] text-white/80 placeholder-white/30 outline-none border-b border-white/20 focus:border-violet-400/60 pb-0.5 transition-colors"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </motion.div>
  );
}

function KaryaVisualEditor({
  images, setImages, onUpload, chapterTitle, setChapterTitle, episodeNumber, setEpisodeNumber
}: {
  images: ImageItem[], setImages: React.Dispatch<React.SetStateAction<ImageItem[]>>, onUpload: (files: File[]) => void,
  chapterTitle: string, setChapterTitle: (v: string) => void,
  episodeNumber: string, setEpisodeNumber: (v: string) => void
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addPlaceholder = () => {
    setImages((prev) => [
      ...prev,
      { id: generateId(), name: `halaman-${prev.length + 1}.png`, preview: null, caption: "" },
    ]);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f: any) => f.type.startsWith("image/"));
    onUpload(files);
  }, [onUpload]);

  return (
    <motion.div
      key="karya-visual"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 group
          ${isDragging
            ? "border-violet-500 bg-violet-500/[0.06] scale-[1.005]"
            : "border-white/10 bg-white/[0.015] hover:border-violet-500/40 hover:bg-violet-500/[0.03]"
          }
        `}
      >
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => onUpload(Array.from(e.target.files || []))} />
        <div className="py-12 flex flex-col items-center gap-4">
          <motion.div
            animate={isDragging ? { scale: 1.15, rotate: 6 } : { scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/10 border border-violet-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.15)]"
          >
            <UploadCloud size={28} className="text-violet-400" />
          </motion.div>
          <div className="text-center">
            <p className="text-white/80 font-medium text-sm mb-1">
              {isDragging ? "Lepaskan untuk mengunggah" : "Seret & lepas halaman karya Anda"}
            </p>
            <p className="text-white/25 text-xs">
              PNG, JPG, WebP · Rasio portrait direkomendasikan (9:16)
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 group-hover:bg-violet-500/15 transition-colors">
            <Plus size={12} className="text-violet-400" />
            <span className="text-violet-300 text-xs font-medium">Pilih dari komputer</span>
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-white/50 text-xs font-semibold tracking-widest uppercase">
                Galeri Panel
              </span>
              <span className="px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/20 text-violet-300 text-[10px] font-bold">
                {images.length} halaman
              </span>
            </div>
            <button
              onClick={addPlaceholder}
              className="flex items-center gap-1.5 text-xs text-white/30 hover:text-violet-400 transition-colors"
            >
              <Plus size={12} />
              Tambah halaman
            </button>
          </div>

          <LayoutGroup>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              <AnimatePresence>
                {images.map((img) => (
                  <ImageThumbnail
                    key={img.id}
                    item={img}
                    onRemove={() => setImages((prev) => prev.filter((i) => i.id !== img.id))}
                    onCaptionChange={(v) =>
                      setImages((prev) =>
                        prev.map((i) => (i.id === img.id ? { ...i, caption: v } : i))
                      )
                    }
                  />
                ))}
              </AnimatePresence>

              <motion.button
                layout
                onClick={addPlaceholder}
                className="rounded-2xl border-2 border-dashed border-white/8 hover:border-violet-500/30 bg-white/[0.01] hover:bg-violet-500/[0.03] flex flex-col items-center justify-center gap-2 transition-all duration-300 group"
                style={{ aspectRatio: "9/16" }}
              >
                <div className="w-8 h-8 rounded-xl bg-white/5 group-hover:bg-violet-500/10 flex items-center justify-center transition-colors">
                  <Plus size={14} className="text-white/30 group-hover:text-violet-400 transition-colors" />
                </div>
              </motion.button>
            </div>
          </LayoutGroup>
        </div>
      )}

      {/* Chapter info restored! */}
      <div className="grid grid-cols-2 gap-3">
        <FloatingLabelInput
          label="Judul Chapter / Seri"
          value={chapterTitle}
          onChange={setChapterTitle}
        />
        <FloatingLabelInput
          label="Nomor Episode"
          value={episodeNumber}
          onChange={setEpisodeNumber}
          prefix="Ep."
        />
      </div>
    </motion.div>
  );
}

function FotoEsaiEditor({ data, setData, onUpload }: { data: FotoEsaiData, setData: React.Dispatch<React.SetStateAction<FotoEsaiData>>, onUpload: (files: File[]) => void }) {
  return (
    <motion.div
      key="foto-esai"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      <div className="space-y-3">
        <div className="relative">
          <textarea
            value={data.headline}
            onChange={(e) => setData(prev => ({ ...prev, headline: e.target.value }))}
            className="w-full bg-transparent text-3xl font-bold text-white/90 placeholder-white/15 outline-none resize-none leading-tight"
            placeholder="Judul Esai Foto…"
            rows={2}
          />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
        <textarea
          value={data.intro}
          onChange={(e) => setData(prev => ({ ...prev, intro: e.target.value }))}
          className="w-full bg-transparent text-base text-white/50 placeholder-white/20 outline-none resize-none leading-relaxed"
          placeholder="Tulis pengantar singkat untuk esai foto ini…"
          rows={3}
        />
      </div>

      <div>
        <p className="text-white/30 text-[10px] font-semibold tracking-widest uppercase mb-3">
          Susun Foto
        </p>
        <div className="grid grid-cols-2 gap-3">
          {data.images.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              className={`relative rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden group ${i === 0 ? "col-span-2" : ""}`}
              style={{ aspectRatio: i === 0 ? "16/9" : "4/3" }}
            >
              {img.preview ? (
                <img src={img.preview} alt={img.name} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-amber-950/20 to-slate-950/60">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <ImageIcon size={18} className="text-amber-400/60" />
                  </div>
                  <p className="text-[10px] text-white/25">{img.name}</p>
                </div>
              )}
              
              <button
                onClick={() => setData(prev => ({ ...prev, images: prev.images.filter(x => x.id !== img.id) }))}
                className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-full bg-red-500/80 backdrop-blur-md flex items-center justify-center hover:bg-red-500 transition-colors"
              >
                <X size={10} className="text-white" />
              </button>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <input
                  type="text"
                  value={img.caption}
                  onChange={(e) => setData(prev => ({ ...prev, images: prev.images.map(x => x.id === img.id ? { ...x, caption: e.target.value } : x) }))}
                  placeholder="Keterangan foto…"
                  className="w-full bg-transparent text-xs text-white/80 placeholder-white/30 outline-none border-b border-white/20 focus:border-amber-400/60 pb-0.5 transition-colors relative z-20"
                />
              </div>
            </motion.div>
          ))}

          <motion.button
            className="relative rounded-2xl border-2 border-dashed border-white/8 hover:border-amber-500/30 bg-white/[0.01] flex items-center justify-center transition-all duration-300 group"
            style={{ aspectRatio: "4/3" }}
          >
            <input type="file" accept="image/*" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={(e) => onUpload(Array.from(e.target.files || []))} />
            <Plus size={20} className="text-white/20 group-hover:text-amber-400 transition-colors" />
          </motion.button>
        </div>
      </div>

      <div className="relative">
        <textarea
          value={data.body}
          onChange={(e) => setData(prev => ({ ...prev, body: e.target.value }))}
          className="w-full bg-transparent text-sm text-white/60 placeholder-white/20 outline-none resize-none leading-7"
          placeholder="Tulis narasi atau teks yang menemani foto-foto ini…"
          rows={8}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
    </motion.div>
  );
}

function JurnalEditor({ title, setTitle, editor }: { title: string, setTitle: (t: string) => void, editor: any }) {
  const wordCount = editor?.storage.characterCount?.words?.() ?? 0;

  return (
    <motion.div
      key="jurnal"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-0"
    >
      <div className="relative pb-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500" />
          <span className="text-[10px] font-semibold tracking-widest uppercase text-white/25">
            Mode Jurnal · Distraction-Free
          </span>
        </div>

        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent text-4xl font-bold text-white/90 placeholder-white/12 outline-none resize-none leading-tight mb-6 tracking-tight"
          placeholder="Judul tulisan Anda…"
          rows={2}
        />

        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-violet-500/20 via-white/5 to-transparent" />
          <Sparkles size={12} className="text-white/15" />
        </div>

        {/* Minimalist Toolbar restored! */}
        <div className="flex items-center gap-1 mb-6 p-1.5 rounded-xl bg-white/[0.025] border border-white/5 w-fit">
          {[
            { label: "B", cls: "font-bold", action: () => editor?.chain().focus().toggleBold().run(), active: editor?.isActive('bold') },
            { label: "I", cls: "italic", action: () => editor?.chain().focus().toggleItalic().run(), active: editor?.isActive('italic') },
            { label: "H1", cls: "text-[10px] font-bold", action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(), active: editor?.isActive('heading', { level: 1 }) },
            { label: "H2", cls: "text-[10px] font-bold", action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), active: editor?.isActive('heading', { level: 2 }) },
            { label: "\"", cls: "font-serif text-base leading-none", action: () => editor?.chain().focus().toggleBlockquote().run(), active: editor?.isActive('blockquote') },
            { label: "—", cls: "", action: () => editor?.chain().focus().setHorizontalRule().run(), active: false },
          ].map(({ label, cls, action, active }) => (
            <button
              key={label}
              onClick={action}
              className={`w-8 h-7 rounded-lg text-xs transition-all ${active ? 'bg-white/10 text-white' : 'text-white/35 hover:text-white/80 hover:bg-white/5'} ${cls}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="prose prose-invert prose-slate max-w-none text-white/70 min-h-[300px]" style={{
            '--tw-prose-body': 'rgba(255,255,255,0.7)',
            '--tw-prose-headings': 'rgba(255,255,255,0.9)',
        } as any}>
          <EditorContent editor={editor} />
        </div>

        <div className="flex items-center justify-end mt-4">
          <span className="text-[10px] text-white/15 font-mono">
            {wordCount} kata
          </span>
        </div>
      </div>
    </motion.div>
  );
}


// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PostEditor({ mode = "create", post }: { mode?: "create" | "edit", post?: Post }) {
  const router = useRouter();
  const { showToast } = useToast();
  const supabase = createBrowserSupabaseClient();
  const [isSaving, setIsSaving] = useState(false);

  const [postType, setPostType] = useState<PostType>("karya-visual");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [imagesKaryaVisual, setImagesKaryaVisual] = useState<ImageItem[]>([]);
  const [chapterTitle, setChapterTitle] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState("");

  const [dataFotoEsai, setDataFotoEsai] = useState<FotoEsaiData>({ headline: "", intro: "", images: [], body: "" });
  
  const [jurnalTitle, setJurnalTitle] = useState("");

  const [excerpt, setExcerpt] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapImage,
      TiptapLink.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Mulai menulis..." }),
      CharacterCount,
      Youtube.configure({ nocookie: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight,
    ],
    content: "",
  });

  useEffect(() => {
    if (post) {
      setTitle(post.title || "");
      setSlug(post.slug || "");
      setStatus(post.status || "draft");
      setCoverPreview(post.cover_image_url);
      setPostType(post.category as PostType || "karya-visual");
      setSelectedCategories(post.tags || []);
      setExcerpt(post.excerpt || "");
      setMetaTitle(post.meta_title || "");
      setMetaDescription(post.meta_description || "");
      
      try {
        const root = document.createElement("html");
        root.innerHTML = post.content_html || "";
        const dataNode = root.querySelector("#post-data-state");
        if (dataNode) {
          const state = JSON.parse(dataNode.getAttribute("data-state") || "{}");
          if (state.type === "karya-visual") {
             setImagesKaryaVisual(state.images || []);
             setChapterTitle(state.chapterTitle || "");
             setEpisodeNumber(state.episodeNumber || "");
          }
          if (state.type === "foto-esai") setDataFotoEsai(state.data || { headline: "", intro: "", images: [], body: "" });
          if (state.type === "jurnal" && editor) {
             editor.commands.setContent(state.content || "");
             setJurnalTitle(state.jurnalTitle || "");
          }
        } else if (editor) {
          editor.commands.setContent(post.content_html || "");
        }
      } catch (e) {
        console.error("Failed to parse post state", e);
      }
    }
  }, [post, editor]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleCoverUploadReal = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverPreview(URL.createObjectURL(file));
    try {
      const compressed = await compressImage(file);
      const filename = `covers/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
      const { data } = await supabase.storage.from("posts-images").upload(filename, compressed, { contentType: "image/webp" });
      if (data) {
        const { data: urlData } = supabase.storage.from("posts-images").getPublicUrl(data.path);
        setCoverPreview(urlData.publicUrl);
      }
    } catch (e) {
      showToast("Gagal mengupload cover", "error");
    }
  };

  const handleUploadImages = async (files: File[], type: "karya-visual" | "foto-esai") => {
    if (!files.length) return;
    
    const newItems = files.map(f => ({
      id: generateId(),
      name: f.name,
      preview: URL.createObjectURL(f),
      caption: "",
      file: f
    }));
    
    if (type === "karya-visual") {
      setImagesKaryaVisual(prev => [...prev, ...newItems]);
    } else {
      setDataFotoEsai(prev => ({ ...prev, images: [...prev.images, ...newItems] }));
    }
    
    for (const item of newItems) {
      if (!item.file) continue;
      try {
        const compressed = await compressImage(item.file);
        const filename = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
        
        const { data } = await supabase.storage.from("posts-images").upload(filename, compressed, { contentType: "image/webp" });
        if (data) {
          const { data: urlData } = supabase.storage.from("posts-images").getPublicUrl(data.path);
          
          if (type === "karya-visual") {
            setImagesKaryaVisual(prev => prev.map(i => i.id === item.id ? { ...i, preview: urlData.publicUrl } : i));
          } else {
            setDataFotoEsai(prev => ({ ...prev, images: prev.images.map(i => i.id === item.id ? { ...i, preview: urlData.publicUrl } : i) }));
          }
        }
      } catch (e) {
        console.error(e);
        showToast("Gagal mengupload gambar " + item.name, "error");
      }
    }
  };

  const generateSlugStr = (val: string) => slugify(val);

  const handleSave = async () => {
    if (!title.trim()) {
      showToast("Judul tidak boleh kosong", "error");
      return;
    }
    
    setIsSaving(true);
    try {
      let contentHtml = "";
      const editorState = { type: postType, images: [], data: {}, content: "", jurnalTitle: "", chapterTitle: "", episodeNumber: "" };
      
      if (postType === "karya-visual") {
        editorState.images = imagesKaryaVisual.map(({ file, ...rest }) => rest) as any;
        editorState.chapterTitle = chapterTitle as any;
        editorState.episodeNumber = episodeNumber as any;
        contentHtml = `<div class="karya-visual-gallery">` + 
          (chapterTitle ? `<h2>${chapterTitle} ${episodeNumber ? ' - Ep.' + episodeNumber : ''}</h2>` : '') +
          imagesKaryaVisual.map(img => `<figure><img src="${img.preview}" alt="${img.caption}" /><figcaption>${img.caption}</figcaption></figure>`).join("") +
          `</div>`;
      } else if (postType === "foto-esai") {
        editorState.data = {
           ...dataFotoEsai,
           images: dataFotoEsai.images.map(({ file, ...rest }) => rest)
        } as any;
        contentHtml = `<div class="foto-esai"><h2>${dataFotoEsai.headline}</h2><p class="intro">${dataFotoEsai.intro}</p><div class="grid">` +
          dataFotoEsai.images.map(img => `<figure><img src="${img.preview}" alt="${img.caption}" /><figcaption>${img.caption}</figcaption></figure>`).join("") +
          `</div><div class="body">${dataFotoEsai.body}</div></div>`;
      } else if (postType === "jurnal") {
        editorState.content = editor?.getHTML() as any;
        editorState.jurnalTitle = jurnalTitle as any;
        contentHtml = `<div class="jurnal-post"><h2>${jurnalTitle}</h2><div class="content">${editorState.content}</div></div>`;
      }
      
      contentHtml += `\n<div id="post-data-state" style="display:none;" data-state='${JSON.stringify(editorState).replace(/'/g, "&#39;")}'></div>`;
      
      const formData: PostFormData = {
        title,
        slug: slug || generateSlugStr(title),
        excerpt,
        content_html: contentHtml,
        cover_image_url: coverPreview || "",
        category: postType,
        tags: selectedCategories,
        status,
        meta_title: metaTitle || title,
        meta_description: metaDescription
      };
      
      const res = mode === "create" ? await createPost(formData) : await updatePost(post!.id, formData);
      if (res.success) {
        showToast("Post berhasil disimpan!", "success");
        if (mode === "create" && res.id) router.push(`/admin/posts/${res.id}/edit`);
      } else {
        showToast(res.error || "Gagal menyimpan post", "error");
      }
    } catch (e) {
      showToast("Gagal menyimpan post", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-64 -left-32 w-[600px] h-[600px] rounded-full bg-violet-900/8 blur-[120px]" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-fuchsia-900/6 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[300px] rounded-full bg-indigo-900/5 blur-[80px]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-2xl">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center hover:bg-white/8 hover:border-white/15 transition-all group">
              <ArrowLeft size={14} className="text-white/50 group-hover:text-white/80 transition-colors" />
            </button>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-white/25">Admin</span>
              <span className="text-white/15">/</span>
              <span className="text-white/25">Postingan</span>
              <span className="text-white/15">/</span>
              <span className="text-white/70 font-medium">{mode === "create" ? "Buat Baru" : "Edit Post"}</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full transition-colors ${
                status === "published" ? "bg-emerald-400" : "bg-amber-400/60"
              }`}
            />
            <span className="text-white/30 text-xs font-medium">
              {status === "published" ? "Terpublikasi" : "Draf"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => router.push("/admin/posts")} className="flex items-center gap-2 h-9 px-4 rounded-xl bg-white/[0.04] border border-white/8 text-white/50 text-sm font-medium hover:bg-white/[0.07] hover:text-white/70 hover:border-white/15 transition-all">
              <Save size={14} />
              <span className="hidden sm:inline">Batal</span>
            </button>
            <motion.button
              onClick={handleSave}
              disabled={isSaving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 h-9 px-5 rounded-xl bg-violet-600 text-white text-sm font-semibold shadow-[0_0_24px_rgba(124,58,237,0.35)] hover:bg-violet-500 hover:shadow-[0_0_32px_rgba(124,58,237,0.5)] transition-all disabled:opacity-50"
            >
              {isSaving ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles size={13} />}
              {mode === "create" ? "Publish" : "Simpan"}
            </motion.button>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 py-8 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8">
          <div className="space-y-6 min-w-0">
            <div
              className="p-1.5 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl"
              style={{ display: "inline-flex", width: "100%" }}
            >
              <LayoutGroup id="post-type-pill">
                <div className="flex w-full gap-1">
                  {POST_TYPES.map((pt) => (
                    <button
                      key={pt.id}
                      onClick={() => setPostType(pt.id)}
                      className="relative flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl z-10 transition-colors duration-200"
                    >
                      {postType === pt.id && (
                        <motion.div
                          layoutId="post-type-pill"
                          className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-600/25 to-fuchsia-600/15 border border-violet-500/25 shadow-[0_0_20px_rgba(124,58,237,0.12)]"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span
                        className={`relative transition-colors duration-200 ${
                          postType === pt.id ? "text-violet-300" : "text-white/30"
                        }`}
                      >
                        {pt.icon}
                      </span>
                      <div className="relative text-left">
                        <p
                          className={`text-sm font-semibold leading-none mb-0.5 transition-colors duration-200 ${
                            postType === pt.id ? "text-white/90" : "text-white/40"
                          }`}
                        >
                          {pt.label}
                        </p>
                        <p
                          className={`text-[10px] leading-none transition-colors duration-200 ${
                            postType === pt.id ? "text-violet-400/70" : "text-white/20"
                          }`}
                        >
                          {pt.sublabel}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </LayoutGroup>
            </div>

            <div className="glass-panel-dark rounded-2xl p-6 border border-white/5 bg-white/[0.02] backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-semibold tracking-widest uppercase text-white/20">
                  Judul Postingan
                </span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slug) setSlug(generateSlugStr(e.target.value));
                }}
                className="w-full bg-transparent text-2xl font-bold text-white/90 placeholder-white/12 outline-none"
                placeholder="Nama postingan atau karya ini…"
              />
            </div>

            <div className="glass-panel-dark rounded-2xl p-6 border border-white/5 bg-white/[0.02] backdrop-blur-xl">
              <AnimatePresence mode="wait">
                {postType === "karya-visual" && <KaryaVisualEditor images={imagesKaryaVisual} setImages={setImagesKaryaVisual} onUpload={(files) => handleUploadImages(files, "karya-visual")} chapterTitle={chapterTitle} setChapterTitle={setChapterTitle} episodeNumber={episodeNumber} setEpisodeNumber={setEpisodeNumber} />}
                {postType === "foto-esai" && <FotoEsaiEditor data={dataFotoEsai} setData={setDataFotoEsai} onUpload={(files) => handleUploadImages(files, "foto-esai")} />}
                {postType === "jurnal" && <JurnalEditor title={jurnalTitle} setTitle={setJurnalTitle} editor={editor} />}
              </AnimatePresence>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="xl:sticky xl:top-24 space-y-4">
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl p-5">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-white/25 mb-4">
                  Status Publikasi
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{
                        backgroundColor:
                          status === "published"
                            ? "rgba(52,211,153,0.15)"
                            : "rgba(251,191,36,0.10)",
                      }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center border"
                      style={{
                        borderColor:
                          status === "published"
                            ? "rgba(52,211,153,0.25)"
                            : "rgba(251,191,36,0.2)",
                      }}
                    >
                      {status === "published" ? (
                        <Globe size={14} className="text-emerald-400" />
                      ) : (
                        <Lock size={14} className="text-amber-400/70" />
                      )}
                    </motion.div>
                    <div>
                      <p className="text-sm font-medium text-white/80">
                        {status === "published" ? "Publik" : "Draf"}
                      </p>
                      <p className="text-[10px] text-white/25">
                        {status === "published" ? "Terlihat semua orang" : "Hanya Anda"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setStatus((s) => (s === "draft" ? "published" : "draft"))
                    }
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                      status === "published" ? "bg-emerald-500/30" : "bg-white/8"
                    }`}
                  >
                    <motion.div
                      animate={{ x: status === "published" ? 24 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className={`absolute top-1 w-4 h-4 rounded-full transition-colors duration-300 ${
                        status === "published" ? "bg-emerald-400" : "bg-white/30"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl p-5">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-white/25 mb-4">
                  Jadwal Tayang
                </p>
                <div className="relative">
                  <div className="flex items-center rounded-xl border border-white/8 bg-white/[0.02] hover:border-white/15 transition-all duration-300">
                    <input
                      type="datetime-local"
                      className="w-full bg-transparent px-4 py-3 text-sm text-white/50 outline-none appearance-none"
                    />
                    <ChevronDown size={14} className="mr-4 text-white/20 shrink-0 pointer-events-none" />
                  </div>
                </div>
                <p className="mt-2 text-[10px] text-white/20">
                  Kosongkan untuk terbit segera saat dipublikasi.
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl p-5">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-white/25 mb-4">
                  Gambar Sampul
                </p>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverUploadReal}
                />
                <button
                  onClick={() => coverInputRef.current?.click()}
                  className="w-full rounded-xl border-2 border-dashed border-white/8 hover:border-violet-500/30 bg-white/[0.01] hover:bg-violet-500/[0.03] transition-all duration-300 overflow-hidden relative"
                  style={{ aspectRatio: "16/9" }}
                >
                  {coverPreview ? (
                    <img
                      src={coverPreview}
                      alt="Cover"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 h-full">
                      <UploadCloud size={20} className="text-white/20" />
                      <p className="text-[10px] text-white/25">Unggah sampul</p>
                    </div>
                  )}
                </button>
                {coverPreview && (
                  <button
                    onClick={() => setCoverPreview(null)}
                    className="mt-2 w-full text-[10px] text-white/25 hover:text-red-400 transition-colors"
                  >
                    Hapus sampul
                  </button>
                )}
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl p-5">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-white/25 mb-4">
                  URL Permalink
                </p>
                <FloatingLabelInput
                  label="Slug URL"
                  value={slug}
                  onChange={(v) => setSlug(generateSlugStr(v))}
                  prefix="/posts/"
                />
                {slug && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-[10px] text-white/20 font-mono truncate"
                  >
                    yourdomain.com/posts/{slug}
                  </motion.p>
                )}
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-white/25">
                    Kategori
                  </p>
                  <Tag size={11} className="text-white/20" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => {
                    const selected = selectedCategories.includes(cat);
                    return (
                      <motion.button
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        whileTap={{ scale: 0.93 }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                          selected
                            ? "bg-violet-500/20 border border-violet-500/40 text-violet-300 shadow-[0_0_12px_rgba(124,58,237,0.15)]"
                            : "bg-white/[0.03] border border-white/8 text-white/35 hover:border-white/15 hover:text-white/55"
                        }`}
                      >
                        {selected && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-block mr-1"
                          >
                            ✓
                          </motion.span>
                        )}
                        {cat}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* SEO & Excerpt (Restored) */}
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl p-5 space-y-4">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-white/25">
                  SEO & Ringkasan
                </p>
                <div className="space-y-3">
                  <FloatingLabelInput label="Ringkasan Singkat" value={excerpt} onChange={setExcerpt} />
                  <FloatingLabelInput label="Meta Title" value={metaTitle} onChange={setMetaTitle} />
                  <FloatingLabelInput label="Meta Description" value={metaDescription} onChange={setMetaDescription} />
                </div>
              </div>

              <button className="w-full py-3 rounded-xl border border-red-500/10 text-red-400/40 hover:border-red-500/25 hover:text-red-400/70 hover:bg-red-500/[0.03] text-xs font-medium transition-all duration-300 flex items-center justify-center gap-2">
                <X size={12} />
                Buang semua perubahan
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
