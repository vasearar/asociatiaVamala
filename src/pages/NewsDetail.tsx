"use client";

import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FileText } from "lucide-react";
import ArticleGallery from "../components/ArticleGallery";
import { normalizeImagePaths } from "../utils/news";
import type { NewsItemLang, NewsJson } from "../utils/news";

type LangKey = "ro" | "ru" | "en";

const removeInlineAttachmentList = (text: string) => {
  const markers = ["Documente anexate:", "Прилагаемые документы:", "Attached documents:"];
  const marker = markers.find((value) => text.includes(value));

  if (!marker) return text;

  const start = text.indexOf(`\n\n${marker}`);
  if (start === -1) return text;

  const closingMarkers = ["\n\nVă mulțumim", "\n\nБлагодарим", "\n\nWe appreciate"];
  const closing = closingMarkers
    .map((value) => text.indexOf(value, start))
    .filter((index) => index !== -1)
    .sort((a, b) => a - b)[0];

  return closing === undefined ? text.slice(0, start) : text.slice(0, start) + text.slice(closing);
};

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation(undefined, { keyPrefix: "newsDetail" });
  const lang = (i18n.language?.split("-")[0] ?? "en") as LangKey;

  const [raw, setRaw] = useState<NewsJson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/data/news.json", { cache: "no-store" });
        const json = (await res.json()) as NewsJson;
        if (mounted) setRaw(json);
      } catch (e) {
        console.error("Failed to load news.json", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const item = useMemo<NewsItemLang | null>(() => {
    if (!raw || !id) return null;
    const record = raw[id];
    if (!record) return null;
    // prefer current lang; fallback to EN
    return record[lang] ?? record.en;
  }, [raw, id, lang]);

  const images = useMemo(() => normalizeImagePaths(item?.image), [item]);
  const articleText = useMemo(
    () => (item ? removeInlineAttachmentList(item.text) : ""),
    [item]
  );

  if (loading) {
    return (
      <section className="grid grid-cols-full w-full min-h-[60vh] place-items-center">
        <div className="text-[#3F3F40]">{t("loading") ?? "Loading…"}</div>
      </section>
    );
  }

  if (!item) {
    return (
      <section className="grid grid-cols-full w-full min-h-[60vh] place-items-center">
        <div className="text-center">
          <p className="mb-4">
            {t("notFound") ?? "This news item was not found."}
          </p>
          <Link to="/news" className="text-[#145EEC] underline">
            {t("backToNews") ?? "← Back to all news"}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <article className="grid grid-cols-full w-full">
      <div className="col-span-full container mx-auto mt-32">
        <Link to="/news" className="text-[#145EEC] hover:underline">
          {t("backToNews") ?? "← Back to all news"}
        </Link>

        <ArticleGallery images={images} title={item.title} />

        <div className="mt-6 flex items-center gap-2">
          <span className="text-sm text-[#3F3F40]">{item.data} •</span>
          <span className="text-xs rounded-full border border-[#BEDBFF] text-[#145EEC] py-1 px-3">
            {item.tag}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl mt-3">{item.title}</h1>

        <div className="mt-4 text-[#3F3F40] leading-7 whitespace-pre-line">
          {articleText}
        </div>

        {item.attachments && item.attachments.length > 0 && (
          <section className="mt-8" aria-label={t("attachments")}>
            <h2 className="text-xl mb-3">{t("attachments")}</h2>
            <div className="flex flex-wrap gap-3">
              {item.attachments.map((attachment) => (
                <a
                  key={`${attachment.path}-${attachment.name}`}
                  href={attachment.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border border-[#BDBFC0] bg-white px-4 py-3 text-[#3F3F40] transition hover:border-[#5F9CFF] hover:text-[#145EEC] focus:outline-none focus:ring-2 focus:ring-[#5F9CFF]"
                >
                  <FileText className="size-5" aria-hidden="true" />
                  <span>{attachment.name}</span>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
};

export default NewsDetail;
