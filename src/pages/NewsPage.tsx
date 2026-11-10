"use client";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import * as Select from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { normalizeImagePaths } from "../utils/news";
import type { NewsItemLang, NewsJson } from "../utils/news";

type LangKey = "ro" | "ru" | "en";

type NewsCard = Omit<NewsItemLang, "image"> & {
  id: string;
  idNum: number;
  idx: number;
  image?: string;
};

type Option = { value: string; label: string };

function RoundedSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
}) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-[#5F9CFF]">
        <Select.Value />
        <Select.Icon>
          <ChevronDown className="w-4 h-4" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className="overflow-hidden z-20 rounded-2xl border border-gray-200 bg-white shadow-lg">
          <Select.Viewport className="p-1">
            {options.map(({ value: v, label }) => (
              <Select.Item
                key={v}
                value={v}
                className="relative flex items-center px-3 py-2 rounded-md text-sm cursor-pointer focus:bg-blue-50 focus:outline-none"
              >
                <Select.ItemText>{label}</Select.ItemText>
                <Select.ItemIndicator className="absolute right-2">
                  <Check className="w-4 h-4 text-blue-500" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

const NewsPage = () => {
  const { t, i18n } = useTranslation(undefined, { keyPrefix: "newsPage" });
  const lang = (i18n.language?.split("-")[0] ?? "en") as LangKey;

  const [raw, setRaw] = useState<NewsJson | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("asc"); // asc => 1→N
  const [visible, setVisible] = useState(6);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch("/data/news.json", { cache: "no-store" });
        const json = (await res.json()) as NewsJson;
        if (isMounted) setRaw(json);
      } catch (e) {
        console.error("Failed to load news.json", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setVisible(6);
  }, [lang]);

  const localizedNews: NewsCard[] = useMemo(() => {
    if (!raw) return [];
    return Object.entries(raw)
      .map(([id, item], idx) => {
        const content = item[lang] ?? item.en;
        const images = normalizeImagePaths(content.image);
        return {
          id,
          idNum: Number(id),
          idx,
          ...content,
          image: images[0],
        };
      })
      .sort((a, b) => a.idNum - b.idNum);
  }, [raw, lang]);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    localizedNews.forEach((n) => s.add(n.tag));
    return Array.from(s);
  }, [localizedNews]);

  const filteredSorted = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = localizedNews.filter((n) => {
      const matchesTitle = q === "" || n.title.toLowerCase().includes(q);
      const matchesTag = tag === "all" || n.tag === tag;
      return matchesTitle && matchesTag;
    });
    return filtered.sort((a, b) =>
      sortOrder === "asc" ? a.idNum - b.idNum : b.idNum - a.idNum
    );
  }, [localizedNews, search, tag, sortOrder]);

  const shown = filteredSorted.slice(0, visible);
  const hasMore = filteredSorted.length > visible;

  if (loading) {
    return (
      <section className="grid grid-cols-full w-full min-h-[60vh] place-items-center">
        <div className="text-[#3F3F40]">{t("loading") ?? "Loading…"}</div>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-full items-start w-full">
      <div className="col-span-full flex flex-col md:flex-row md:items-end md:justify-between mt-32 gap-4 md:gap-6 container mx-auto px-4">
        <div className="flex flex-col">
          <h1 className="text-2xl">{t("header")}</h1>
          <h2 className="text-[#3F3F40]">{t("subHeader")}</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-[#BDBFC0] rounded-2xl px-4 py-2 bg-white/80 backdrop-blur w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#5F9CFF]"
          />

          <RoundedSelect
            value={tag}
            onChange={(v) => {
              setTag(v);
              setVisible(6);
            }}
            options={[
              { value: "all", label: t("all") },
              ...allTags.map((tg) => ({ value: tg, label: tg })),
            ]}
          />

          <RoundedSelect
            value={sortOrder}
            onChange={(v) => setSortOrder(v as "asc" | "desc")}
            options={[
              { value: "asc", label: t("fromOldToNew") },
              { value: "desc", label: t("fromNewToOld") },
            ]}
          />
        </div>
      </div>

      <div className="col-span-full container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 col-span-full">
          {shown.map((item) => (
            <Link
              to={`/news/${item.id}`}
              key={item.id}
              className="col-span-1 rounded-2xl small-shadow overflow-hidden bg-white"
            >
              {item.image ? (
                <img
                  className="rounded-t-2xl w-full h-48 object-cover"
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                />
              ) : (
                <div className="h-48 bg-[#f1f1f1]" aria-hidden="true" />
              )}
              <div className="p-4">
                <div className="flex gap-1 items-center">
                  <span className="text-xs text-[#3F3F40]">{item.data} •</span>
                  <span className="text-xs rounded-full border border-[#BEDBFF] text-[#145EEC] py-1 px-3">
                    {item.tag}
                  </span>
                </div>
                <h3 className="mt-3 mb-4 line-clamp-2">{item.title}</h3>
                <p className="text-[#3F3F40] line-clamp-3 mb-4">{item.text}</p>
              </div>
            </Link>
          ))}
        </div>

        {shown.length === 0 && (
          <div className="text-[#3F3F40] py-12 text-center">
            {t("noResults") ?? "No results found."}
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center">
            <button
              onClick={() => setVisible((v) => v + 6)}
              className="mt-8 px-6 py-3 rounded-2xl cursor-pointer border border-[#BDBFC0] hover:border-[#5F9CFF] hover:text-[#145EEC] transition"
            >
              {t("showMore") ?? "Show more"}
            </button>
          </div>
        )}
      </div>

      <div className="col-span-full" />
    </section>
  );
};

export default NewsPage;
